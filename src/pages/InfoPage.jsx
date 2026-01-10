// src/pages/hotel/HotelIntroPage.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUp from "react-countup";

export default function InfoPage() {
  return (
    <div className="w-full overflow-hidden">
      {/* ================= Hero Section ================= */}
      <section
        className="h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center text-white"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to Our Hotel
          </h1>
          <p className="text-lg opacity-90">
            Experience Luxury & Comfort
          </p>

          <div className="mt-10 animate-bounce">↓</div>
        </motion.div>
      </section>

      {/* ================= About Section ================= */}
      <section className="py-32 px-6 max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-6"
        >
          A Place of Elegance & Relaxation
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-600 leading-relaxed"
        >
          Discover a luxurious retreat where sophisticated design meets
          exceptional comfort. From breathtaking views to premium services,
          every moment is crafted for your perfect stay.
        </motion.p>
      </section>

      {/* ================= Stats Section ================= */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <StatItem label="Elegant Rooms" value={120} />
          <StatItem label="Guests Per Year" value={50000} />
          <StatItem label="5-Star Rating" value={5} suffix="★" />
        </div>
      </section>

      {/* ================= Image Section ================= */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            className="rounded-xl shadow-lg"
          />

          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* ================= Closing Section ================= */}
      <section className="py-32 bg-gray-100 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold mb-4"
        >
          Your Journey Begins Here
        </motion.h3>

        <p className="text-gray-600">
          Relax. Explore. Experience the difference.
        </p>
      </section>
    </div>
  );
}

/* ================= Components ================= */

function StatItem({ label, value, suffix = "+" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
    >
      <div className="text-5xl font-bold mb-2">
        {isInView && <CountUp end={value} duration={2} />}
        {suffix}
      </div>
      <p className="text-gray-400">{label}</p>
    </motion.div>
  );
}
