"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export default function About() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  return (
    <section
      id="about"
      className="section-padding bg-white dark:bg-neutral-900/50"
      aria-labelledby="about-heading"
    >
      <div className="container-narrow">
        <motion.h2
          id="about-heading"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        <motion.div
          className={cn(
            "text-neutral-600 dark:text-neutral-400 text-base sm:text-lg",
            "leading-relaxed space-y-6"
          )}
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>
            I am a high school developer focused on building practical software
            using Python. My work includes machine learning experiments, game
            development, and small tools designed to solve real problems
            quickly.
          </p>
          <p>
            I enjoy turning ideas into working systems using algorithmic
            thinking and a rapid VibeCoding approach. My goal is to keep
            building projects that combine creativity, automation, and
            intelligent problem-solving.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
