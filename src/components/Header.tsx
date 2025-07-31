"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import styles from "@/styles/components/Header.module.css";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, logout, isLoggedIn, isPartner, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Dịch vụ", href: "/dich-vu" },
    { name: "Đối tác", href: "/doi-tac" },
    // { name: "Liên hệ", href: "/lien-he" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={styles.logoText}
            >
              Beauty Studio
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className={styles.navLink}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth/User Box */}
          <div className={styles.authButtons}>
            {isLoggedIn && user ? (
              <div
                className={styles.userBox}
                onClick={() => setShowDropdown((v) => !v)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <Image
                  src="/images/default-avatar.png"
                  alt="avatar"
                  width={32}
                  height={32}
                  style={{ borderRadius: "50%", marginRight: 8 }}
                />
                <span>{user.full_name}</span>
                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/profile">Thông tin cá nhân</Link>
                    <Link href="/lich-su-dat-lich">Lịch sử đặt lịch</Link>
                    <Link href="/lich-su-giao-dich">Lịch sử giao dịch</Link>
                    {isAdmin && (
                      <Link href="/admin" className={styles.adminLink}>
                        Admin Dashboard
                      </Link>
                    )}
                    {isPartner && (
                      <Link href="/partner" className={styles.partnerLink}>
                        Partner Dashboard
                      </Link>
                    )}
                    {/* {user.role === "partner" && (
                      <Link
                        href="/partner/dashboard"
                        className={styles.partnerLink}
                      >
                        Quản lý đối tác
                      </Link>
                    )} */}
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        padding: "8px 0",
                        cursor: "pointer",
                        color: "red",
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/dang-nhap" className={styles.loginButton}>
                  Đăng nhập
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dang-ky" className={styles.signupButton}>
                    Đăng ký
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.mobileMenuButton}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mounted && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.mobileMenu}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className={styles.mobileAuthButtons}>
              {isLoggedIn && user ? (
                <>
                  <Link
                    href="/profile"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Thông tin cá nhân
                  </Link>
                  {/* <Link
                    href="/lich-su-dat-lich"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lịch sử đặt lịch
                  </Link>
                  <Link
                    href="/lich-su-giao-dich"
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lịch sử giao dịch
                  </Link> */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={styles.mobileNavLink}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isPartner && (
                    <Link
                      href="/partner"
                      className={styles.mobileNavLink}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Partner Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className={styles.mobileLogoutButton}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dang-nhap"
                    className={styles.loginButton}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    className={styles.mobileSignupButton}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
