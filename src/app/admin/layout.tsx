"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authApi } from "@/lib/api";
import {
  HomeIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import styles from "@/styles/components/AdminLayout.module.css";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Người dùng", href: "/admin/users", icon: UserGroupIcon },
    { name: "Đối tác", href: "/admin/partners", icon: UserGroupIcon },
  ];

  const handleLogout = () => {
    authApi.logout();
    router.push("/dang-nhap");
  };

  return (
    <RoleGuard
      allowedRoles={["admin"]}
      redirectTo="/dang-nhap"
      fallbackRedirect="/partner/dashboard"
    >
      <div className={styles.adminContainer}>
        {/* Mobile sidebar toggle */}
        <div className={styles.mobileToggle}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.toggleButton}
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        >
          <div className={styles.sidebarHeader}>
            <Link href="/admin" className={styles.logo}>
              <h1 className={styles.logoText}>Beauty Studio Admin</h1>
            </Link>
            <button
              className={styles.closeSidebar}
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className={styles.sidebarContent}>
            {/* Admin profile */}
            <div className={styles.adminProfile}>
              <div className={styles.avatarContainer}>
                <Image
                  src="/images/default-avatar.png"
                  alt="Admin"
                  width={50}
                  height={50}
                  className={styles.avatar}
                />
              </div>
              <div>
                <p className={styles.adminName}>{user?.full_name || "Admin"}</p>
                <p className={styles.adminRole}>Administrator</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className={styles.navigation}>
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${styles.navItem} ${
                      isActive ? styles.navItemActive : ""
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={styles.navIcon} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout button */}
          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </RoleGuard>
  );
}
