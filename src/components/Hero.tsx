"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "@/styles/components/Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      {/* Background Image */}
      <div className={styles.background} />

      {/* Content */}
      <div className={styles.content}>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.title}
        >
          Chào mừng bạn đến{" "}
          <span className={styles.titleHighlight}>Beauty Studio</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={styles.subtitle}
        >
          Nền tảng kết nối dịch vụ làm đẹp chuyên nghiệp
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={styles.buttonContainer}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/dich-vu" className={styles.primaryButton}>
              Khám phá dịch vụ
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/doi-tac" className={styles.secondaryButton}>
              Trở thành đối tác
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Animation Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={styles.floatingElement1}
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className={styles.floatingElement2}
      />

      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className={styles.floatingElement3}
      />
    </section>
  );
};

export default Hero;
