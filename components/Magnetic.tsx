"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  /** How far the element leans toward the cursor (px at the edge). */
  strength?: number;
  className?: string;
}

/**
 * Wraps an interactive element so it gently leans toward the cursor while
 * hovered, then springs back. Disabled under prefers-reduced-motion and on
 * touch / coarse pointers.
 */
export default function Magnetic({
  children,
  strength = 14,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(!reduced && fine);
  }, []);

  const handleMove = (event: ReactMouseEvent<HTMLSpanElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
