"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { servicesApi, Service } from "@/lib/api";
import styles from "@/styles/components/HighlightServices.module.css";

const HighlightServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        // Take first 6 services as highlighted
        setServices(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching services:", error);
        // No fallback - show error or empty state
        console.error("Failed to load highlighted services");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Dịch vụ nổi bật</h2>
            <div className={styles.loadingGrid}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.loadingCard}></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.title}
          >
            Dịch vụ nổi bật
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.subtitle}
          >
            Khám phá những dịch vụ làm đẹp chất lượng cao được khách hàng yêu
            thích nhất
          </motion.p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{
                scale: 1.05,
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
                <div className={styles.categoryBadge}>
                  {service.service_type}
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{service.service_name}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>
                    {formatPrice(service.price)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.bookButton}
                  >
                    Đặt ngay
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={styles.ctaSection}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/dich-vu" className={styles.ctaButton}>
              Xem tất cả dịch vụ
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HighlightServices;
