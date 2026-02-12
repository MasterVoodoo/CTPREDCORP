import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-accent text-white p-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 1 }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </motion.button>
  );
}