"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import BeforeAfterCard from "./BeforeAfterCard";
import { ArrowUpRight,FileText  } from 'lucide-react';

export function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      {/* Outer wrapper to control vertical stacking */}
      <div className="flex flex-col items-center justify-center space-y-16   mt-90 md:mt-70 lg:mt-80 ">
        
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Easily understand complex legal documents explained{" "}
          <Highlight className="text-black dark:text-white">
            in simple, clear language.
          </Highlight>
        </motion.h1>

        {/* Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="flex flex-row items-center justify-center gap-4"
        >
           <a href="/chat" className="no-underline">
          <HoverBorderGradient >
            <span className="flex items-center gap-2 text-white" >Try Demo
            <ArrowUpRight color="white" size={20} />
            </span>
          </HoverBorderGradient>
          </a>
          <div>

          <a href="/privacy" className="no-underline">
            <HoverBorderGradient>
              <span className="flex items-center gap-2 text-white">Learn More <FileText color="white" size={20} /></span>
            </HoverBorderGradient>
          </a>
          </div>
        </motion.div>

        {/* Before/After Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <BeforeAfterCard />
        </motion.div>
      </div>
    </HeroHighlight>
  );
}
