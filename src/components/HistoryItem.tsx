"use client";
import styles from "@/styles/components/History.module.css";

interface HistoryItemProps {
  id: number;
  title: string;
  status: string;
  details: Array<{
    label: string;
    value: string;
    type?: "price" | "date" | "normal";
  }>;
  statusVariant?:
    | "completed"
    | "paid"
    | "cancelled"
    | "failed"
    | "pending"
    | "booked";
}

export default function HistoryItem({
  title,
  status,
  details,
  statusVariant = "pending",
}: HistoryItemProps) {
  const getStatusClass = (variant: string) => {
    switch (variant) {
      case "completed":
        return styles.statusCompleted;
      case "paid":
        return styles.statusPaid;
      case "cancelled":
        return styles.statusCancelled;
      case "failed":
        return styles.statusFailed;
      case "booked":
        return styles.statusBooked;
      default:
        return styles.statusPending;
    }
  };

  return (
    <div className={styles.historyItem}>
      <div className={styles.itemHeader}>
        <h3 className={styles.itemTitle}>{title}</h3>
        <span
          className={`${styles.statusBadge} ${getStatusClass(statusVariant)}`}
        >
          {status}
        </span>
      </div>

      <div className={styles.itemDetails}>
        {details.map((detail, index) => (
          <div key={index} className={styles.detailItem}>
            <span className={styles.detailLabel}>{detail.label}</span>
            <span
              className={`${styles.detailValue} ${
                detail.type === "price"
                  ? styles.priceValue
                  : detail.type === "date"
                    ? styles.dateValue
                    : ""
              }`}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
