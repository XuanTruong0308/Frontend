// ============================================
// HOOK AUTH CHO HỆ THỐNG MỚI
// ============================================

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Link from "next/link";
import { authApi, User } from "@/lib/api";

// ============================================
// TYPES
// ============================================

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  getCurrentUser: () => User | null;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  isPartner: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
}

// ============================================
// CONTEXT CREATION
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// AUTH PROVIDER
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // INITIALIZATION
  // ============================================

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ============================================
  // AUTH FUNCTIONS
  // ============================================

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });

      setToken(response.access_token);
      setUser(response.user);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);

      setToken(response.access_token);
      setUser(response.user);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const getCurrentUser = () => {
    return user;
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const isLoggedIn = !!user && !!token;
  const isPartner = user?.role === "Partner";
  const isAdmin = user?.role === "Admin";
  const isUser = user?.role === "User";

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    user,
    token,
    loading,
    isLoading: loading,
    login,
    register,
    logout,
    updateUser,
    getCurrentUser,
    isLoggedIn,
    isAuthenticated: isLoggedIn,
    isPartner,
    isAdmin,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// USE AUTH HOOK
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================
// AUTH GUARDS
// ============================================

export function withAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
) {
  return function AuthenticatedComponent(props: T) {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isLoggedIn) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
            <p className="mb-4">You need to login to access this page.</p>
            <Link
              href="/dang-nhap"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go to Login
            </Link>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export function withPartnerAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
) {
  return function PartnerAuthenticatedComponent(props: T) {
    const { isPartner, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isPartner) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
            <p className="mb-4">You need to login to access this page.</p>
            <Link
              href="/dang-nhap"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go to Login
            </Link>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export function withAdminAuth<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
) {
  return function AdminAuthenticatedComponent(props: T) {
    const { isAdmin, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="mb-4">
              You don&apos;t have permission to access this page.
            </p>
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded">
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
