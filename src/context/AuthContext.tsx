
"use client";

import type { ReactNode } from "react";
import { createContext, useState, useMemo, useEffect } from "react";
import { 
    onAuthStateChanged, 
    signOut as firebaseSignOut, 
    deleteUser, 
    type User as FirebaseUser,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
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
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const provider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
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

        // This is a sign-in or a page refresh with an active session.
        // Redirect to dashboard if they are on an auth page.
        if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
            router.replace('/dashboard');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Handle the redirect result from Google Sign-In
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This will trigger the onAuthStateChanged listener above,
          // which will then handle the redirect to the dashboard.
          console.log("Google Sign-In successful.");
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      }).finally(() => {
          // In case onAuthStateChanged hasn't finished, we ensure loading is false.
          setLoading(false);
      });

    return () => unsubscribe();
  }, [pathname, router]);

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
  
  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      deleteAccount,
      signInWithGoogle,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
