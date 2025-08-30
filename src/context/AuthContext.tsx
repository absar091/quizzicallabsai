
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
    const processAuth = async () => {
        try {
            // Check for redirect result from Google
            await getRedirectResult(auth);
        } catch (error) {
            console.error("Error processing redirect result:", error);
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
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

                const appUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: displayName,
                    className: className,
                    age: age,
                    emailVerified: firebaseUser.emailVerified,
                };
                
                setUser(appUser);
                
                // --- Centralized Redirect Logic ---
                // If user is logged in, redirect them from public pages to the dashboard.
                const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname === '/';
                if (isAuthPage) {
                    router.replace('/dashboard');
                }

            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    };

    processAuth();
  }, [pathname, router]);

  const logout = async () => {
    const userId = user?.uid;
    await firebaseSignOut(auth);
    setUser(null);
    if (userId) {
      // Clear any session-specific data if needed
    }
    router.push('/login');
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
      // The redirect will be handled by the useEffect hook on page load.
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
