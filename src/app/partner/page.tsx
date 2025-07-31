"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RoleGuard from "../../components/RoleGuard";
import PartnerDashboard from "../../components/partner/PartnerDashboard";

export default function PartnerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/dang-nhap");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["partner"]}>
      <PartnerDashboard />
    </RoleGuard>
  );
}
