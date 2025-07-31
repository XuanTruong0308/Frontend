"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { partnerApi, Partner, servicesApi, Service } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ServiceCard from "@/components/ServiceCard";

const PartnerDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { getCurrentUser } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("services");
  const [canEdit, setCanEdit] = useState(false);

  // Helper function to check if current user can edit this partner
  const checkEditPermission = useCallback(
    (partnerId: number): boolean => {
      const currentUser = getCurrentUser();
      // Allow if user is admin or this is their partner profile
      return !!(
        currentUser &&
        (currentUser.role === "Admin" || currentUser.id === partnerId)
      );
    },
    [getCurrentUser],
  );

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      setLoading(true);
      try {
        const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
        const partnerId = parseInt(idParam || "0");
        if (isNaN(partnerId)) {
          setError("ID đối tác không hợp lệ");
          setLoading(false);
          return;
        }

        // Fetch partner details
        const partnerData = await partnerApi.getById(partnerId);
        setPartner(partnerData);

        // Check edit permissions
        setCanEdit(checkEditPermission(partnerId));

        // Fetch partner services
        const servicesData = await servicesApi.getByPartner(partnerId);
        setServices(servicesData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching partner details:", err);
        setError("Không thể tải thông tin đối tác. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchPartnerDetails();
  }, [params.id, checkEditPermission]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h2>
        <p className="text-gray-700">
          {error || "Không tìm thấy thông tin đối tác"}
        </p>
        <button
          className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
          onClick={() => router.back()}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-secondary to-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            className="flex items-center text-white mb-6"
            onClick={() => router.back()}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh sách đối tác
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg"
            >
              <Image
                src={partner.avatar || "/images/default-partner.png"}
                alt={partner.company_name || "Partner"}
                fill
                style={{ objectFit: "cover" }}
                className="bg-white"
              />
              {partner.isPremium && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-xs text-white px-2 py-1 rounded-bl-lg">
                  Premium
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-between">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {partner.name}
                </h1>

                {canEdit && (
                  <button
                    onClick={() => router.push(`/doi-tac/${params.id}/edit`)}
                    className="ml-4 px-4 py-1 bg-white text-primary border border-white rounded-full hover:bg-opacity-90 transition-all flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <div className="flex items-center mt-2 justify-center md:justify-start">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(partner.avg_rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2">{(partner.avg_rating || 0).toFixed(1)}</span>
                <span className="text-gray-200 mx-2">•</span>
                <span>{partner.totalBookings || 0} lượt đặt lịch</span>
              </div>

              <div className="mt-4 flex items-center justify-center md:justify-start">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{partner.city}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <button className="bg-white text-primary font-medium px-6 py-2 rounded-full hover:bg-opacity-90 transition-all flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Đặt lịch ngay
                </button>
                <button className="bg-transparent border-2 border-white text-white font-medium px-6 py-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-all flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Liên hệ
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === "services" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("services")}
            >
              Dịch vụ
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === "about" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("about")}
            >
              Giới thiệu
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === "reviews" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Services Tab */}
        {activeTab === "services" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">
              Dịch vụ ({services.length})
            </h2>

            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có dịch vụ nào được thêm.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6">Giới thiệu</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-700 mb-6">
                {partner.description || "Chưa có thông tin giới thiệu."}
              </p>

              <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-gray-600">{partner.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <PhoneIcon className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Số điện thoại</p>
                    <p className="text-gray-600">
                      {partner.phone || "Chưa cung cấp"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserIcon className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Thời gian hoạt động</p>
                    <p className="text-gray-600">
                      {partner.workingHours ||
                        "08:00 - 20:00 (Thứ 2 - Chủ Nhật)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Đánh giá</h2>
              <div className="flex items-center bg-primary bg-opacity-10 px-4 py-2 rounded-full">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(partner.avg_rating || 0) ? "text-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {(partner.avg_rating || 0).toFixed(1)}/5
                </span>
              </div>
            </div>

            {/* Reviews will be fetched from API and displayed here */}
            <div className="space-y-4">
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có đánh giá nào.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PartnerDetailPage;
