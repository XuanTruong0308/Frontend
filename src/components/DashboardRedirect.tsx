"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }

    if (user) {
      switch (user.role) {
        case "Admin":
          router.push("/admin");
          break;
        case "Partner":
          router.push("/partner/dashboard");
          break;
        case "User":
        default:
          router.push("/");
          break;
      }
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
