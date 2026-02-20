"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

const latestProjectUrl = "https://www.loom.com/share/e0d66f81e0784b3896f6cb886a029657";
// If this project URL changes, update `latestProjectUrl`.

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen flex items-center justify-center pt-16 overflow-hidden",
        "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.08),transparent)]",
        "dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.05),transparent)]",
        "section-padding"
      )}
      aria-labelledby="hero-heading"
    >
      <div className="container-wide flex flex-col lg:flex-row items-start gap-12 lg:gap-14">
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className={cn(
              "text-[11px] uppercase tracking-widest text-gray-300 dark:text-indigo-300 mb-3"
            )}
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            PORTFOLIO
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-5">
            <div className="relative h-14 w-14 shrink-0 rounded-full border border-white/10 ring-2 ring-indigo-500/30 overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-[0_0_28px_rgba(99,102,241,0.28)]">
              {imgError ? (
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  BA
                </span>
              ) : (
                <Image
                  src="/profile.png"
                  alt="Borna B. Afraz"
                  fill
                  className="object-cover"
                  sizes="56px"
                  priority
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.3rem] font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              Borna B. Afraz
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-600 dark:text-neutral-400 mb-5 tracking-tight">
            Python Developer | Machine Learning • Game Development • Algorithms
          </p>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            High school developer building practical software with Python.
            Machine learning experiments, games, and tools that solve real
            problems. VibeCoding meets algorithmic thinking.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a
              href="#projects"
              className={cn(
                "inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium rounded-lg",
                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
                "hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950",
                "w-full sm:w-auto"
              )}
            >
              View Projects
              <ChevronDown className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#contact"
              className={cn(
                "inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium rounded-lg",
                "border-2 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950",
                "w-full sm:w-auto"
              )}
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className="w-full lg:w-auto lg:max-w-sm"
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-indigo-400/20 bg-white/55 dark:bg-neutral-900/55 backdrop-blur-xl shadow-xl shadow-indigo-900/10 dark:shadow-black/35 p-6">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(130deg,rgba(99,102,241,0.16),transparent_45%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-2">
                Latest
              </p>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Loveable.ai Growth Strategy
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
                A growth strategy focused on increasing Loveable.ai users.
              </p>
              <a
                href={latestProjectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
                  "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
                  "hover:opacity-90 transition-opacity",
                  "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                )}
              >
                <ExternalLink size={16} />
                Watch on Loom
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 rounded-full p-1"
        aria-label="Scroll to about"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={28} strokeWidth={2} />
        </motion.div>
      </motion.a>
    </section>
  );
}
