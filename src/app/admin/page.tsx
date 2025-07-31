"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { adminApi } from "@/lib/api";
import { useAuth } from "../../context/AuthContext";
import styles from "@/styles/components/AdminDashboard.module.css";

interface DashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalServices: number;
}

function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPartners: 0,
    totalServices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const dashboardData = await adminApi.getStats(token);
        setStats(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Không thể tải thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: UserGroupIcon,
      color: "blue",
      href: "/admin/users",
    },
    {
      title: "Tổng đối tác",
      value: stats.totalPartners,
      icon: BuildingStorefrontIcon,
      color: "green",
      href: "/admin/partners",
    },
    {
      title: "Tổng dịch vụ",
      value: stats.totalServices,
      icon: Cog6ToothIcon,
      color: "purple",
      href: "/admin/services",
    },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Quản trị</h1>
        <p className={styles.subtitle}>
          Tổng quan hệ thống Beauty Studio
        </p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`${styles.statCard} ${styles[`statCard${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`]}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.statCardContent}>
              <div className={styles.statCardHeader}>
                <div className={styles.statCardIcon}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className={styles.statCardTitle}>{stat.title}</h3>
              </div>
              <div className={styles.statCardValue}>
                {stat.value.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Hành động nhanh</h2>
        <div className={styles.actionsGrid}>
          <motion.a
            href="/admin/users"
            className={styles.actionCard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserGroupIcon className="h-8 w-8" />
            <h3>Quản lý người dùng</h3>
            <p>Xem và quản lý tài khoản người dùng</p>
          </motion.a>

          <motion.a
            href="/admin/partners"
            className={styles.actionCard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BuildingStorefrontIcon className="h-8 w-8" />
            <h3>Quản lý đối tác</h3>
            <p>Thêm và quản lý đối tác</p>
          </motion.a>

          <motion.a
            href="/admin/partners/add"
            className={styles.actionCard}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Cog6ToothIcon className="h-8 w-8" />
            <h3>Thêm đối tác mới</h3>
            <p>Nâng cấp người dùng thành đối tác</p>
          </motion.a>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
