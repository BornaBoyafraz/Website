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
      className="section-padding relative bg-transparent"
      aria-labelledby="about-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border" />
      <div className="container-narrow relative">
        <div className="mb-8 h-1 w-28 timber-rule" />
        <motion.h2
          id="about-heading"
          className="mb-8 font-serif text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        <motion.div
          className={cn(
            "border-l-4 border-primary pl-6 text-base text-muted-foreground sm:text-lg",
            "space-y-6 leading-relaxed"
          )}
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>
            I am a developer focused on building practical software
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
