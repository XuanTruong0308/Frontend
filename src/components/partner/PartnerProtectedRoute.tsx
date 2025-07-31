"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

interface PartnerProtectedRouteProps {
  children: React.ReactNode;
}

const PartnerProtectedRoute: React.FC<PartnerProtectedRouteProps> = ({
  children,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Vui lòng đăng nhập
        </h1>
        <p className="text-gray-600">
          Bạn cần đăng nhập để truy cập trang này.
        </p>
      </div>
    );
  }

  if (user?.role !== "Partner") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Không có quyền truy cập
        </h1>
        <p className="text-gray-600">
          Bạn không có quyền truy cập vào khu vực đối tác.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PartnerProtectedRoute;
