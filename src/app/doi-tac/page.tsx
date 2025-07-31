"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PartnerCard from "@/components/PartnerCard";
import { partnersApi, Partner } from "@/lib/api";
import styles from "@/styles/components/DoiTac.module.css";

const DoiTacPage = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating"); // Default sort by rating

  // Extract city and province from location string
  const extractLocationData = (partners: Partner[]) => {
    const cities = new Set<string>();
    const provinces = new Set<string>();

    partners.forEach((partner) => {
      if (partner.location) {
        // Assuming location format is: address, city, province
        // Or any format where city and province are the last words
        const locationParts = partner.location
          .split(",")
          .map((part) => part.trim());

        if (locationParts.length >= 2) {
          const city = locationParts[locationParts.length - 2];
          const province = locationParts[locationParts.length - 1];

          if (city) cities.add(city);
          if (province) provinces.add(province);
        }
      }
    });

    setCityOptions(Array.from(cities).sort());
    setProvinceOptions(Array.from(provinces).sort());
  };

  // Fetch partners from API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const filters: { city?: string; province?: string } = {};
        if (selectedCity) filters.city = selectedCity;
        if (selectedProvince) filters.province = selectedProvince;

        const data = await partnersApi.getAll();
        setPartners(data);
        setFilteredPartners(data);
        extractLocationData(data);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
        setPartners([]);
        setFilteredPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [selectedCity, selectedProvince]);

  // Handle search and filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPartners(partners);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = partners.filter(
        (partner) =>
          partner.name?.toLowerCase().includes(term) ||
          partner.location?.toLowerCase().includes(term),
      );
      setFilteredPartners(filtered);
    }
  }, [searchTerm, partners]);

  // Handle sorting
  useEffect(() => {
    const sortedPartners = [...filteredPartners];
    switch (sortBy) {
      case "rating":
        sortedPartners.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
        break;
      case "bookings":
        sortedPartners.sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0));
        break;
      case "name":
        sortedPartners.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }
    setFilteredPartners(sortedPartners);
  }, [sortBy, filteredPartners]);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCity("");
    setSelectedProvince("");
    setSearchTerm("");
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroTitle}
          >
            Đối tác của chúng tôi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.heroSubtitle}
          >
            Kết nối với những chuyên gia làm đẹp hàng đầu, mang đến trải nghiệm
            tuyệt vời cho khách hàng
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.heroButton}
          >
            Trở thành đối tác
          </motion.button>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.mainContainer}>
          {/* Filters */}
          <div className={styles.sidebarContainer}>
            <div className={styles.filterHeader}>
              <h2 className={styles.filterTitle}>Bộ lọc tìm kiếm</h2>
              <p className={styles.filterDescription}>
                Tùy chỉnh tìm kiếm để tìm đối tác phù hợp nhất
              </p>
            </div>

            {/* Search box */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Tìm theo tên hoặc địa chỉ..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className={styles.searchIcon} />
            </div>

            {/* City filter */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Thành phố</label>
              <select
                className={styles.filterSelect}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Tất cả thành phố</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Province filter */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Tỉnh/thành</label>
              <select
                className={styles.filterSelect}
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">Tất cả tỉnh/thành</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            <button
              className={styles.filterButton}
              onClick={handleClearFilters}
            >
              Xóa bộ lọc
            </button>
          </div>

          {/* Partners List */}
          <div className={styles.contentContainer}>
            {/* Sort controls */}
            <div className={styles.sortControls}>
              <p className={styles.resultsCount}>
                {loading
                  ? "Đang tải..."
                  : filteredPartners.length > 0
                    ? `Hiển thị ${filteredPartners.length} đối tác`
                    : "Không tìm thấy đối tác nào"}
              </p>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="rating">Sắp xếp theo: Đánh giá</option>
                <option value="bookings">Sắp xếp theo: Lượt đặt</option>
                <option value="name">Sắp xếp theo: Tên (A-Z)</option>
              </select>
            </div>

            {loading ? (
              <div className={styles.partnersList}>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-lg shadow-sm h-48 animate-pulse"
                  >
                    <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.partnersList}>
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner, index) => (
                    <PartnerCard
                      key={partner.id}
                      partner={partner}
                      index={index}
                    />
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <p>
                      Không tìm thấy đối tác nào phù hợp với bộ lọc. Vui lòng
                      thử lại với các tiêu chí khác.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Become Partner Section */}
      <section className={styles.becomePartnerSection}>
        <div className={styles.becomePartnerContainer}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.becomePartnerTitle}
          >
            Bạn là chuyên gia làm đẹp?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.becomePartnerSubtitle}
          >
            Tham gia cùng Beauty Studio để mở rộng khách hàng và phát triển dịch
            vụ của bạn
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={styles.buttonContainer}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.primaryButton}
            >
              Đăng ký ngay
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.secondaryButton}
            >
              Tìm hiểu thêm
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DoiTacPage;
