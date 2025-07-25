
"use client";

import type { ReactNode } from "react";
import { createContext, useState, useMemo, useEffect } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, deleteUser, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  className: string | null;
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        let displayName = firebaseUser.displayName || "User";
        let className = "N/A";
        
        // Check if displayName contains the separator and parse it
        if (displayName && displayName.includes("__CLASS__")) {
          const parts = displayName.split("__CLASS__");
          displayName = parts[0];
          className = parts[1];
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: displayName,
          className: className,
          emailVerified: firebaseUser.emailVerified,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/login');
  };
  
  const deleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteUser(currentUser);
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
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

    