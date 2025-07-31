"use client";

import { motion } from "framer-motion";
import styles from "@/styles/components/FilterBar.module.css";

interface Category {
  id: string;
  name: string;
}

interface FilterBarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const FilterBar = ({
  categories,
  activeCategory,
  onCategoryChange,
}: FilterBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.filterContainer}
    >
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${styles.filterButton} ${
            activeCategory === category.id ? styles.active : ""
          }`}
        >
          {category.name}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default FilterBar;
