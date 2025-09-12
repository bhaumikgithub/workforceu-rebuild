"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  email: string;
  name?: string;
  subdomain_id?: number;
  // add other properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user/token from localStorage
  useEffect(() => {
    try {
      const sUser = localStorage.getItem("user");
      const sToken = localStorage.getItem("token");

      if (sUser && sToken) {
        setUser(JSON.parse(sUser));
        setToken(sToken);

        // Optional: check token expiration if JWT contains exp
        const payload = JSON.parse(atob(sToken.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          // token expired
          logout();
        }
      }
    } catch (e) {
      console.error("Auth hydrate failed", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user") setUser(e.newValue ? JSON.parse(e.newValue) : null);
      if (e.key === "token") setToken(e.newValue);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
