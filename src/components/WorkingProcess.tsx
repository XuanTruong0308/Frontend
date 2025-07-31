"use client";

import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import styles from "@/styles/components/WorkingProcess.module.css";

const WorkingProcess = () => {
  const steps = [
    {
      id: 1,
      title: "Tìm kiếm dịch vụ",
      description: "Browse và chọn dịch vụ phù hợp với nhu cầu của bạn",
      icon: MagnifyingGlassIcon,
      color: "primary",
    },
    {
      id: 2,
      title: "Đặt lịch",
      description: "Chọn thời gian và đặt lịch hẹn với đối tác",
      icon: CalendarDaysIcon,
      color: "secondary",
    },
    {
      id: 3,
      title: "Thanh toán",
      description: "Thanh toán an toàn qua các phương thức đa dạng",
      icon: CreditCardIcon,
      color: "accent",
    },
    {
      id: 4,
      title: "Trải nghiệm & Đánh giá",
      description: "Enjoy dịch vụ chất lượng và để lại đánh giá",
      icon: StarIcon,
      color: "green",
    },
  ];

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
            Quy trình đặt dịch vụ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.subtitle}
          >
            Chỉ với 4 bước đơn giản, bạn đã có thể trải nghiệm dịch vụ làm đẹp
            chuyên nghiệp
          </motion.p>
        </div>

        <div className={styles.grid}>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={styles.step}
            >
              {/* Step Number */}
              <div className={styles.stepNumber}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                  className={styles.numberCircle}
                >
                  {step.id}
                </motion.div>

                {/* Connecting Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className={styles.connectingLine}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                      className={styles.lineProgress}
                    />
                  </div>
                )}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
                className={styles.iconContainer}
              >
                <step.icon className={`${styles.icon} ${styles[step.color]}`} />
              </motion.div>

              {/* Content */}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className={styles.ctaSection}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.ctaButton}
          >
            Bắt đầu ngay
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkingProcess;
