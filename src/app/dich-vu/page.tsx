"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FilterBar from "@/components/FilterBar";
import ServiceFilter from "@/components/ServiceFilter";
import ServiceCard from "@/components/ServiceCard";
import { servicesApi, Service } from "@/lib/api";
import styles from "@/styles/components/DichVu.module.css";

const DichVuPage = () => {
  // We're using filteredServices directly instead of a separate services state
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "makeup", name: "Makeup" },
    { id: "chup-anh", name: "Chụp ảnh" },
    { id: "thue-do", name: "Thuê đồ" },
    { id: "spa", name: "Spa & Massage" },
  ];

  // Extract city and province from partner location string
  const extractLocationData = (servicesList: Service[]) => {
    const cities = new Set<string>();
    const provinces = new Set<string>();

    servicesList.forEach((service) => {
      if (service.partner && service.partner.location) {
        // Assuming location format is: address, city, province
        // Or any format where city and province are the last words
        const locationParts = service.partner.location
          .split(",")
          .map((part: string) => part.trim());

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

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        // Use search API with filters
        const searchParams: {
          service_type?: string;
          city?: string;
        } = {};

        if (activeCategory !== "all") {
          searchParams.service_type = activeCategory;
        }

        if (selectedCity) {
          searchParams.city = selectedCity;
        }

        const data =
          Object.keys(searchParams).length > 0
            ? await servicesApi.search(searchParams)
            : await servicesApi.getAll();

        setFilteredServices(data);

        // If this is the first load with no filters, extract location options
        if (
          !selectedCity &&
          !selectedProvince &&
          (cityOptions.length === 0 || provinceOptions.length === 0)
        ) {
          extractLocationData(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setFilteredServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [
    activeCategory,
    selectedCity,
    selectedProvince,
    cityOptions.length,
    provinceOptions.length,
  ]);

  const handleFilterChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleLocationFilterChange = (
    filterType: "category" | "city" | "province",
    value: string,
  ) => {
    if (filterType === "category") {
      setActiveCategory(value || "all");
    } else if (filterType === "city") {
      setSelectedCity(value);
    } else {
      setSelectedProvince(value);
    }
  };

  const handleClearFilters = () => {
    setSelectedCity("");
    setSelectedProvince("");
    setActiveCategory("all");
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
            Dịch vụ làm đẹp
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.heroSubtitle}
          >
            Khám phá đa dạng dịch vụ làm đẹp chuyên nghiệp từ các đối tác uy tín
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleFilterChange}
          />
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={styles.mainContainer}>
          <div className={styles.sidebarContainer}>
            <ServiceFilter
              categoryOptions={categories.slice(1).map((cat) => cat.id)}
              cityOptions={cityOptions}
              provinceOptions={provinceOptions}
              selectedCategory={activeCategory !== "all" ? activeCategory : ""}
              selectedCity={selectedCity}
              selectedProvince={selectedProvince}
              onFilterChange={handleLocationFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className={styles.contentContainer}>
            {/* Services Grid */}
            <div className={styles.servicesContainer}>
              <h2 className={styles.sectionTitle}>
                {loading
                  ? "Đang tải dịch vụ..."
                  : filteredServices.length > 0
                    ? `${filteredServices.length} dịch vụ được tìm thấy`
                    : "Không tìm thấy dịch vụ nào phù hợp với bộ lọc"}
              </h2>

              {loading ? (
                <div className={styles.loadingGrid}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={styles.loadingCard}>
                      <div className={styles.loadingImage}></div>
                      <div className={styles.loadingTitle}></div>
                      <div className={styles.loadingDescription}></div>
                      <div className={styles.loadingPrice}></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div layout className={styles.servicesGrid}>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        index={index}
                      />
                    ))
                  ) : (
                    <div className={styles.noResults}>
                      <p>
                        Không tìm thấy dịch vụ phù hợp với bộ lọc. Vui lòng thử
                        lại với các tiêu chí khác.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DichVuPage;
