
"use client";

import type { ReactNode } from "react";
import { createContext, useState, useMemo, useEffect, useCallback } from "react";
import { 
    onAuthStateChanged, 
    signOut as firebaseSignOut, 
    deleteUser, 
    type User as FirebaseUser,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleAuth = async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            const userRef = ref(db, `users/${firebaseUser.uid}`);
            const snapshot = await get(userRef);

            let appUser: User;

            if (snapshot.exists()) {
                // User exists in DB, use that data
                const dbUser = snapshot.val();
                appUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                    className: dbUser.className || 'N/A',
                    age: dbUser.age || null,
                    plan: dbUser.plan || 'Free',
                };
            } else {
                // New user (e.g., from Google Sign-In), create DB entry
                const newUserInfo = {
                    fullName: firebaseUser.displayName || 'Google User',
                    email: firebaseUser.email,
                    className: 'Not set',
                    age: null,
                    plan: 'Free',
                };
                await set(userRef, newUserInfo);
                
                appUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                    className: newUserInfo.className,
                    age: newUserInfo.age,
                    plan: newUserInfo.plan,
                };
            }
            
            setUser(appUser);
            
            const isAuthPage = ['/', '/login', '/signup', '/forgot-password'].includes(pathname);
            if (isAuthPage) {
                router.replace('/dashboard');
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    // First, process any pending redirect from Google Sign-In
    getRedirectResult(auth)
      .then((result) => {
        // This will trigger onAuthStateChanged if the user is new or signs in
        if (result) {
            // User just signed in. The listener below will handle the update.
        } else {
            // No redirect result, just set up the regular listener
            const unsubscribe = onAuthStateChanged(auth, handleAuth);
            return unsubscribe;
        }
      })
      .catch((error) => {
        console.error("Error processing Google redirect result:", error);
        setLoading(false);
      });
      
    // Set up the primary listener for auth state changes
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
      await deleteUser(currentUser);
      await clearUserData(userId);
      const userDbRef = ref(db, `users/${userId}`);
      await set(userDbRef, null);
      setUser(null);
    } else {
        throw new Error("No user is currently signed in.");
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Google Sign-In error", error);
      setLoading(false);
      throw error;
    }
  };

  const updateUserPlan = async (plan: UserPlan) => {
    if (user) {
        const userRef = ref(db, `users/${user.uid}/plan`);
        await set(userRef, plan);
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
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
