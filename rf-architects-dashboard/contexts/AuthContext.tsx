"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/services/api/client";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "superadmin" | "editor" | "viewer";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = getApiBaseUrl();

const normalizeUser = (payload: unknown): User | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const user = payload as Record<string, unknown>;
  const userId = typeof user._id === "string" ? user._id : typeof user.id === "string" ? user.id : null;
  const name = typeof user.name === "string" ? user.name : "Admin User";
  const email = typeof user.email === "string" ? user.email : "";
  const role = typeof user.role === "string" ? user.role : "viewer";

  if (!userId || !email) {
    return null;
  }

  return {
    _id: userId,
    name,
    email,
    role: role === "superadmin" || role === "editor" || role === "viewer" ? role : "viewer",
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const payload = await res.json();
      const nextUser = normalizeUser(payload?.data ?? payload);
      setUser(nextUser);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    if (user && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isLoading, pathname, router, user]);

  const login = (userData: User) => {
    setUser(userData);
    router.replace("/dashboard");
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      checkAuth,
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
