"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AlwaysMovingBackground() {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const syncPreferences = () => {
      setReduceMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
      setMounted(true);
    };

    syncPreferences();
    motionQuery.addEventListener("change", syncPreferences);
    mobileQuery.addEventListener("change", syncPreferences);

    return () => {
      motionQuery.removeEventListener("change", syncPreferences);
      mobileQuery.removeEventListener("change", syncPreferences);
    };
  }, []);

  if (!mounted || reduceMotion || isMobile) return null;

  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Large gradient orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.25] blur-3xl"
        style={{
          left: "20%",
          top: "20%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.28) 0%, rgba(217,119,6,0.14) 50%, transparent 70%)",
        }}
        animate={
          reduceMotion
            ? {}
            : {
                x: [0, 260, 0],
                y: [0, 180, 0],
                scale: [1, 1.15, 1],
              }
        }
        transition={
          reduceMotion
            ? {}
            : {
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />

      {/* Car A: left -> right */}
      <motion.div
        className="absolute top-[40%] w-24 h-8 rounded-full opacity-[0.18] bg-gradient-to-r from-amber-500 to-orange-600"
        style={{ left: 0 }}
        animate={
          reduceMotion
            ? {}
            : {
                x: ["-20vw", "120vw"],
                rotate: [-2, 2, -2],
              }
        }
        transition={
          reduceMotion
            ? {}
            : {
                x: { duration: 8, repeat: Infinity, ease: "linear" },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }
        }
      />

      {/* Car B: right -> left */}
      <motion.div
        className="absolute top-[55%] left-0 w-20 h-7 rounded-full opacity-[0.18] bg-gradient-to-r from-orange-600 to-amber-500"
        animate={
          reduceMotion
            ? {}
            : {
                x: ["120vw", "-20vw"],
                rotate: [2, -2, 2],
              }
        }
        transition={
          reduceMotion
            ? {}
            : {
                x: { duration: 9, repeat: Infinity, ease: "linear" },
                rotate: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              }
        }
      />
    </div>
  );
}
