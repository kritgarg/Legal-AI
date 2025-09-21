"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye } from "lucide-react";

export default function Privacy() {
  const policies = [
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "No Document Storage",
      desc: "We do not store, save, or retain any documents you upload. Your documents are processed in real-time and immediately discarded after analysis, keeping your data safe and private.",
    },
    {
      icon: <Lock className="w-8 h-8 text-white" />,
      title: "Secure Processing",
      desc: "All document processing happens securely using enterprise-grade infrastructure. Your documents are encrypted in transit and processed with industry-standard security protocols.",
    },
    {
      icon: <Eye className="w-8 h-8 text-white" />,
      title: "Data Privacy",
      desc: "Your data is completely private and never used for training AI models. We do not share or sell your information. Everything stays confidential and handled with care.",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-black text-white py-20 px-6 flex flex-col items-center">
      {/* Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">Privacy Policy</h2>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Your privacy and security are our top priorities.
        </p>
      </motion.div>

      {/* Policy Cards */}
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        {policies.map((policy, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-xl">{policy.icon}</div>
              <h3 className="text-xl font-semibold">{policy.title}</h3>
            </div>
            <p className="text-neutral-300">{policy.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Contact Section */}
      <motion.div
        className="mt-12 text-center p-6 rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 shadow-lg max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h4 className="text-lg font-semibold text-white">
          Questions About Privacy?
        </h4>
        <p className="text-neutral-400 mt-2">
          If you have any questions about our privacy practices or how we handle
          your data, we're here to help.
        </p>
        <motion.a
          href="#"
          className="mt-4 inline-block text-white font-semibold border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          Contact Us
        </motion.a>
      </motion.div>
    </section>
  );
}
