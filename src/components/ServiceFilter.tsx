import React from "react";
import styles from "@/styles/components/ServiceFilter.module.css";

interface ServiceFilterProps {
  categoryOptions: string[];
  cityOptions: string[];
  provinceOptions: string[];
  selectedCategory: string;
  selectedCity: string;
  selectedProvince: string;
  onFilterChange: (
    filterType: "category" | "city" | "province",
    value: string,
  ) => void;
  onClearFilters: () => void;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({
  categoryOptions,
  cityOptions,
  provinceOptions,
  selectedCategory,
  selectedCity,
  selectedProvince,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className={styles.filterContainer}>
      <h3 className={styles.filterTitle}>Lọc dịch vụ</h3>

      <div className={styles.filterGroup}>
        <label htmlFor="categoryFilter" className={styles.filterLabel}>
          Loại dịch vụ:
        </label>
        <select
          id="categoryFilter"
          className={styles.filterSelect}
          value={selectedCategory}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="">Tất cả dịch vụ</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

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

      {(selectedCategory || selectedCity || selectedProvince) && (
        <button onClick={onClearFilters} className={styles.clearButton}>
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
};

export default ServiceFilter;
