"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "light", label: "Sáng", icon: SunIcon },
    { value: "dark", label: "Tối", icon: MoonIcon },
    { value: "system", label: "Hệ thống", icon: ComputerDesktopIcon },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {currentTheme && (
          <>
            <currentTheme.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{currentTheme.label}</span>
          </>
        )}
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20"
          >
            <div className="p-1">
              {themes.map((themeOption) => (
                <motion.button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                    theme === themeOption.value
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <themeOption.icon className="h-4 w-4" />
                  <span>{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Current resolved theme indicator */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {resolvedTheme === "dark" ? (
                  <MoonIcon className="h-3 w-3" />
                ) : (
                  <SunIcon className="h-3 w-3" />
                )}
                <span>
                  Hiện tại: {resolvedTheme === "dark" ? "Tối" : "Sáng"}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
