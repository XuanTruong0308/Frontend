import React from "react";
import styles from "@/styles/components/PartnerFilter.module.css";

interface PartnerFilterProps {
  cityOptions: string[];
  provinceOptions: string[];
  selectedCity: string;
  selectedProvince: string;
  onFilterChange: (filterType: "city" | "province", value: string) => void;
  onClearFilters: () => void;
}

const PartnerFilter: React.FC<PartnerFilterProps> = ({
  cityOptions,
  provinceOptions,
  selectedCity,
  selectedProvince,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className={styles.filterContainer}>
      <h3 className={styles.filterTitle}>Lọc đối tác</h3>

      <div className={styles.filterGroup}>
        <label htmlFor="cityFilter" className={styles.filterLabel}>
          Thành phố:
        </label>
        <select
          id="cityFilter"
          className={styles.filterSelect}
          value={selectedCity}
          onChange={(e) => onFilterChange("city", e.target.value)}
        >
          <option value="">Tất cả thành phố</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="provinceFilter" className={styles.filterLabel}>
          Tỉnh/Thành phố:
        </label>
        <select
          id="provinceFilter"
          className={styles.filterSelect}
          value={selectedProvince}
          onChange={(e) => onFilterChange("province", e.target.value)}
        >
          <option value="">Tất cả tỉnh/thành phố</option>
          {provinceOptions.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {(selectedCity || selectedProvince) && (
        <button onClick={onClearFilters} className={styles.clearButton}>
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
};

export default PartnerFilter;
