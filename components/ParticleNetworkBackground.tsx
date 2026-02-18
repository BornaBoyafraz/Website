"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Config constants ─────────────────────────────────────────────────────
// Tuned defaults:
// targetFps=40, dprCap=1.25, particles desktop/mobile=80/50, maxLinkDistance=140
const TARGET_FPS = 40;
const HIDDEN_TAB_FPS = 5;
const DPR_CAP = 1.25;
const PARTICLE_COUNT_DESKTOP = 80;
const PARTICLE_COUNT_MOBILE = 50;
const MAX_LINK_DISTANCE = 140;
const MAX_LINE_OPACITY = 0.38;
const SPEED_RANGE = { min: 0.2, max: 0.6 };
const DOT_RADIUS_RANGE = { min: 1.5, max: 2.5 };
const DOT_COLOR = "rgba(99, 102, 241, 0.8)";
const DOT_GLOW_BLUR = 0;
const DOT_GLOW_COLOR = "rgba(99, 102, 241, 0.6)";
const LINE_COLOR_RGB = "99, 102, 241";
const POINTER_LINK_DISTANCE = 220;
const POINTER_LINE_OPACITY_MAX = 0.35;
const POINTER_INFLUENCE = 0.018;
const DIRECTION_WIGGLE = 0.02;
const BOOT_DURATION_MS = 1300;
const BOOT_LERP_FACTOR = 0.08;
const BOOT_RADIUS_SCALE_START = 0.4;

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
};

function createParticles(
  count: number,
  width: number,
  height: number,
  startCentered: boolean
): Particle[] {
  const centerX = width / 2;
  const centerY = height / 2;
  return Array.from({ length: count }, () => {
    const speed =
      SPEED_RANGE.min +
      Math.random() * (SPEED_RANGE.max - SPEED_RANGE.min);
    const angle = Math.random() * Math.PI * 2;
    const targetX = Math.random() * width;
    const targetY = Math.random() * height;
    return {
      x: startCentered ? centerX : targetX,
      y: startCentered ? centerY : targetY,
      targetX,
      targetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius:
        DOT_RADIUS_RANGE.min +
        Math.random() * (DOT_RADIUS_RANGE.max - DOT_RADIUS_RANGE.min),
    };
  });
}

function buildSpatialGrid(
  particles: Particle[],
  cellSize: number
): Map<string, number[]> {
  const grid = new Map<string, number[]>();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const cellX = Math.floor(p.x / cellSize);
    const cellY = Math.floor(p.y / cellSize);
    const key = `${cellX},${cellY}`;
    const bucket = grid.get(key);
    if (bucket) {
      bucket.push(i);
    } else {
      grid.set(key, [i]);
    }
  }
  return grid;
}

