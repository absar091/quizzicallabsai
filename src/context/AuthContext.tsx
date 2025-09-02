
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleAuth = async (firebaseUser: FirebaseUser | null) => {
        try {
            if (firebaseUser) {
                // Create default user first to prevent loading state
                const defaultUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                    className: 'Not set',
                    age: null,
                    fatherName: 'N/A',
                    plan: 'Free',
                };

                setUser(defaultUser);
                setLoading(false);

                // Try to get additional user data with timeout
                try {
                    const userRef = ref(db, `users/${firebaseUser.uid}`);
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Database timeout')), 5000)
                    );
                    
                    const snapshot = await Promise.race([
                        get(userRef),
                        timeoutPromise
                    ]) as any;

                    if (snapshot && snapshot.exists()) {
                        const dbUser = snapshot.val();
                        const updatedUser: User = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            emailVerified: firebaseUser.emailVerified,
                            className: dbUser.className || 'Not set',
                            age: dbUser.age || null,
                            fatherName: dbUser.fatherName || 'N/A',
                            plan: dbUser.plan || 'Free',
                        };
                        setUser(updatedUser);
                    } else if (snapshot) {
                        // Create new user record
                        const newUserInfo = {
                            uid: firebaseUser.uid,
                            fullName: firebaseUser.displayName || 'User',
                            fatherName: 'N/A',
                            email: firebaseUser.email,
                            className: 'Not set',
                            age: null,
                            plan: 'Free',
                        };
                        await set(userRef, newUserInfo);
                    }
                } catch (dbError) {
                    console.warn('Database error, using default user data:', dbError);
                    // User is already set with default data, continue
                }
                
                const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);
                if (isAuthPage) {
                    router.replace('/');
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        } catch (error) {
            console.error('Auth error:', error);
            setUser(null);
            setLoading(false);
        }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuth);
    return () => unsubscribe();
  }, [router, pathname]);


  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
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
      const result = await signInWithPopup(auth, provider);
      // User will be handled by onAuthStateChanged
      return result;
    } catch (error: any) {
      console.error("Google Sign-In error", error);
      throw error;
    }
  };

  const updateUserPlan = async (plan: UserPlan) => {
    if (user) {
        const userRef = ref(db, `users/${user.uid}/plan`);
        await set(userRef, plan);
        // Update local state immediately for instant UI feedback
        setUser(prevUser => prevUser ? { ...prevUser, plan } : null);
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
