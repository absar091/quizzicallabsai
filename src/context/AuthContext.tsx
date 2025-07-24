"use client";

import type { ReactNode } from "react";
import { createContext, useState, useMemo, useEffect } from "react";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  className: string;
  fatherName: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock persistence check
    const storedUser = localStorage.getItem("quiz-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    const mockUser: User = {
      uid: "12345-mock",
      email,
      displayName: "Test User",
      className: "12th Grade",
      fatherName: "John Doe Sr.",
      isVerified: true,
    };
    setUser(mockUser);
    localStorage.setItem("quiz-user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quiz-user");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
