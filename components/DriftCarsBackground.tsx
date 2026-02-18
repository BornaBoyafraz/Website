"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

type Params = {
  orbitRadiusVw: number;
  orbitCenterX: number;
  orbitCenterY: number;
  phase1Duration: number;
  phase2Duration: number;
  phase3Duration: number;
  phase4Duration: number;
  pauseDuration: number;
  tiltAmount: number;
};

function getRandomParams(): Params {
  return {
    orbitRadiusVw: 5 + Math.random() * 5,
    orbitCenterX: 50 + (Math.random() - 0.5) * 10,
    orbitCenterY: 50 + (Math.random() - 0.5) * 5,
    phase1Duration: 2 + Math.random() * 2,
    phase2Duration: 4 + Math.random() * 4,
    phase3Duration: 2 + Math.random() * 2,
    phase4Duration: 2 + Math.random() * 2,
    pauseDuration: 0.5 + Math.random() * 1,
    tiltAmount: 3 + Math.random() * 6,
  };
}

function circlePoints(
  cx: number,
  cy: number,
  r: number,
  steps: number,
  startAngle: number,
  direction: 1 | -1
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + direction * (i / steps) * Math.PI * 2;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }
  return points;
}

const CarASvg = () => (
  <svg
    width="48"
    height="24"
    viewBox="0 0 48 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 14 L8 14 L10 18 L38 18 L40 14 L44 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M12 14 L14 10 L34 10 L36 14" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="14" cy="18" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="34" cy="18" r="2" fill="currentColor" opacity="0.8" />
  </svg>
);

const CarBSvg = () => (
  <svg
    width="48"
    height="24"
    viewBox="0 0 48 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M44 14 L40 14 L38 18 L10 18 L8 14 L4 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M36 14 L34 10 L14 10 L12 14" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="34" cy="18" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="14" cy="18" r="2" fill="currentColor" opacity="0.8" />
  </svg>
);

export default function DriftCarsBackground() {
  const [reduceMotion, setReduceMotion] = useState(true);
  const [params, setParams] = useState<Params | null>(null);
  const [loopKey, setLoopKey] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    setParams(getRandomParams());
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { carAKeyframes, carBKeyframes } = useMemo(() => {
    if (!params) return { carAKeyframes: null, carBKeyframes: null };

    const r = params.orbitRadiusVw;
    const cx = params.orbitCenterX;
    const cy = params.orbitCenterY;
    const steps = 16;

    const t1 = params.phase1Duration;
    const t2 = params.phase2Duration;
    const t3 = params.phase3Duration;
    const t4 = params.phase4Duration;
    const total = t1 + t2 + t3 + t4 + params.pauseDuration;
    const animDuration = total - params.pauseDuration;

    const p1End = t1 / total;
    const p2End = (t1 + t2) / total;
    const p3End = (t1 + t2 + t3) / total;
    const p4End = (t1 + t2 + t3 + t4) / total;

    const orbitA = circlePoints(cx, cy, r, steps, Math.PI, 1);
    const orbitB = circlePoints(cx, cy, r, steps, 0, -1);

    const xA: string[] = ["-20vw", `${cx - r}vw`];
    const yA: string[] = ["50vh", "50vh"];
    const rotA: number[] = [0, 0];
    const timesA: number[] = [0, p1End];

    for (let i = 1; i <= steps; i++) {
      xA.push(`${orbitA[i].x}vw`);
      yA.push(`${orbitA[i].y}vh`);
      rotA.push((i / steps) * 360 + (Math.random() - 0.5) * params.tiltAmount);
      timesA.push(p1End + (p2End - p1End) * (i / steps));
    }
    xA.push(`${cx - r}vw`, "120vw");
    yA.push("50vh", "50vh");
    rotA.push(0, 0);
    timesA.push(p2End, p3End, p4End);

    const xB: string[] = ["120vw", `${cx + r}vw`];
    const yB: string[] = ["50vh", "50vh"];
    const rotB: number[] = [0, 0];
    const timesB: number[] = [0, p1End];

    for (let i = 1; i <= steps; i++) {
      xB.push(`${orbitB[i].x}vw`);
      yB.push(`${orbitB[i].y}vh`);
      rotB.push(-(i / steps) * 360 + (Math.random() - 0.5) * params.tiltAmount);
      timesB.push(p1End + (p2End - p1End) * (i / steps));
    }
    xB.push(`${cx + r}vw`, "-20vw");
    yB.push("50vh", "50vh");
    rotB.push(0, 0);
    timesB.push(p2End, p3End, p4End);

    return {
      carAKeyframes: {
        x: xA,
        y: yA,
        rotate: rotA,
        duration: animDuration,
        times: timesA,
      },
      carBKeyframes: {
        x: xB,
        y: yB,
        rotate: rotB,
        duration: animDuration,
        times: timesB,
      },
    };
  }, [params]);

  const handleComplete = () => {
    setParams(getRandomParams());
    setLoopKey((k) => k + 1);
  };

  if (reduceMotion || !params || !carAKeyframes || !carBKeyframes) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <motion.div
        key={`carA-${loopKey}`}
        className="absolute top-1/2 left-0 w-12 h-6 -mt-3 -ml-6 opacity-[0.16] dark:opacity-[0.10] text-neutral-600 dark:text-neutral-500"
        initial={{ x: "-20vw", y: "50vh", rotate: 0 }}
        animate={{
          x: carAKeyframes.x,
          y: carAKeyframes.y,
          rotate: carAKeyframes.rotate,
        }}
        transition={{
          duration: carAKeyframes.duration,
          times: carAKeyframes.times,
          ease: "easeInOut",
        }}
        onAnimationComplete={handleComplete}
      >
        <CarASvg />
      </motion.div>

      <motion.div
        key={`carB-${loopKey}`}
        className="absolute top-1/2 left-0 w-12 h-6 -mt-3 -ml-6 opacity-[0.16] dark:opacity-[0.10] text-neutral-500 dark:text-neutral-600"
        initial={{ x: "120vw", y: "50vh", rotate: 0 }}
        animate={{
          x: carBKeyframes.x,
          y: carBKeyframes.y,
          rotate: carBKeyframes.rotate,
        }}
        transition={{
          duration: carBKeyframes.duration,
          times: carBKeyframes.times,
          ease: "easeInOut",
        }}
      >
        <CarBSvg />
      </motion.div>
    </div>
  );
}
