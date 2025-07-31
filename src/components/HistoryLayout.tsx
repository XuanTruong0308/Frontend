"use client";
import { ReactNode } from "react";
import React from "react";
import styles from "@/styles/components/History.module.css";

interface HistoryLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  loading?: boolean;
  error?: string;
  emptyIcon?: string;
  emptyText?: string;
  emptySubtext?: string;
}

export default function HistoryLayout({
  title,
  subtitle,
  children,
  loading = false,
  error = "",
  emptyIcon = "📋",
  emptyText = "Không có dữ liệu",
  emptySubtext = "Dữ liệu sẽ hiển thị tại đây khi có.",
}: HistoryLayoutProps) {
  // Check if children is empty (React.Children.count returns 0 for empty children)
  const isEmpty = React.Children.count(children) === 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingText}>Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.content}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          {isEmpty ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>{emptyIcon}</div>
              <div className={styles.emptyText}>{emptyText}</div>
              <div className={styles.emptySubtext}>{emptySubtext}</div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
