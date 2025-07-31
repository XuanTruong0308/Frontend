"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/components/AuthForm.module.css";

interface AuthFormData {
  full_name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone_number?: string;
}

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const { login, register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [redirectCounter, setRedirectCounter] = useState(3);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for message in URL query params (for redirects with messages)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const message = params.get("message");
      if (message) {
        setSuccessMessage(message);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AuthFormData>();

  const password = watch("password");

  // Effect for countdown timer and redirect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (successMessage && redirectCounter > 0) {
      timer = setTimeout(() => {
        setRedirectCounter((prev) => prev - 1);
      }, 1000);
    } else if (successMessage && redirectCounter === 0) {
      if (type === "register") {
        router.push("/dang-nhap");
      } else {
        router.push("/");
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [successMessage, redirectCounter, type, router]);

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (type === "register") {
        await registerUser({
          email: data.email,
          password: data.password,
          full_name: data.full_name!,
          phone_number: data.phone_number,
        });

        // Show success message with countdown
        setSuccessMessage("Đăng ký thành công! Chuyển sang trang chủ sau");
      } else {
        await login(data.email, data.password);

        // Show success message with countdown
        setSuccessMessage("Đăng nhập thành công! Chuyển sang trang chủ sau");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      if (!successMessage) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.successMessage}
        >
          <CheckCircleIcon className={styles.successIcon} />
          <div>
            <p>{successMessage}</p>
            <p className={styles.redirectText}>{redirectCounter} giây...</p>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.errorMessage}
        >
          <XCircleIcon className={styles.errorIcon} />
          <div>
            <p>{errorMessage}</p>
            <button
              className={styles.dismissButton}
              onClick={() => setErrorMessage(null)}
            >
              Đóng
            </button>
          </div>
        </motion.div>
      )}
      {type === "register" && (
        <>
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
            <label className={styles.label}>Số điện thoại (tùy chọn)</label>
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
        </>
      )}

      <div className={styles.inputGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          {...register("email", {
            required: "Vui lòng nhập email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email không hợp lệ",
            },
          })}
        />
        {errors.email && (
          <span className={styles.errorMessage}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Mật khẩu</label>
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ""}`}
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className={styles.eyeIcon} />
            ) : (
              <EyeIcon className={styles.eyeIcon} />
            )}
          </button>
        </div>
        {errors.password && (
          <span className={styles.errorMessage}>{errors.password.message}</span>
        )}
      </div>

      {type === "register" && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Xác nhận mật khẩu</label>
          <div className={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`${styles.input} ${styles.passwordInput} ${errors.confirmPassword ? styles.inputError : ""}`}
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === password || "Mật khẩu xác nhận không khớp",
              })}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className={styles.eyeIcon} />
              ) : (
                <EyeIcon className={styles.eyeIcon} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className={styles.errorMessage}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting || successMessage !== null}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonLoading : ""}`}
      >
        {isSubmitting
          ? "Đang xử lý..."
          : type === "login"
            ? "Đăng nhập"
            : "Đăng ký"}
      </motion.button>

      <div className={styles.divider}>
        <span className={styles.dividerText}>Hoặc</span>
      </div>

      <div className={styles.socialButtons}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${styles.socialButton} ${styles.googleButton}`}
        >
          <svg className={styles.socialIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Tiếp tục với Google
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`${styles.socialButton} ${styles.facebookButton}`}
        >
          <svg className={styles.socialIcon} viewBox="0 0 24 24">
            <path
              fill="#1877F2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          Tiếp tục với Facebook
        </motion.button>
      </div>
    </motion.form>
  );
};

export default AuthForm;