function drawParticleLinks(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  lineOpacityFactor: number
) {
  // Spatial hashing keeps link checks local instead of O(N^2) across all particles.
  const cellSize = MAX_LINK_DISTANCE;
  const maxDistSq = MAX_LINK_DISTANCE * MAX_LINK_DISTANCE;
  const grid = buildSpatialGrid(particles, cellSize);
  ctx.lineWidth = 1;

  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    const cellX = Math.floor(a.x / cellSize);
    const cellY = Math.floor(a.y / cellSize);

    for (let offsetY = -1; offsetY <= 1; offsetY++) {
      for (let offsetX = -1; offsetX <= 1; offsetX++) {
        const key = `${cellX + offsetX},${cellY + offsetY}`;
        const bucket = grid.get(key);
        if (!bucket) continue;

        for (const j of bucket) {
          if (j <= i) continue;
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= maxDistSq) continue;

          const dist = Math.sqrt(distSq);
          const alpha =
            MAX_LINE_OPACITY *
            (1 - dist / MAX_LINK_DISTANCE) *
            lineOpacityFactor;
          if (alpha <= 0) continue;

          ctx.strokeStyle = `rgba(${LINE_COLOR_RGB}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }
}

export default function ParticleNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const isBootingRef = useRef(true);
  const hasBootedRef = useRef(false);
  const bootStartTimeRef = useRef<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const initParticles = useCallback(
    (width: number, height: number, startCentered: boolean) => {
      const isMobile = width < 768;
      const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

      particlesRef.current = createParticles(count, width, height, startCentered);
      isBootingRef.current = startCentered;
      bootStartTimeRef.current = startCentered ? performance.now() : null;
    },
    []
  );

  useEffect(() => {
    if (reduceMotion) {
      isBootingRef.current = false;
      bootStartTimeRef.current = null;
    } else if (!hasBootedRef.current) {
      isBootingRef.current = true;
    }
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastFrameTime = 0;

    const resize = () => {
      // Cap DPR to avoid oversampling on high-density screens.
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles(width, height, !hasBootedRef.current);
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerLeave = () => {
      pointerRef.current = null;
    };

    const handleVisibilityChange = () => {
      // Reset limiter so the first foreground frame renders immediately.
      if (document.visibilityState === "visible") {
        lastFrameTime = 0;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = (now: number) => {
      if (reduceMotion) return;

      // Frame limiter: 40fps normally, 5fps while tab is hidden.
      const currentTargetFps =
        document.visibilityState === "hidden" ? HIDDEN_TAB_FPS : TARGET_FPS;
      const frameInterval = 1000 / currentTargetFps;
      if (now - lastFrameTime < frameInterval) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);
      // Use default compositing and no line glow to avoid expensive blending.
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;

      const particles = particlesRef.current;
      const pointer = pointerRef.current;
      let isBooting = isBootingRef.current;
      let bootProgress = 1;

      if (isBooting && bootStartTimeRef.current !== null) {
        const elapsed = now - bootStartTimeRef.current;
        bootProgress = Math.min(elapsed / BOOT_DURATION_MS, 1);
      }

      if (isBooting) {
        let allNearTargets = true;
        for (const p of particles) {
          p.x += (p.targetX - p.x) * BOOT_LERP_FACTOR;
          p.y += (p.targetY - p.y) * BOOT_LERP_FACTOR;
          if (
            Math.abs(p.targetX - p.x) > 1 ||
            Math.abs(p.targetY - p.y) > 1
          ) {
            allNearTargets = false;
          }
        }

        if (bootProgress >= 1 || allNearTargets) {
          isBooting = false;
          isBootingRef.current = false;
          hasBootedRef.current = true;
          bootStartTimeRef.current = null;
          bootProgress = 1;
          for (const p of particles) {
            p.x = p.targetX;
            p.y = p.targetY;
          }
        }
      } else {
        // Update and bounce particles with slight direction randomness
        for (const p of particles) {
          p.vx += (Math.random() - 0.5) * DIRECTION_WIGGLE;
          p.vy += (Math.random() - 0.5) * DIRECTION_WIGGLE;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) {
            p.x = 0;
            p.vx = Math.abs(p.vx);
          }
          if (p.x > width) {
            p.x = width;
            p.vx = -Math.abs(p.vx);
          }
          if (p.y < 0) {
            p.y = 0;
            p.vy = Math.abs(p.vy);
          }
          if (p.y > height) {
            p.y = height;
            p.vy = -Math.abs(p.vy);
          }

          // Subtle pointer attraction
          if (pointer) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 220 && dist > 0) {
              p.vx += (dx / dist) * POINTER_INFLUENCE;
              p.vy += (dy / dist) * POINTER_INFLUENCE;
            }
          }
        }
      }

      const lineOpacityFactor = isBooting ? bootProgress : 1;
      const radiusScale = isBooting
        ? BOOT_RADIUS_SCALE_START +
          (1 - BOOT_RADIUS_SCALE_START) * bootProgress
        : 1;

      drawParticleLinks(ctx, particles, lineOpacityFactor);

      // Draw brighter pointer-to-particle connections when mouse is present
      if (pointer && !isBooting) {
        for (const p of particles) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < POINTER_LINK_DISTANCE) {
            const alpha =
              POINTER_LINE_OPACITY_MAX * (1 - dist / POINTER_LINK_DISTANCE);
            ctx.strokeStyle = `rgba(${LINE_COLOR_RGB}, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      // Particle glow is disabled/capped for performance.
      if (DOT_GLOW_BLUR > 0) {
        ctx.shadowBlur = DOT_GLOW_BLUR;
        ctx.shadowColor = DOT_GLOW_COLOR;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = DOT_COLOR;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * radiusScale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion, initParticles]);

  // Static frame when reduced motion
  useEffect(() => {
    if (!reduceMotion) return;

    const drawStatic = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const isMobile = width < 768;
      const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      const particles = createParticles(count, width, height, false);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
      drawParticleLinks(ctx, particles, 0.75);

      if (DOT_GLOW_BLUR > 0) {
        ctx.shadowBlur = DOT_GLOW_BLUR;
        ctx.shadowColor = DOT_GLOW_COLOR;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = DOT_COLOR;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    drawStatic();
    window.addEventListener("resize", drawStatic);
    return () => window.removeEventListener("resize", drawStatic);
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
