






"use client";

import { motion } from "framer-motion";

export default function BeforeAfterCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="
        relative max-w-5xl mx-auto
        rounded-3xl border border-white/10
        bg-white/5 dark:bg-neutral-900/10
        backdrop-blur-3xl shadow-lg
        p-8 flex flex-col md:flex-row gap-6
      "
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Before Section */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="
          flex-1 rounded-2xl p-5
          bg-white/10 dark:bg-neutral-800/10
          backdrop-blur-xl shadow-sm
          border border-white/10
          hover:scale-[1.02] hover:shadow-xl transition-transform
        "
      >
        <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">
          Before (Legal Jargon)
        </span>
        <p className="mt-3 text-neutral-100 dark:text-neutral-50 font-serif leading-relaxed">
          "The Lessee shall indemnify, defend, and hold harmless the Lessor
          from and against any and all claims..."
        </p>
      </motion.div>

      {/* After Section */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        className="
          flex-1 rounded-2xl p-5
          bg-white/10 dark:bg-neutral-800/10
          backdrop-blur-xl shadow-sm
          border border-white/10
          hover:scale-[1.02] hover:shadow-xl transition-transform
        "
      >
        <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
          After (Plain English)
        </span>
        <p className="mt-3 text-neutral-100 dark:text-neutral-50 font-sans leading-relaxed">
          "If someone gets hurt on the property, you (the renter) are
          responsible for legal costs, not the landlord."
        </p>
      </motion.div>
    </motion.div>
  );
}
