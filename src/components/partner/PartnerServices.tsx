"use client";

import React, { useState, useEffect, useCallback } from "react";
import { servicesApi, Service, Partner } from "@/lib/api";

interface PartnerServicesProps {
  partner: Partner;
  token: string;
}

interface ServiceFormData {
  service_name: string;
  description: string;
  price: string;
  duration_minutes: string;
  service_type: string;
  location: string;
  mainImage: string;
  images: string[];
}

const PartnerServices: React.FC<PartnerServicesProps> = ({
  partner,
  token,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    service_name: "",
    description: "",
    price: "",
    duration_minutes: "",
    service_type: "",
    location: "",
    mainImage: "",
    images: [""],
  });
  const [submitting, setSubmitting] = useState(false);

  const maxImages = partner.isPremium ? 10 : 5;

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const servicesData = await servicesApi.getPartnerServices(token);
      setServices(servicesData);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageAdd = () => {
    if (formData.images.length < maxImages) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ""],
      }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const serviceData = {
        service_name: formData.service_name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
        service_type: formData.service_type,
      };

      await servicesApi.create(token, serviceData);

      // Reset form
      setFormData({
        service_name: "",
        description: "",
        price: "",
        duration_minutes: "",
        service_type: "",
        location: "",
        mainImage: "",
        images: [],
      });
      setShowAddForm(false);

      // Refresh services list
      await fetchServices();

      alert("Thêm dịch vụ thành công!");
    } catch (error) {
      console.error("Failed to create service:", error);
      alert("Có lỗi xảy ra khi thêm dịch vụ!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        await servicesApi.delete(token, serviceId);
        await fetchServices();
        alert("Xóa dịch vụ thành công!");
      } catch (error) {
        console.error("Failed to delete service:", error);
        alert("Có lỗi xảy ra khi xóa dịch vụ!");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Quản lý dịch vụ</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
        >
          {showAddForm ? "Hủy" : "Thêm dịch vụ"}
        </button>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            Thêm dịch vụ mới
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tiền (VNĐ) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa điểm *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian (phút) *
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại dịch vụ *
                </label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Chọn loại dịch vụ</option>
                  <option value="Massage">Massage</option>
                  <option value="Spa">Spa</option>
                  <option value="Beauty">Làm đẹp</option>
                  <option value="Wellness">Chăm sóc sức khỏe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh chính *
              </label>
              <input
                type="url"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Danh sách ảnh (Tối đa {maxImages} ảnh)
                </label>
                <button
                  type="button"
                  onClick={handleImageAdd}
                  disabled={formData.images.length >= maxImages}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm ảnh
                </button>
              </div>

              {!partner.isPremium && (
                <p className="text-xs text-gray-500 mb-2">
                  Nâng cấp Premium để tải lên tối đa 10 ảnh thay vì 5 ảnh
                </p>
              )}

              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`URL ảnh ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Đang thêm..." : "Thêm dịch vụ"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có dịch vụ nào. Hãy thêm dịch vụ đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                {service.mainImage && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.mainImage}
                      alt={service.service_name}
                      className="w-full h-48 object-cover"
                    />
                  </>
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {service.service_name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {service.description}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    📍 {service.location}
                  </p>
                  <p className="text-pink-600 font-bold text-lg mb-3">
                    {service.price.toLocaleString("vi-VN")} VNĐ
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerServices;
