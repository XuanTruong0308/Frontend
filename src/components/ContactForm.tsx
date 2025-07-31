"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { contactApi } from "@/lib/api";
import styles from "@/styles/components/ContactForm.module.css";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const result = await contactApi.sendMessage(data);
      console.log("Contact form success:", result);
      setIsSubmitted(true);
      reset();

      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error instanceof Error) {
        alert(`Lỗi: ${error.message}`);
      } else {
        alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.successMessage}
      >
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>Cảm ơn bạn đã liên hệ!</h3>
        <p className={styles.successText}>
          Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Liên hệ với chúng tôi</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Họ và tên *
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            id="name"
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            {...register("name", {
              required: "Vui lòng nhập họ và tên",
              minLength: {
                value: 2,
                message: "Họ và tên phải có ít nhất 2 ký tự",
              },
            })}
            placeholder="Nhập họ và tên của bạn"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.errorMessage}
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            id="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            {...register("email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            })}
            placeholder="Nhập email của bạn"
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.errorMessage}
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Message Field */}
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Tin nhắn *
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            id="message"
            className={`${styles.textarea} ${errors.message ? styles.textareaError : ""}`}
            {...register("message", {
              required: "Vui lòng nhập tin nhắn",
              minLength: {
                value: 10,
                message: "Tin nhắn phải có ít nhất 10 ký tự",
              },
            })}
            placeholder="Nhập tin nhắn của bạn..."
            rows={5}
          />
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.errorMessage}
            >
              {errors.message.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ""}`}
        >
          {isSubmitting ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              Đang gửi...
            </div>
          ) : (
            "Gửi tin nhắn"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ContactForm;
