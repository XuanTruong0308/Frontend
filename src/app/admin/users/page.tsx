"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { adminApi, User } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/components/AdminUsers.module.css";

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<Omit<User, "password_hash">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const usersData = await adminApi.getAllUsers(token);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBanUser = async (userId: number, currentStatus: boolean) => {
    if (!token) return;

    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");

      const newStatus = !currentStatus;
      await adminApi.banUser(token, userId, !newStatus);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_active: newStatus }
          : user
      ));

      setSuccess(newStatus ? "Người dùng đã được bỏ cấm" : "Người dùng đã bị cấm");
    } catch (error) {
      console.error("Error banning user:", error);
      setError("Không thể thực hiện thao tác này");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "Admin":
        return styles.roleAdmin;
      case "Partner":
        return styles.rolePartner;
      default:
        return styles.roleUser;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <UserGroupIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className={styles.title}>Quản lý người dùng</h1>
            <p className={styles.subtitle}>
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{users.length}</span>
            <span className={styles.statLabel}>Tổng số người dùng</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {users.filter(u => u.is_active).length}
            </span>
            <span className={styles.statLabel}>Đang hoạt động</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {users.filter(u => !u.is_active).length}
            </span>
            <span className={styles.statLabel}>Bị cấm</span>
          </div>
        </div>
      </header>

      {/* Alerts */}
      {error && (
        <motion.div
          className={styles.errorAlert}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          className={styles.successAlert}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircleIcon className="h-5 w-5" />
          <span>{success}</span>
        </motion.div>
      )}

      {/* Users Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={!user.is_active ? styles.bannedRow : ""}
              >
                <td className={styles.idCell}>{user.id}</td>
                <td className={styles.nameCell}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.full_name}</span>
                    {user.phone_number && (
                      <span className={styles.userPhone}>{user.phone_number}</span>
                    )}
                  </div>
                </td>
                <td className={styles.emailCell}>{user.email}</td>
                <td className={styles.roleCell}>
                  <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className={styles.statusCell}>
                  {user.is_active ? (
                    <span className={styles.activeStatus}>
                      <CheckCircleIcon className="h-4 w-4" />
                      Hoạt động
                    </span>
                  ) : (
                    <span className={styles.bannedStatus}>
                      <XCircleIcon className="h-4 w-4" />
                      Bị cấm
                    </span>
                  )}
                </td>
                <td className={styles.dateCell}>
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className={styles.actionCell}>
                  {user.role !== "Admin" && (
                    <button
                      onClick={() => handleBanUser(user.id, user.is_active)}
                      className={
                        user.is_active ? styles.banButton : styles.unbanButton
                      }
                      disabled={actionLoading === user.id}
                    >
                      {actionLoading === user.id ? (
                        <div className={styles.actionSpinner}></div>
                      ) : user.is_active ? (
                        "Cấm"
                      ) : (
                        "Bỏ cấm"
                      )}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className={styles.emptyState}>
            <UserGroupIcon className="h-12 w-12 text-gray-400" />
            <p>Không có người dùng nào trong hệ thống</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
