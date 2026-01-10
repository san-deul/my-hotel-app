// src/components/facilities/FacilityCard.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FacilityCard({ id, name, description, image, index }) {
  return (
    <div className="group">
      {/* 이미지 카드 */}
      <Link to={`/facilities/${id}`}>
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl shadow-lg"
        >
          <motion.img
            src={image}
            alt={name}
            className="w-full h-64 object-cover"
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* 살짝 어두워지는 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/25"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </Link>

      {/* 텍스트 영역 (카드 밖) */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          delay: index * 0.1, 

        }}
      >
        <h3 className="text-xl font-serif">{name}</h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {description}
        </p>
      </motion.div>
    </div>
  );
}
