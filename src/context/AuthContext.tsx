
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
import { SecureLogger } from "@/lib/secure-logger";

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
    SecureLogger.info('AUTH CONTEXT EFFECT RUNNING');
    
    // AbortController for cleanup
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      SecureLogger.info('AUTH STATE CHANGED', { hasUser: !!firebaseUser });
      SecureLogger.info('User email domain', { domain: firebaseUser?.email?.split('@')[1] });
      
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

          SecureLogger.info('Setting user with plan', { plan: appUser.plan });

          // SMART LOGIN NOTIFICATION - Only send when credentials don't match trusted devices
          if (firebaseUser.email && firebaseUser.emailVerified) {
            try {
              // Detect device information
              const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side Request';
              const deviceInfo = await detectDeviceInfo(userAgent);

              // Check if we should send notification (only for untrusted devices)
              const shouldNotify = await loginCredentialsManager.shouldSendNotification(firebaseUser.uid, deviceInfo);

              if (shouldNotify) {
                SecureLogger.warn('Sending login notification for untrusted device');

                const idToken = await firebaseUser.getIdToken();

                const response = await fetch('/api/notifications/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    idToken,
                    userEmail: firebaseUser.email,
                    userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
                    deviceInfo,
                  }),
                  signal
                });

                const notificationResult = await response.json();
                SecureLogger.info('Login notification sent', { success: notificationResult.success });

                if (response.ok && notificationResult.success) {
                  SecureLogger.info('Login notification sent successfully');
                } else {
                  SecureLogger.warn('Login notification failed', { error: notificationResult.error });
                }
              } else {
                SecureLogger.info('Trusted device detected - no notification needed');
              }

              // Always store/update login credentials (for both trusted and untrusted devices)
              await loginCredentialsManager.storeLoginCredentials(firebaseUser.uid, deviceInfo);
              SecureLogger.info('Login credentials updated');

            } catch (error: any) {
              SecureLogger.warn('Login credentials error (non-critical)', { error: error.message });
              // Don't fail the login if credential storage fails
            }
          }

          setUser(appUser);

          // Trigger welcome notifications for new users (only if email is verified)
          if (isNewUser && firebaseUser.emailVerified) {
            SecureLogger.info('New verified user detected - triggering welcome notifications');
            SecureLogger.info('New user details', {
              hasEmail: !!firebaseUser.email,
              hasDisplayName: !!firebaseUser.displayName,
              emailVerified: firebaseUser.emailVerified
            });
            
            try {
              const idToken = await firebaseUser.getIdToken();
              SecureLogger.info('Sending welcome email to new user');
              
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

              SecureLogger.info('Welcome email response', { status: response.status });
              const responseData = await response.json();
              SecureLogger.info('Welcome email result', { success: responseData.success });

              if (response.ok && responseData.success) {
                SecureLogger.info('Welcome email sent successfully');
              } else {
                SecureLogger.error('Failed to send welcome email', {
                  status: response.status,
                  error: responseData.error
                });
              }
            } catch (error: any) {
              SecureLogger.error('Welcome email network error', { message: error.message });
            }
          } else if (isNewUser && !firebaseUser.emailVerified) {
            SecureLogger.info('New unverified user - welcome email pending verification');
          }

          // Initialize cloud sync for cross-device data synchronization
          try {
            await syncUserData(firebaseUser.uid);
            SecureLogger.info('Cloud sync initialized for user');
          } catch (error) {
            SecureLogger.error('Failed to initialize cloud sync', error);
          }

          // Redirect from auth pages - check for redirect parameter
          if (['/login', '/signup', '/forgot-password'].includes(pathname)) {
            const currentUrl = new URL(window.location.href);
            const redirect = currentUrl.searchParams.get('redirect');

            if (redirect) {
              SecureLogger.info('Redirecting from auth page', { hasRedirect: !!redirect });
              setTimeout(() => {
                // Decode and validate redirect URL to prevent open redirect
                let decodedRedirect;
                try {
                  decodedRedirect = decodeURIComponent(redirect);
                  // Only allow redirects within the app domain
                  if (decodedRedirect.startsWith('/') && !decodedRedirect.startsWith('//')) {
                    router.push(decodedRedirect);
                  } else {
                    SecureLogger.warn('Invalid redirect URL detected');
                    router.push('/dashboard');
                  }
                } catch (error) {
                  SecureLogger.warn('Error decoding redirect', error);
                  router.push('/dashboard');
                }
              }, 100);
            } else {
              SecureLogger.info('Redirecting from auth page to dashboard');
              setTimeout(() => {
                router.push('/dashboard');
              }, 100);
            }
          }
        } catch (error) {
          SecureLogger.error('Error loading user data from Firebase', error);
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
        SecureLogger.info('No Firebase user - setting null');
        setUser(null);
      }
      
      // CRITICAL: Always set loading to false after auth state is determined
      SecureLogger.info('Setting loading to false');
      setLoading(false);
    });

    return () => {
      abortController.abort();
      unsubscribe();
    };
  }, [router, pathname]);


  const logout = async () => {
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
      
      SecureLogger.info('User account deleted successfully');
    } catch (error: any) {
      SecureLogger.error('Failed to delete user account', { error: error.message });
      
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
      await signInWithPopup(auth, provider);
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
          
          SecureLogger.info('User plan updated', { plan });
        } catch (error) {
          SecureLogger.error('Error updating user plan', error);
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
