"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ORBS = [
  {
    size: 500,
    left: "10%",
    top: "15%",
    gradient:
      "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    x: [-50, 50, -50],
    y: [-30, 40, -30],
    scale: [1, 1.1, 1],
    duration: 28,
  },
  {
    size: 450,
    right: "5%",
    top: "35%",
    gradient:
      "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
    x: [40, -60, 40],
    y: [30, -20, 30],
    scale: [1, 1.08, 1],
    duration: 35,
  },
  {
    size: 400,
    left: "40%",
    bottom: "20%",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)",
    x: [-40, 30, -40],
    y: [-25, 35, -25],
    scale: [1, 1.12, 1],
    duration: 24,
  },
  {
    size: 350,
    left: "5%",
    bottom: "30%",
    gradient:
      "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
    x: [30, -50, 30],
    y: [-40, 20, -40],
    scale: [1, 1.06, 1],
    duration: 32,
  },
  {
    size: 380,
    right: "25%",
    bottom: "10%",
    gradient:
      "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)",
    x: [-60, 40, -60],
    y: [25, -35, 25],
    scale: [1, 1.09, 1],
    duration: 38,
  },
];

export default function AmbientBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {ORBS.map((orb, i) => {
        const style: React.CSSProperties = {
          width: orb.size,
          height: orb.size,
          background: orb.gradient,
          left: "left" in orb ? orb.left : undefined,
          right: "right" in orb ? orb.right : undefined,
          top: "top" in orb ? orb.top : undefined,
          bottom: "bottom" in orb ? orb.bottom : undefined,
        };

        if (reduceMotion) {
          return (
            <div
              key={i}
              className="absolute rounded-full blur-3xl opacity-[0.08]"
              style={style}
            />
          );
        }

        return (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-[0.1]"
            style={style}
            animate={{
              x: orb.x,
              y: orb.y,
              scale: orb.scale,
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
