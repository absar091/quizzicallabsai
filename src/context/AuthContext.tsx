
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
        if (firebaseUser) {
            const userRef = ref(db, `users/${firebaseUser.uid}`);
            const snapshot = await get(userRef);

            let appUser: User;

            if (snapshot.exists()) {
                const dbUser = snapshot.val();
                appUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    emailVerified: firebaseUser.emailVerified,
                    className: dbUser.className || 'N/A',
                    age: dbUser.age || null,
                    fatherName: dbUser.fatherName || 'N/A',
                    plan: dbUser.plan || 'Free',
                };
            } else {
                const newUserInfo = {
                    uid: firebaseUser.uid,
                    fullName: firebaseUser.displayName || 'Google User',
                    fatherName: 'N/A',
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
                    fatherName: newUserInfo.fatherName,
                    plan: newUserInfo.plan,
                };
            }
            
            setUser(appUser);
            
            const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);
            if (isAuthPage) {
                router.replace('/');
            }
        } else {
            setUser(null);
        }
        setLoading(false);
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
