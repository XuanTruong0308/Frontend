"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  UserPlusIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { adminApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/components/AdminAddPartner.module.css";

const AddPartner = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    if (!token) {
      setError("Bạn cần đăng nhập để thực hiện chức năng này");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await adminApi.promoteToPartner(token, email);
      setSuccess("Đối tác đã được tạo thành công!");
      setEmail("");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin/partners");
      }, 2000);
    } catch (error: unknown) {
      console.error("Error creating partner:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("already exists")) {
        setError("Email này đã được sử dụng cho một đối tác khác");
      } else if (errorMessage.includes("not found")) {
        setError("Không tìm thấy người dùng với email này");
      } else {
        setError("Có lỗi xảy ra khi tạo đối tác. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/partners");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Quay lại</span>
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Thêm đối tác mới</h1>
          <p className={styles.subtitle}>
            Nhập email của người dùng để tạo tài khoản đối tác
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.content}>
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.formHeader}>
            <UserPlusIcon className="h-8 w-8 text-blue-600" />
            <h2 className={styles.formTitle}>Thông tin đối tác</h2>
            <p className={styles.formDescription}>
              Hệ thống sẽ tự động tạo tài khoản đối tác dựa trên email đã tồn
              tại trong hệ thống.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <motion.div
              className={styles.errorAlert}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ExclamationCircleIcon className="h-5 w-5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              className={styles.successAlert}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email người dùng
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của người dùng..."
                className={styles.input}
                disabled={loading}
                required
              />
              <p className={styles.helpText}>
                Email phải thuộc về một người dùng đã đăng ký trong hệ thống.
              </p>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleBack}
                className={styles.cancelButton}
                disabled={loading}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="h-5 w-5" />
                    <span>Tạo đối tác</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Information Section */}
          <div className={styles.infoSection}>
            <h3 className={styles.infoTitle}>Lưu ý:</h3>
            <ul className={styles.infoList}>
              <li>Email phải thuộc về một tài khoản người dùng đã tồn tại</li>
              <li>Người dùng sẽ được tự động nâng cấp thành đối tác</li>
              <li>Đối tác có thể đăng nhập và quản lý dịch vụ của họ</li>
              <li>Bạn có thể cập nhật thông tin đối tác sau khi tạo</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddPartner;
