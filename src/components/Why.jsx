"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Eye, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Why() {
  return (
    <section className="w-full bg-black text-white py-16">
      {/* Section Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Designed for everyone who needs to understand complex concepts with clarity,
          security, and confidence.
        </p>
      </motion.div>

      {/* Card Container */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <CardSpotlight className="h-80 w-80 flex flex-col items-center justify-center">
            <Eye size={80} className="text-white" />
            <p className="text-xl font-bold mt-4 text-white">Clarity</p>
            <p className="text-neutral-300 text-center mt-4 text-sm px-4">
              Transform complex language into clear, understandable explanations
              you can trust — no jargon, just straight answers.
            </p>
          </CardSpotlight>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <CardSpotlight className="h-80 w-80 flex flex-col items-center justify-center">
            <ShieldCheck size={80} className="text-white" />
            <p className="text-xl font-bold mt-4 text-white">Security</p>
            <p className="text-neutral-300 text-center mt-4 text-sm px-4">
              Your data is processed securely and never stored. Privacy and
              protection are built-in at every step.
            </p>
          </CardSpotlight>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <CardSpotlight className="h-80 w-80 flex flex-col items-center justify-center">
            <Zap size={80} className="text-white" />
            <p className="text-xl font-bold mt-4 text-white">Empowerment</p>
            <p className="text-neutral-300 text-center mt-4 text-sm px-4">
              Make confident decisions with a clear understanding of your
              rights and responsibilities. Knowledge is power.
            </p>
          </CardSpotlight>
        </motion.div>
      </div>
    </section>
  );
}
