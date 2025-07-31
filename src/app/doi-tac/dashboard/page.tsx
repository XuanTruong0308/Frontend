import { Metadata } from "next";
import PartnerDashboard from "@/components/partner/PartnerDashboard";
import PartnerProtectedRoute from "@/components/partner/PartnerProtectedRoute";

export const metadata: Metadata = {
  title: "Dashboard Đối tác | Beauty Studio",
  description: "Quản lý dịch vụ và khách hàng của bạn",
};

export default function PartnerDashboardPage() {
  return (
    <PartnerProtectedRoute>
      <PartnerDashboard />
    </PartnerProtectedRoute>
  );
}
