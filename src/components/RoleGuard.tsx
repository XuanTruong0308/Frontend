"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  redirectTo?: string;
  fallbackRedirect?: string;
}

export default function RoleGuard({
  allowedRoles,
  children,
  redirectTo = "/dang-nhap",
  fallbackRedirect = "/",
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      router.push(`${redirectTo}?redirect=${window.location.pathname}`);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      // User doesn't have required role
      console.log(
        `Access denied. User role: ${user.role}, Required roles: ${allowedRoles.join(", ")}`,
      );

      // Redirect based on user role
      switch (user.role) {
        case "Admin":
          router.push("/admin");
          break;
        case "Partner":
          router.push("/partner/dashboard");
          break;
        case "User":
        default:
          router.push(fallbackRedirect);
          break;
      }
    }
  }, [
    user,
    isAuthenticated,
    allowedRoles,
    router,
    redirectTo,
    fallbackRedirect,
  ]);

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  // Show access denied if user doesn't have required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Truy cập bị từ chối
          </h1>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập vào trang này.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
