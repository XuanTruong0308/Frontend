"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { Partner } from "@/lib/api";

interface PartnerCardProps {
  partner: Partner;
  index: number;
}

const PartnerCard = ({ partner, index }: PartnerCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 20px 50px rgba(126, 91, 239, 0.3)",
      }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Premium Badge */}
      {partner.is_verified && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Verified
        </div>
      )}

      {/* Partner Avatar */}
      <div className="text-center mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src="/images/default-avatar.png"
            alt={partner.company_name}
            fill
            className="rounded-full object-cover border-4 border-secondary"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
        </div>
        <h3 className="text-xl font-bold text-textcolor mb-2">
          {partner.company_name}
        </h3>
        <p className="text-gray-600 mb-3">{partner.city || "Chưa cập nhật"}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex mr-2">{renderStars(5)}</div>
        <span className="text-lg font-semibold text-textcolor">5.0</span>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-1">100+</div>
          <div className="text-sm text-gray-600">Lượt đặt thành công</div>
        </div>
      </div>

      {/* View Profile Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full"
      >
        <Link
          href={`/doi-tac/${partner.id}`}
          className="block w-full bg-gradient-to-r from-secondary to-primary text-white text-center py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Xem hồ sơ
        </Link>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary bg-opacity-10 rounded-full"></div>
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary bg-opacity-10 rounded-full"></div>
    </motion.div>
  );
};

export default PartnerCard;
