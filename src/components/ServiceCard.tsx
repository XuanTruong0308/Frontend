"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Service } from "@/lib/api";
import styles from "@/styles/components/ServiceCard.module.css";

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 50px rgba(255, 105, 180, 0.3)",
      }}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <Image
          src="/images/default-avatar.png"
          alt={service.service_name}
          fill
          className={styles.image}
        />
        <div className={styles.categoryBadge}>{service.service_type}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{service.service_name}</h3>
        <p className={styles.description}>{service.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(service.price)}</span>
          <div className={styles.buttonGroup}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.bookButton}
            >
              Đặt ngay
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/dich-vu/${service.id}`}
                className={styles.detailButton}
              >
                Chi tiết
              </Link>
            </motion.div>
          </div>
        </div>

        <div className={styles.partnerInfo}>
          <span>👤</span>
          <span className={styles.partnerText}>
            {service.partner?.company_name || "Dịch vụ chuyên nghiệp"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
