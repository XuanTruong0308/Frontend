"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { partnersApi, Partner } from "@/lib/api";
import styles from "@/styles/components/AdminPartners.module.css";

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const data = await partnersApi.getAll();
        setPartners(data);
        setFilteredPartners(data);
      } catch (error) {
        console.error("Error fetching partners:", error);
        setError("Không thể tải danh sách đối tác. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    const filtered = partners.filter(
      (partner) =>
        partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.city?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredPartners(filtered);
  }, [searchTerm, partners]);

  const handleDeleteClick = (partner: Partner) => {
    setPartnerToDelete(partner);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partnerToDelete) return;

    try {
      // In a real app, this would call the API
      // await partnersApi.delete(partnerToDelete.id);

      // Update local state
      setPartners(partners.filter((p) => p.id !== partnerToDelete.id));
      setSuccess(`Đã xóa đối tác ${partnerToDelete.company_name} thành công`);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting partner:", error);
      setError("Không thể xóa đối tác. Vui lòng thử lại sau.");

      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setShowDeleteModal(false);
      setPartnerToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lý đối tác</h1>
          <p className={styles.subtitle}>Xem và quản lý tất cả đối tác</p>
        </div>
        <Link href="/admin/partners/add" className={styles.addButton}>
          <PlusIcon className="h-5 w-5 mr-1" />
          Thêm đối tác mới
        </Link>
      </header>

      {/* Alerts */}
      {error && (
        <div className={styles.errorAlert}>
          <ExclamationCircleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.successAlert}>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className={styles.toolbarContainer}>
        <div className={styles.searchContainer}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, địa chỉ..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Partners Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.idColumn}>ID</th>
              <th className={styles.infoColumn}>Thông tin</th>
              <th className={styles.locationColumn}>Địa chỉ</th>
              <th className={styles.statsColumn}>Đánh giá</th>
              <th className={styles.statusColumn}>Trạng thái</th>
              <th className={styles.actionsColumn}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <motion.tr
                  key={partner.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className={styles.idColumn}>#{partner.id}</td>
                  <td className={styles.infoColumn}>
                    <div className={styles.partnerInfo}>
                      <div className={styles.avatarContainer}>
                        <Image
                          src={partner.avatar || "/images/default-partner.png"}
                          alt={partner.company_name}
                          width={48}
                          height={48}
                          className={styles.avatar}
                        />
                        {partner.is_verified && (
                          <span className={styles.premiumBadge}>Verified</span>
                        )}
                      </div>
                      <div>
                        <h3 className={styles.partnerName}>
                          {partner.company_name}
                        </h3>
                        <p className={styles.partnerEmail}>
                          {partner.email || "Email không có sẵn"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.locationColumn}>{partner.city}</td>
                  <td className={styles.statsColumn}>
                    <div className={styles.ratingContainer}>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(partner.avg_rating || 0)
                                ? styles.starFilled
                                : styles.starEmpty
                            }`}
                          />
                        ))}
                      </div>
                      <span className={styles.ratingText}>
                        {(partner.avg_rating || 0).toFixed(1)} ({partner.totalBookings || 0}{" "}
                        lượt đặt)
                      </span>
                    </div>
                  </td>
                  <td className={styles.statusColumn}>
                    <span
                      className={`${styles.statusBadge} ${
                        partner.isPremium
                          ? styles.statusActive
                          : styles.statusInactive
                      }`}
                    >
                      {partner.isPremium ? "Premium" : "Standard"}
                    </span>
                  </td>
                  <td className={styles.actionsColumn}>
                    <div className={styles.actionButtons}>
                      <Link
                        href={`/admin/partners/${partner.id}`}
                        className={styles.viewButton}
                      >
                        Chi tiết
                      </Link>
                      <Link
                        href={`/admin/partners/${partner.id}/edit`}
                        className={styles.editButton}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(partner)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  {searchTerm
                    ? "Không tìm thấy đối tác phù hợp"
                    : "Chưa có đối tác nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && partnerToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Xác nhận xóa</h3>
            <p className={styles.modalText}>
              Bạn có chắc chắn muốn xóa đối tác{" "}
              <strong>{partnerToDelete.company_name}</strong>? Hành động này không thể
              hoàn tác.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowDeleteModal(false);
                  setPartnerToDelete(null);
                }}
              >
                Hủy
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteConfirm}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
