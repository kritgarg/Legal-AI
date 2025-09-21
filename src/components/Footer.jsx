import React from "react";

const Footer = () => {
  return (
    <footer className="w-full h-[200px] md:h-[200px] sm:h-[600px] bg-black flex items-center justify-center">
      <div className="w-[90%] h-[80%] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl flex flex-col md:flex-row justify-between items-center p-10 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0px_20px_60px_rgba(255,255,255,0.15)]">
        
        {/* Left Section - Brand */}
        <div className="text-left max-w-md">
          <h2 className="text-4xl font-bold text-white">LegalEase AI</h2>
          <p className="text-neutral-300 text-lg mt-5">
            Making legal documents understandable for everyone.
          </p>
        </div>

        {/* Right Section - Links */}
        <div className="flex gap-10 mt-8 md:mt-0">
          <a
            href="/privacy"
            className="text-neutral-300 text-lg hover:text-white transition-all duration-300 hover:translate-y-[-4px] hover:scale-110"
          >
            Privacy
          </a>
          <a
            href="/chat"
            className="text-neutral-300 text-lg hover:text-white transition-all duration-300 hover:translate-y-[-4px] hover:scale-110"
          >
            Chat
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
