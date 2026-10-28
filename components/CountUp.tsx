"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  durationMs?: number;
  className?: string;
  /** Formats the displayed integer (e.g. compact "1.2k"). */
  format?: (value: number) => string;
}

/**
 * Counts from 0 up to `value` once it scrolls into view. Honors
 * prefers-reduced-motion by rendering the final value immediately.
 */
export default function CountUp({
  value,
  durationMs = 1200,
  className,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {format ? format(display) : display}
    </span>
  );
}
