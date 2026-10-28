"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin gradient bar pinned to the very top of the viewport that fills as the
 * page scrolls. Sits above the navbar so it reads as a global reading-progress
 * indicator.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[linear-gradient(90deg,#2dd4bf_0%,#38bdf8_45%,#a78bfa_80%,#f472b6_100%)]"
    />
  );
}
