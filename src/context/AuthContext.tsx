
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

  const handleRedirect = useCallback(() => {
    getRedirectResult(auth).catch((error) => {
        console.error("Error processing Google redirect result:", error);
    });
  }, []);
  
  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            let displayName = firebaseUser.displayName || "User";
            let className = "N/A";
            let age = null;

            if (displayName.includes("__CLASS__")) {
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

            const planRef = ref(db, `users/${firebaseUser.uid}/plan`);
            const snapshot = await get(planRef);
            let plan: UserPlan = snapshot.val() || 'Free';
            
            if (!snapshot.exists()) {
                await set(planRef, 'Free');
                plan = 'Free';
            }

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
            
            const isAuthPage = ['/', '/login', '/signup', '/forgot-password'].includes(pathname);
            if (isAuthPage) {
                router.replace('/dashboard');
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });

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
