
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
    console.log('🔥 AUTH CONTEXT EFFECT RUNNING');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔥 AUTH STATE CHANGED - firebaseUser:', !!firebaseUser);
      console.log('- email:', firebaseUser?.email);
      
      if (firebaseUser) {
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
        
        console.log('✅ SETTING USER:', appUser.email);
        setUser(appUser);
        
        // Redirect from auth pages
        if (['/login', '/signup', '/forgot-password'].includes(pathname)) {
          console.log('🔄 REDIRECTING FROM AUTH PAGE TO DASHBOARD');
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
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
