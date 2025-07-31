"use client";

import React, { useState } from "react";
import { partnersApi, Partner } from "@/lib/api";

interface PartnerProfileProps {
  partner: Partner;
  setPartner: (partner: Partner) => void;
  token: string;
}

const PartnerProfile: React.FC<PartnerProfileProps> = ({
  partner,
  setPartner,
  token,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: partner.company_name || "",
    description: partner.description || "",
    location: partner.city || "",
    avatar: partner.avatar || "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedPartner = await partnersApi.updateProfile(token, formData);
      setPartner(updatedPartner);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: partner.company_name || "",
      description: partner.description || "",
      location: partner.city || "",
      avatar: partner.avatar || "",
    });
    setIsEditing(false);
  };

  const handleUpgradePremium = async () => {
    try {
      await partnersApi.upgradeToPremium(token, 1); // 1 month
      alert("Nâng cấp Premium thành công!");
      // Refresh partner data
      const updatedPartner = await partnersApi.getProfile(token);
      setPartner(updatedPartner);
    } catch (error) {
      console.error("Failed to upgrade premium:", error);
      alert("Có lỗi xảy ra khi nâng cấp Premium!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Status */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Trạng thái Premium</h3>
        <p className="text-2xl font-bold">
          {partner.isPremium ? "Đã kích hoạt" : "Chưa kích hoạt"}
        </p>
        {partner.isPremium && partner.premiumExpiresAt && (
          <p className="text-sm mt-2">
            Hết hạn:{" "}
            {new Date(partner.premiumExpiresAt).toLocaleDateString("vi-VN")}
          </p>
        )}
        {!partner.isPremium && (
          <button
            onClick={handleUpgradePremium}
            className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Nâng cấp Premium
          </button>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Thông tin cá nhân
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đối tác
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Avatar
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Tên đối tác
              </label>
              <p className="text-gray-800">{partner.name || "Chưa cập nhật"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Mô tả
              </label>
              <p className="text-gray-800">
                {partner.description || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Địa chỉ
              </label>
              <p className="text-gray-800">
                {partner.location || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Avatar
              </label>
              {partner.avatar ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </>
              ) : (
                <p className="text-gray-800">Chưa cập nhật</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Đánh giá</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-yellow-600">
              {partner.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-600 ml-2">
              ({partner.totalRatings} lượt đánh giá)
            </span>
          </div>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Tổng đặt lịch
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {partner.totalBookings || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
