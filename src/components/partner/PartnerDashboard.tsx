"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { partnersApi, servicesApi, Partner, Service } from "@/lib/api";
import styles from "@/styles/components/PartnerDashboard.module.css";

type TabType = "profile" | "services" | "chat";

interface ServiceFormData {
  name: string;
  category: string;
  price: number;
  location: string;
  description: string;
}

const PartnerDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    name: "",
    category: "photo",
    price: 0,
    location: "",
    description: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const serviceCategories = [
    { value: "photo", label: "Chụp ảnh" },
    { value: "makeup", label: "Trang điểm" },
    { value: "rental", label: "Cho thuê" },
    { value: "hair", label: "Làm tóc" },
    { value: "nail", label: "Làm nail" },
    { value: "spa", label: "Spa" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user) return;

      try {
        const [partnerData, servicesData] = await Promise.all([
          partnersApi.getProfile(token),
          servicesApi.getPartnerServices(token),
        ]);
        setPartner(partnerData);
        setServices(servicesData);
      } catch (error: unknown) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleProfileUpdate = async (updatedProfile: Partial<Partner>) => {
    if (!token) return;

    try {
      const updated = await partnersApi.updateProfile(token, updatedProfile);
      setPartner(updated);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      setMessage({
        type: "error",
        text: "Có lỗi xảy ra khi cập nhật thông tin",
      });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingService) {
        const updated = await servicesApi.update(token, editingService.id, {
          service_name: serviceForm.name,
          description: serviceForm.description,
          price: serviceForm.price,
          duration_minutes: 60, // default duration
          service_type: serviceForm.category,
        });
        setServices(
          services.map((s) => (s.id === editingService.id ? updated : s)),
        );
        setMessage({ type: "success", text: "Cập nhật dịch vụ thành công!" });
      } else {
        const newService = await servicesApi.create(token, {
          service_name: serviceForm.name,
          description: serviceForm.description,
          price: serviceForm.price,
          duration_minutes: 60, // default duration
          service_type: serviceForm.category,
        });
        setServices([...services, newService]);
        setMessage({ type: "success", text: "Thêm dịch vụ thành công!" });
      }

      resetServiceForm();
    } catch (error: unknown) {
      console.error("Service operation error:", error);
      setMessage({ type: "error", text: "Có lỗi xảy ra khi lưu dịch vụ" });
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      category: "photo",
      price: 0,
      location: "",
      description: "",
    });
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleEditService = (service: Service) => {
    setServiceForm({
      name: service.service_name,
      category: service.service_type,
      price: service.price,
      location: service.location || "",
      description: service.description,
    });
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!token || !confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;

    try {
      await servicesApi.delete(token, serviceId);
      setServices(services.filter((s) => s.id !== serviceId));
      setMessage({ type: "success", text: "Xóa dịch vụ thành công!" });
    } catch (error: unknown) {
      console.error("Delete service error:", error);
      setMessage({ type: "error", text: "Có lỗi xảy ra khi xóa dịch vụ" });
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h1>Hồ sơ đối tác không tồn tại</h1>
          <p>Vui lòng liên hệ admin để được hỗ trợ.</p>
        </div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className={styles.profileSection}>
      <div className={styles.profileImage}>
        <Image
          src={partner.avatar || "/images/default-avatar.png"}
          alt={partner.name || "Partner Avatar"}
          width={150}
          height={150}
          className={styles.avatar}
        />
        <button className={styles.uploadButton}>Thay đổi ảnh</button>
      </div>

      <form
        className={styles.profileForm}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleProfileUpdate({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            location: formData.get("location") as string,
            description: formData.get("description") as string,
          });
        }}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>Tên đối tác</label>
          <input
            type="text"
            name="name"
            defaultValue={partner.name}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            defaultValue={partner.email}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            defaultValue={partner.phone}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Địa chỉ</label>
          <input
            type="text"
            name="location"
            defaultValue={partner.location || ""}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mô tả</label>
          <textarea
            name="description"
            defaultValue={partner.description}
            className={styles.textarea}
            rows={4}
          />
        </div>

        <button type="submit" className={styles.saveButton}>
          Cập nhật thông tin
        </button>
      </form>
    </div>
  );

  const renderServicesTab = () => (
    <div className={styles.servicesSection}>
      <div className={styles.servicesHeader}>
        <h2 className={styles.sectionTitle}>Quản lý dịch vụ</h2>
        <button
          className={styles.addServiceButton}
          onClick={() => setShowServiceForm(true)}
        >
          + Thêm dịch vụ mới
        </button>
      </div>

      {showServiceForm && (
        <form className={styles.serviceForm} onSubmit={handleServiceSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tên dịch vụ</label>
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Danh mục</label>
              <select
                value={serviceForm.category}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, category: e.target.value })
                }
                className={styles.select}
                required
              >
                {serviceCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Giá (VNĐ)</label>
              <input
                type="number"
                value={serviceForm.price}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    price: Number(e.target.value),
                  })
                }
                className={styles.input}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Địa điểm</label>
              <input
                type="text"
                value={serviceForm.location}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, location: e.target.value })
                }
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả dịch vụ</label>
            <textarea
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, description: e.target.value })
              }
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={resetServiceForm}
              className={styles.cancelButton}
            >
              Hủy
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingService ? "Cập nhật" : "Thêm dịch vụ"}
            </button>
          </div>
        </form>
      )}

      <div className={styles.servicesList}>
        {services.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3>Chưa có dịch vụ nào</h3>
            <p>Thêm dịch vụ đầu tiên để bắt đầu nhận khách hàng</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              {service.mainImage && (
                <Image
                  src={service.mainImage}
                  alt={service.service_name}
                  width={300}
                  height={150}
                  className={styles.serviceImage}
                />
              )}
              <h3 className={styles.serviceName}>{service.service_name}</h3>
              <span className={styles.serviceCategory}>
                {
                  serviceCategories.find(
                    (cat) => cat.value === service.service_type,
                  )?.label
                }
              </span>
              <div className={styles.servicePrice}>
                {service.price.toLocaleString("vi-VN")} VNĐ
              </div>
              <div className={styles.serviceLocation}>
                📍 {service.location}
              </div>

              <div className={styles.serviceActions}>
                <button
                  onClick={() => handleEditService(service)}
                  className={styles.editButton}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className={styles.deleteButton}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className={styles.chatSection}>
      <div className={styles.chatHeader}>
        <h3>Tin nhắn khách hàng</h3>
      </div>

      <div className={styles.chatMessages}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💬</div>
          <h3>Chưa có tin nhắn</h3>
          <p>Tin nhắn từ khách hàng sẽ hiển thị ở đây</p>
        </div>
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className={styles.messageInput}
        />
        <button className={styles.sendButton}>Gửi</button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.dashboardWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard Đối Tác</h1>
          <p className={styles.subtitle}>
            Quản lý thông tin và dịch vụ của bạn
          </p>
        </div>

        {message && (
          <div
            className={
              message.type === "success"
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            {message.text}
          </div>
        )}

        <div className={styles.tabNavigation}>
          <button
            onClick={() => setActiveTab("profile")}
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.active : ""}`}
          >
            👤 Hồ sơ
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`${styles.tabButton} ${activeTab === "services" ? styles.active : ""}`}
          >
            ⚙️ Dịch vụ
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`${styles.tabButton} ${activeTab === "chat" ? styles.active : ""}`}
          >
            💬 Chat
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "services" && renderServicesTab()}
          {activeTab === "chat" && renderChatTab()}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
