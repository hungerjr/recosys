'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";

type User = {
  id: string;
  name: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/");
  }, [router]);

  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await API.get(base_url + "/User/me");
          setUser(response.data);
        } catch (error) {
          console.error("Session verification failed:", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    verifyUserSession();
  }, [logout]);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
    router.push('/dashboard');
  }, [router]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}