
"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import {
    onAuthStateChanged,
    signOut as firebaseSignOut,
    deleteUser,
    type User as FirebaseUser,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { clearUserData } from "@/lib/indexed-db";
import { ref, get, set } from "firebase/database";
import { syncUserData } from "@/lib/cloud-sync";
import { loginCredentialsManager } from "@/lib/login-credentials";
import { detectDeviceInfo } from "@/lib/device-detection";
import { secureLog } from "@/lib/secure-logger";

export type UserPlan = "Free" | "Pro";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  className: string | null;
  age: number | null;
  fatherName: string | null;
  emailVerified: boolean;
  plan: UserPlan;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserPlan: (plan: UserPlan) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const provider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSentLoginNotification, setHasSentLoginNotification] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    secureLog('info', 'AUTH CONTEXT EFFECT RUNNING');
    
    // AbortController for cleanup
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      secureLog('info', 'AUTH STATE CHANGED', { hasUser: !!firebaseUser });
      secureLog('info', 'User email domain', { domain: firebaseUser?.email?.split('@')[1] });
      
      if (firebaseUser) {
        try {
          // Load user data from Firebase Realtime Database
          const userRef = ref(db, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val();

          // Check if this is a new user (no existing data)
          const isNewUser = !userData;

          const appUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData?.displayName || 'User',
            emailVerified: firebaseUser.emailVerified,
            className: userData?.className || 'Not set',
            age: userData?.age || null,
            fatherName: userData?.fatherName || 'N/A',
            plan: userData?.plan || 'Free', // Load plan from Firebase
          };

          secureLog('info', 'Setting user with plan', { plan: appUser.plan });

          // FIXED: Only run device detection on actual login, not on every page navigation
          // Check if this is a fresh login (not just auth state restoration)
          const lastLoginCheck = sessionStorage.getItem(`lastLoginCheck_${firebaseUser.uid}`);
          const currentTime = Date.now();
          const isRecentLogin = !lastLoginCheck || (currentTime - parseInt(lastLoginCheck)) > 300000; // 5 minutes

          if (firebaseUser.email && firebaseUser.emailVerified && isRecentLogin) {
            // Mark that we've checked this login session
            sessionStorage.setItem(`lastLoginCheck_${firebaseUser.uid}`, currentTime.toString());
            
            try {
              // FIXED: Let the API handle device detection with proper server-side IP
              const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side Request';
              
              // Get basic device info for client-side checking
              const clientDeviceInfo = await detectDeviceInfo(userAgent);

              // Check if we should send notification (only for untrusted devices)
              const shouldNotify = await loginCredentialsManager.shouldSendNotification(firebaseUser.uid, clientDeviceInfo);

              if (shouldNotify) {
                secureLog('warn', 'Sending login notification for untrusted device');

                const idToken = await firebaseUser.getIdToken();

                // FIXED: Send userAgent to API, let API handle device detection with real IP
                const response = await fetch('/api/notifications/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    idToken,
                    userEmail: firebaseUser.email,
                    userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
                    userAgent, // Send userAgent instead of deviceInfo
                  }),
                  signal
                });

                const notificationResult = await response.json();
                secureLog('info', 'Login notification sent', { success: notificationResult.success });

                if (response.ok && notificationResult.success) {
                  secureLog('info', 'Login notification sent successfully');
                  
                  // FIXED: Use server-side detected device info for credential storage
                  if (notificationResult.deviceInfo) {
                    setTimeout(async () => {
                      try {
                        await loginCredentialsManager.storeLoginCredentials(firebaseUser.uid, notificationResult.deviceInfo);
                        secureLog('info', 'Login credentials updated with server-side device info');
                      } catch (error: any) {
                        secureLog('warn', 'Failed to store login credentials (non-critical)', { error: error.message });
                      }
                    }, 1000);
                  }
                } else {
                  secureLog('warn', 'Login notification failed', { error: notificationResult.error });
                }
              } else {
                secureLog('info', 'Trusted device detected - no notification needed');
                
                // For trusted devices, still update credentials with client-side info
                setTimeout(async () => {
                  try {
                    await loginCredentialsManager.storeLoginCredentials(firebaseUser.uid, clientDeviceInfo);
                    secureLog('info', 'Login credentials updated for trusted device');
                  } catch (error: any) {
                    secureLog('warn', 'Failed to store login credentials (non-critical)', { error: error.message });
                  }
                }, 1000);
              }

            } catch (error: any) {
              secureLog('warn', 'Login credentials error (non-critical)', { error: error.message });
              // Don't fail the login if credential storage fails
            }
          } else {
            secureLog('info', 'Skipping device detection - not a fresh login or recent check');
          }

          setUser(appUser);

          // Trigger welcome notifications for new users (only if email is verified)
          if (isNewUser && firebaseUser.emailVerified) {
            secureLog('info', 'New verified user detected - triggering welcome notifications');
            secureLog('info', 'New user details', {
              hasEmail: !!firebaseUser.email,
              hasDisplayName: !!firebaseUser.displayName,
              emailVerified: firebaseUser.emailVerified
            });
            
            try {
              const idToken = await firebaseUser.getIdToken();
              secureLog('info', 'Sending welcome email to new user');
              
              const response = await fetch('/api/notifications/welcome', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  idToken,
                  userEmail: firebaseUser.email,
                  userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student'
                }),
                signal
              });

              secureLog('info', 'Welcome email response', { status: response.status });
              const responseData = await response.json();
              secureLog('info', 'Welcome email result', { success: responseData.success });

              if (response.ok && responseData.success) {
                secureLog('info', 'Welcome email sent successfully');
              } else {
                secureLog('error', 'Failed to send welcome email', {
                  status: response.status,
                  error: responseData?.error || 'Unknown error',
                  response: responseData
                });
              }
            } catch (error: any) {
              secureLog('error', 'Welcome email network error', {
                message: error.message,
                name: error.name,
                stack: error.stack?.substring(0, 200) // Truncate stack trace
              });
            }
          } else if (isNewUser && !firebaseUser.emailVerified) {
            secureLog('info', 'New unverified user - welcome email pending verification');
          }

          // Initialize cloud sync for cross-device data synchronization
          try {
            await syncUserData(firebaseUser.uid);
            secureLog('info', 'Cloud sync initialized for user');
          } catch (error) {
            secureLog('error', 'Failed to initialize cloud sync', error);
          }

          // Redirect from auth pages - check for redirect parameter
          if (['/login', '/signup', '/forgot-password'].includes(pathname)) {
            const currentUrl = new URL(window.location.href);
            const redirect = currentUrl.searchParams.get('redirect');

            if (redirect) {
              secureLog('info', 'Redirecting from auth page', { hasRedirect: !!redirect });
              setTimeout(() => {
                // Decode and validate redirect URL to prevent open redirect
                let decodedRedirect;
                try {
                  decodedRedirect = decodeURIComponent(redirect);
                  // Only allow redirects within the app domain
                  if (decodedRedirect.startsWith('/') && !decodedRedirect.startsWith('//')) {
                    router.push(decodedRedirect);
                  } else {
                    secureLog('warn', 'Invalid redirect URL detected');
                    router.push('/dashboard');
                  }
                } catch (error) {
                  secureLog('warn', 'Error decoding redirect', error);
                  router.push('/dashboard');
                }
              }, 100);
            } else {
              secureLog('info', 'Redirecting from auth page to dashboard');
              setTimeout(() => {
                router.push('/dashboard');
              }, 100);
            }
          }
        } catch (error) {
          secureLog('error', 'Error loading user data from Firebase', error);
          // Fallback to basic user data if Firebase fails
          const appUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            emailVerified: firebaseUser.emailVerified,
            className: 'Not set',
            age: null,
            fatherName: 'N/A',
            plan: 'Free',
          };
          setUser(appUser);
        }
      } else {
        secureLog('info', 'No Firebase user - setting null');
        setUser(null);
      }
      
      // CRITICAL: Always set loading to false after auth state is determined
      secureLog('info', 'Setting loading to false');
      setLoading(false);
    });

    return () => {
      abortController.abort();
      unsubscribe();
    };
  }, [router, pathname]);


  const logout = async () => {
    // Clear session storage for login checks
    if (user?.uid) {
      sessionStorage.removeItem(`lastLoginCheck_${user.uid}`);
      // Clear login credentials cache
      await loginCredentialsManager.clearUserCredentials(user.uid);
    }
    
    await firebaseSignOut(auth);
    setUser(null);
    setHasSentLoginNotification(false); // Reset notification flag for next login
    router.push('/login');
  };
  
  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }

    const userId = currentUser.uid;
    
    try {
      // Clear user data from Firebase Realtime Database
      const userDbRef = ref(db, `users/${userId}`);
      await set(userDbRef, null);
      
      // Clear local user data
      await clearUserData(userId);
      
      // Delete Firebase Auth user (must be last)
      await deleteUser(currentUser);
      
      // Update local state
      setUser(null);
      
      secureLog('info', 'User account deleted successfully');
    } catch (error: any) {
      secureLog('error', 'Failed to delete user account', { error: error.message });
      
      // Handle specific Firebase errors
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log in again before deleting your account.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error('Failed to delete account. Please try again.');
      }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Store user data in Realtime Database for Google users
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        // If new Google user, create profile with default values
        if (!snapshot.exists()) {
          await set(userRef, {
            uid: user.uid,
            fullName: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email,
            className: 'Not set',
            age: null,
            fatherName: 'N/A',
            plan: 'Free',
            emailVerified: true, // Google users are pre-verified
            createdAt: new Date().toISOString()
          });
        }
      }
      
      // Google users skip verification - redirect directly to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      throw error;
    }
  };

  const updateUserPlan = async (plan: UserPlan) => {
    if (user) {
        try {
          // Save complete user data to Firebase
          const userRef = ref(db, `users/${user.uid}`);
          const updatedUserData = {
            ...user,
            plan,
            updatedAt: new Date().toISOString()
          };
          
          await set(userRef, updatedUserData);
          
          // Update local state immediately for instant UI feedback
          setUser(prevUser => prevUser ? { ...prevUser, plan } : null);
          
          secureLog('info', 'User plan updated successfully', { plan });
          
          // Force reload user data from Firebase to ensure consistency
          setTimeout(async () => {
            try {
              const snapshot = await get(userRef);
              const freshData = snapshot.val();
              if (freshData) {
                setUser(prevUser => prevUser ? { ...prevUser, plan: freshData.plan } : null);
                secureLog('info', 'User plan refreshed from Firebase', { plan: freshData.plan });
              }
            } catch (error) {
              secureLog('warn', 'Failed to refresh user data', error);
            }
          }, 500);
        } catch (error) {
          secureLog('error', 'Error updating user plan', error);
          throw new Error('Failed to update plan. Please try again.');
        }
    } else {
        throw new Error("No user is signed in to update plan.");
    }
  };
  
  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      deleteAccount,
      signInWithGoogle,
      updateUserPlan,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
