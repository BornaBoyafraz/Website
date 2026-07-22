"use client";

import { useState, useEffect, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);

    syncMotion();
    mq.addEventListener("change", syncMotion);

    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#home"
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full sm:bottom-8 sm:right-8",
            "border border-border bg-surface text-mint backdrop-blur-md",
            "transition-colors hover:border-mint hover:bg-mint hover:text-[#05231d]",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
          )}
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
          }
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
