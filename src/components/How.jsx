"use client";
import React from "react";
import { Upload, MessageSquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hiddenLeft: { opacity: 0, x: -50 },
  hiddenBottom: { opacity: 0, y: 50 },
  hiddenRight: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, y: 0 },
};

const How = () => {
  return (
    <section
      className="relative w-full py-16 px-6"
      style={{
        backgroundColor: "#000",
      }}
    >
      {/* Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-2 text-white">How It Works</h2>
        <p className="text-gray-400">
          Transform complex legal documents into clear, understandable insights
          in three simple steps
        </p>
      </motion.div>

      {/* Steps */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {/* Step 1 */}
        <motion.div
          variants={cardVariants}
          initial="hiddenLeft"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="w-full md:w-1/3 p-6 flex flex-col items-center text-center rounded-[12px] border border-white/10"
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="bg-black/10 rounded-xl p-4 mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            Upload Your Document
          </h3>
          <p className="text-gray-300 text-sm">
            Drag and drop any legal document. We support PDFs, Word docs, and
            text files.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Secure upload with instant processing
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={cardVariants}
          initial="hiddenBottom"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full md:w-1/3 p-6 flex flex-col items-center text-center rounded-[12px] border border-white/10"
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="bg-black/10 rounded-xl p-4 mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            AI Analysis
          </h3>
          <p className="text-gray-300 text-sm">
            Our advanced AI reads and analyzes your document in seconds using
            Google Cloud.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Complex legal terms simplified instantly
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={cardVariants}
          initial="hiddenRight"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="w-full md:w-1/3 p-6 flex flex-col items-center text-center rounded-[12px] border border-white/10"
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="bg-black/10 rounded-xl p-4 mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            Get Clear Answers
          </h3>
          <p className="text-gray-300 text-sm">
            Receive plain-English summaries and ask specific questions about any
            clause.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Understand your rights and obligations
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default How;
