"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Partner, partnersApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/components/PartnerEdit.module.css";

const PartnerEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { getCurrentUser } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    company_name: "",
    city: "",
    description: "",
    contact_person: "",
    isPremium: false,
  });

  const fetchPartnerDetails = useCallback(async () => {
    setLoading(true);
    try {
      const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
      const partnerId = parseInt(idParam || "0");
      if (isNaN(partnerId)) {
        setError("ID đối tác không hợp lệ");
        setLoading(false);
        return;
      }

      // Check if user is admin or this partner
      const user = getCurrentUser();
      if (!user || (user.role !== "Admin" && user.id !== partnerId)) {
        setError("Bạn không có quyền chỉnh sửa thông tin đối tác này");
        setLoading(false);
        return;
      }

      // Fetch partner details
      const partnerData = await partnersApi.getById(partnerId);
      setPartner(partnerData);
      setFormData({
        company_name: partnerData.company_name || "",
        city: partnerData.city || "",
        description: partnerData.description || "",
        contact_person: partnerData.contact_person || "",
        isPremium: partnerData.isPremium || false,
      });

      if (partnerData.avatar) {
        setAvatarPreview(partnerData.avatar);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching partner details:", err);
      setError("Không thể tải thông tin đối tác. Vui lòng thử lại sau.");
      setLoading(false);
    }
  }, [params.id, getCurrentUser]);

  useEffect(() => {
    fetchPartnerDetails();
  }, [fetchPartnerDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
      const partnerId = parseInt(idParam || "0");
      if (partnerId === 0) {
        setError("ID partner không hợp lệ");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập");
        return;
      }

      // First update partner info  
      await partnersApi.updateProfile(token, {
        company_name: formData.company_name,
        description: formData.description,
        city: formData.city,
        contact_person: formData.contact_person,
      });

      // Avatar upload functionality can be added later
      // if (avatarFile) {
      //   const avatarFormData = new FormData();
      //   avatarFormData.append("avatar", avatarFile);
      //   await partnersApi.updateAvatar(token, avatarFormData);
      // }

      setSuccessMessage("Cập nhật thông tin thành công!");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/doi-tac/${partnerId}`);
      }, 2000);
    } catch (err) {
      console.error("Error updating partner:", err);
      setError("Không thể cập nhật thông tin đối tác. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error && !partner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h2>
        <p className="text-gray-700">{error}</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-secondary to-primary p-6">
            <h1 className="text-2xl font-bold text-white">
              Chỉnh sửa thông tin đối tác
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
                {successMessage}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Ảnh đại diện</label>
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={avatarPreview || "/images/default-partner.png"}
                    alt="Partner avatar"
                    fill
                    style={{ objectFit: "cover" }}
                    className="bg-white"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className={styles.fileInput}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                    Tên doanh nghiệp
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
            </div>

            <div className={styles.formGroup}>
                                <label htmlFor="location" className={styles.label}>
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
            </div>

            {/* Only admin can change premium status */}
            {getCurrentUser()?.role === "Admin" && (
              <div className={styles.formGroup}>
                <label htmlFor="isPremium" className={styles.label}>
                  <input
                    type="checkbox"
                    id="isPremium"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Đối tác cao cấp
                </label>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
                disabled={submitting}
              >
                {submitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerEditPage;
