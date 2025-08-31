
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
    getRedirectResult,
    updateProfile
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { clearUserData } from "@/lib/indexed-db";
import { ref, get, set } from "firebase/database";

export type UserPlan = "Free" | "Pro";

interface User {
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

  const handleUserUpdate = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser && firebaseUser.emailVerified) {
        let displayName = firebaseUser.displayName || "User";
        let className = "N/A";
        let age = null;
        
        if (displayName && displayName.includes("__CLASS__")) {
            const parts = displayName.split("__CLASS__");
            displayName = parts[0];
            const rest = parts[1];
            if (rest.includes("__AGE__")) {
                const ageParts = rest.split("__AGE__");
                className = ageParts[0];
                age = parseInt(ageParts[1], 10) || null;
            } else {
                className = rest;
            }
        }
        
        // Fetch user plan from Realtime Database
        const planRef = ref(db, `users/${firebaseUser.uid}/plan`);
        const snapshot = await get(planRef);
        const plan: UserPlan = snapshot.val() || 'Free';

        const appUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: displayName,
            className: className,
            age: age,
            emailVerified: firebaseUser.emailVerified,
            plan: plan,
        };
        
        setUser(appUser);
        
        const isAuthPage = ['/', '/login', '/signup', '/forgot-password', '/pricing'].includes(pathname);
        if (isAuthPage) {
            router.replace('/dashboard');
        }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [router, pathname]);
  
  useEffect(() => {
    setLoading(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User has just signed in via redirect.
          // onAuthStateChanged will handle the user object creation.
          // We can set their initial plan here if it's a new user.
          const userRef = ref(db, `users/${result.user.uid}/plan`);
          get(userRef).then(snapshot => {
            if (!snapshot.exists()) {
                set(userRef, 'Free');
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error processing Google redirect result:", error);
      })
      .finally(() => {
        const unsubscribe = onAuthStateChanged(auth, handleUserUpdate);
        return () => unsubscribe();
      });
  }, [handleUserUpdate]);


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
