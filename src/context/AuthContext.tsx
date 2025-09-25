
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const provider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSentLoginNotification, setHasSentLoginNotification] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('🔥 AUTH CONTEXT EFFECT RUNNING');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 AUTH STATE CHANGED - firebaseUser:', !!firebaseUser);
      console.log('- email:', firebaseUser?.email);
      
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

          console.log('✅ SETTING USER WITH PLAN:', appUser.email, 'Plan:', appUser.plan);

          // Send login notification email for security - ONLY ONCE PER SESSION
          if (firebaseUser.email && firebaseUser.emailVerified && !hasSentLoginNotification) {
            console.log('🔐 SENDING LOGIN NOTIFICATION FOR SECURITY (FIRST TIME)');

            try {
              const idToken = await firebaseUser.getIdToken();
              const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side Request';

              const response = await fetch('/api/notifications/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  idToken,
                  userEmail: firebaseUser.email,
                  userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
                  userAgent,
                  // Note: IP address will be captured server-side
                })
              });

              const notificationResult = await response.json();
              console.log('🔐 Login notification result:', notificationResult);

              if (response.ok && notificationResult.success) {
                console.log('✅ Login notification sent successfully');
                setHasSentLoginNotification(true); // Mark as sent for this session
              } else {
                console.warn('⚠️ Login notification failed:', notificationResult);
              }
            } catch (error: any) {
              console.warn('⚠️ Login notification error (non-critical):', error.message);
              // Don't fail the login if notification fails
            }
          }

          setUser(appUser);

          // Trigger welcome notifications for new users (only if email is verified)
          if (isNewUser && firebaseUser.emailVerified) {
            console.log('🎉 NEW VERIFIED USER DETECTED - TRIGGERING WELCOME NOTIFICATIONS');
            console.log('🎉 User details:', {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              uid: firebaseUser.uid,
              emailVerified: firebaseUser.emailVerified
            });
            
            try {
              const idToken = await firebaseUser.getIdToken();
              console.log('🎉 Got ID token, sending welcome email...');
              
              const response = await fetch('/api/notifications/welcome', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  idToken,
                  userEmail: firebaseUser.email,
                  userName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student'
                })
              });

              console.log('🎉 Welcome email response status:', response.status);
              const responseData = await response.json();
              console.log('🎉 Welcome email response data:', responseData);

              if (response.ok && responseData.success) {
                console.log('✅ Welcome email sent successfully to new verified user');
              } else {
                console.error('❌ Failed to send welcome email:', {
                  status: response.status,
                  error: responseData.error,
                  details: responseData
                });
              }
            } catch (error: any) {
              console.error('❌ Welcome email network error:', {
                message: error.message,
                stack: error.stack,
                name: error.name
              });
            }
          } else if (isNewUser && !firebaseUser.emailVerified) {
            console.log('📧 NEW UNVERIFIED USER - Welcome email will be sent after verification');
          }

          // Initialize cloud sync for cross-device data synchronization
          try {
            await syncUserData(firebaseUser.uid);
            console.log('✅ CLOUD SYNC INITIALIZED FOR USER:', firebaseUser.uid);
          } catch (error) {
            console.error('Failed to initialize cloud sync:', error);
          }

          // Redirect from auth pages - check for redirect parameter
          if (['/login', '/signup', '/forgot-password'].includes(pathname)) {
            const currentUrl = new URL(window.location.href);
            const redirect = currentUrl.searchParams.get('redirect');

            if (redirect) {
              console.log('🔄 REDIRECTING FROM AUTH PAGE TO:', redirect);
              setTimeout(() => {
                // Decode and validate redirect URL to prevent open redirect
                let decodedRedirect;
                try {
                  decodedRedirect = decodeURIComponent(redirect);
                  // Only allow redirects within the app domain
                  if (decodedRedirect.startsWith('/') && !decodedRedirect.startsWith('//')) {
                    router.push(decodedRedirect);
                  } else {
                    console.warn('❌ INVALID REDIRECT URL:', redirect);
                    router.push('/dashboard');
                  }
                } catch (error) {
                  console.warn('❌ ERROR DECODING REDIRECT:', error);
                  router.push('/dashboard');
                }
              }, 100);
            } else {
              console.log('🔄 REDIRECTING FROM AUTH PAGE TO DASHBOARD');
              setTimeout(() => {
                router.push('/dashboard');
              }, 100);
            }
          }
        } catch (error) {
          // Sanitize error before logging
          const sanitizedError = error instanceof Error ? 
            error.message.replace(/[\r\n]/g, ' ') : 'Unknown error';
          console.error('Error loading user data from Firebase:', sanitizedError);
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
        console.log('❌ NO FIREBASE USER - SETTING NULL');
        setUser(null);
      }
      
      // CRITICAL: Always set loading to false after auth state is determined
      console.log('✅ SETTING LOADING TO FALSE');
      setLoading(false);
    });

    return unsubscribe;
  }, [router, pathname]);


  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setHasSentLoginNotification(false); // Reset notification flag for next login
    router.push('/login');
  };
  
  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userDbRef = ref(db, `users/${userId}`);
      await set(userDbRef, null);
      await clearUserData(userId);
      await deleteUser(currentUser);
      setUser(null);
    } else {
        throw new Error("No user is currently signed in.");
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
          
          console.log('✅ USER PLAN UPDATED:', plan);
        } catch (error) {
          console.error('Error updating user plan:', error);
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
