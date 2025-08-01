
"use client";

import type { ReactNode } from "react";
import { createContext, useState, useMemo, useEffect } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, deleteUser, type User as FirebaseUser, indexedDBLocalPersistence, setPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { clearUserData } from "@/lib/indexed-db";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  className: string | null;
  age: number | null;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, indexedDBLocalPersistence);
      } catch (error) {
        console.error("Failed to set auth persistence:", error);
      }
      
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser && firebaseUser.emailVerified) {
          let displayName = firebaseUser.displayName || "User";
          let className = "N/A";
          let age = null;
          
          if (displayName && displayName.includes("__CLASS__")) {
            const parts = displayName.split("__CLASS__");
            displayName = parts[0];
            const rest = parts[1];
            if(rest.includes("__AGE__")) {
                const ageParts = rest.split("__AGE__");
                className = ageParts[0];
                age = parseInt(ageParts[1], 10) || null;
            } else {
                className = rest;
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: displayName,
            className: className,
            age: age,
            emailVerified: firebaseUser.emailVerified,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    const userId = user?.uid;
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/login');
    if (userId) {
        // You might want to decide if you clear local data on logout
        // For now, we'll keep it so progress is saved for next login.
    }
  };
  
  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      await deleteUser(currentUser);
      await clearUserData(userId); // Clear all data from IndexedDB
      setUser(null);
    } else {
        throw new Error("No user is currently signed in.");
    }
  }
  
  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      deleteAccount
    }),
    [user, loading, logout, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
