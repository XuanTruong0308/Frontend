"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { usersApi } from "@/lib/api";
import styles from "@/styles/components/Profile.module.css";

interface ProfileFormData {
  full_name: string;
  phone_number?: string;
  address?: string;
}

const ProfileInfo = () => {
  const { user, token, updateUser, isLoggedIn, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>();

  // Load user data into form
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/dang-nhap";
      return;
    }

    if (user) {
      setValue("full_name", user.full_name);
      setValue("phone_number", user.phone_number || "");
      setValue("address", user.address || "");
    }
  }, [user, isLoggedIn, setValue]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    if (!token) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const updatedUser = await usersApi.updateProfile(token, {
        full_name: data.full_name,
        phone_number: data.phone_number,
        address: data.address,
      });

      // Update user context
      updateUser(updatedUser);
      setSuccessMessage("Cập nhật thông tin thành công!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Update profile error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Đang tải...</h2>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Không thể tải thông tin</h2>
          <p className={styles.profileSubtitle}>Vui lòng đăng nhập lại</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2 className={styles.profileTitle}>Thông tin cá nhân</h2>
        <p className={styles.profileSubtitle}>
          Quản lý thông tin cá nhân của bạn
        </p>
      </div>

      {successMessage && (
        <div className={styles.successMessage}>
          <CheckCircleIcon className={styles.alertIcon} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          <ExclamationCircleIcon className={styles.alertIcon} />
          {error}
        </div>
      )}

      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          <Image
            src="/images/default-avatar.png"
            alt="Avatar"
            width={120}
            height={120}
            className={styles.avatar}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.profileForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={`${styles.input} ${styles.inputDisabled}`}
            value={user.email}
            disabled
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Họ và tên</label>
          <input
            type="text"
            className={`${styles.input} ${errors.full_name ? styles.inputError : ""}`}
            {...register("full_name", {
              required: "Vui lòng nhập họ và tên",
              minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
            })}
          />
          {errors.full_name && (
            <span className={styles.errorMessage}>
              {errors.full_name.message}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Số điện thoại</label>
          <input
            type="tel"
            className={`${styles.input} ${errors.phone_number ? styles.inputError : ""}`}
            {...register("phone_number", {
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải có 10-11 chữ số",
              },
            })}
          />
          {errors.phone_number && (
            <span className={styles.errorMessage}>
              {errors.phone_number.message}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Địa chỉ</label>
          <input
            type="text"
            className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
            {...register("address")}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
