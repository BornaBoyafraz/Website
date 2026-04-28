"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Config constants ─────────────────────────────────────────────────────
// Tuned defaults:
// Desktop keeps the full ambient network; mobile uses a lighter canvas budget.
const TARGET_FPS_DESKTOP = 40;
const TARGET_FPS_MOBILE = 24;
const HIDDEN_TAB_FPS = 5;
const DPR_CAP_DESKTOP = 1.25;
const DPR_CAP_MOBILE = 1;
const MOBILE_BREAKPOINT = 768;
const PARTICLE_COUNT_DESKTOP = 80;
const PARTICLE_COUNT_MOBILE = 25;
const MAX_LINK_DISTANCE_DESKTOP = 140;
const MAX_LINK_DISTANCE_MOBILE = 90;
const SPEED_RANGE = { min: 0.2, max: 0.6 };
const DOT_RADIUS_RANGE = { min: 1.5, max: 2.5 };
const DOT_GLOW_BLUR = 0;
const POINTER_LINK_DISTANCE_DESKTOP = 220;
const POINTER_INFLUENCE = 0.018;
const DIRECTION_WIGGLE = 0.02;
const BOOT_DURATION_MS = 1300;
const BOOT_LERP_FACTOR = 0.08;
const BOOT_RADIUS_SCALE_START = 0.4;

type ParticleColorMode = "light" | "dark";

type ParticlePalette = {
  dotColor: string;
  dotGlowColor: string;
  lineRgb: string;
  maxLineOpacity: number;
  pointerLineOpacityMax: number;
};

type ParticleSceneConfig = {
  count: number;
  dprCap: number;
  maxLinkDistance: number;
  pointerLinkDistance: number;
  targetFps: number;
  pointerEnabled: boolean;
};

const PARTICLE_PALETTES = {
  light: {
    dotColor: "rgba(245, 158, 11, 0.55)",
    dotGlowColor: "rgba(245, 158, 11, 0.35)",
    lineRgb: "217, 119, 6",
    maxLineOpacity: 0.18,
    pointerLineOpacityMax: 0.22,
  },
  dark: {
    dotColor: "rgba(251, 191, 36, 0.70)",
    dotGlowColor: "rgba(251, 191, 36, 0.42)",
    lineRgb: "245, 158, 11",
    maxLineOpacity: 0.28,
    pointerLineOpacityMax: 0.30,
  },
} satisfies Record<ParticleColorMode, ParticlePalette>;

function getParticleColorMode(): ParticleColorMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getParticleSceneConfig(width: number): ParticleSceneConfig {
  const isMobile = width < MOBILE_BREAKPOINT;

  return {
    count: isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP,
    dprCap: isMobile ? DPR_CAP_MOBILE : DPR_CAP_DESKTOP,
    maxLinkDistance: isMobile
      ? MAX_LINK_DISTANCE_MOBILE
      : MAX_LINK_DISTANCE_DESKTOP,
    pointerLinkDistance: isMobile ? 0 : POINTER_LINK_DISTANCE_DESKTOP,
    targetFps: isMobile ? TARGET_FPS_MOBILE : TARGET_FPS_DESKTOP,
    pointerEnabled: !isMobile,
  };
}

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
  lineOpacityFactor: number,
  palette: ParticlePalette,
  maxLinkDistance: number
) {
  // Spatial hashing keeps link checks local instead of O(N^2) across all particles.
  const cellSize = maxLinkDistance;
  const maxDistSq = maxLinkDistance * maxLinkDistance;
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
            palette.maxLineOpacity *
            (1 - dist / maxLinkDistance) *
            lineOpacityFactor;
          if (alpha <= 0) continue;

          ctx.strokeStyle = `rgba(${palette.lineRgb}, ${alpha})`;
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
  const paletteRef = useRef<ParticlePalette>(PARTICLE_PALETTES.light);
  const isBootingRef = useRef(true);
  const hasBootedRef = useRef(false);
  const bootStartTimeRef = useRef<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [colorMode, setColorMode] = useState<ParticleColorMode>("light");

  useEffect(() => {
    const syncPalette = () => {
      const nextMode = getParticleColorMode();
      paletteRef.current = PARTICLE_PALETTES[nextMode];
      setColorMode(nextMode);
    };

    syncPalette();

    const observer = new MutationObserver(syncPalette);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const initParticles = useCallback(
    (width: number, height: number, startCentered: boolean) => {
      const { count } = getParticleSceneConfig(width);

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
    let sceneConfig = getParticleSceneConfig(window.innerWidth);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      sceneConfig = getParticleSceneConfig(width);
      // Cap DPR to avoid oversampling on high-density screens.
      dpr = Math.min(window.devicePixelRatio || 1, sceneConfig.dprCap);
      if (!sceneConfig.pointerEnabled) {
        pointerRef.current = null;
      }

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles(width, height, !hasBootedRef.current);
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      if (!sceneConfig.pointerEnabled) return;
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

      // Frame limiter: desktop/mobile budgets, 5fps while tab is hidden.
      const currentTargetFps =
        document.visibilityState === "hidden"
          ? HIDDEN_TAB_FPS
          : sceneConfig.targetFps;
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
          if (pointer && sceneConfig.pointerEnabled) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < sceneConfig.pointerLinkDistance && dist > 0) {
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

      const palette = paletteRef.current;

      drawParticleLinks(
        ctx,
        particles,
        lineOpacityFactor,
        palette,
        sceneConfig.maxLinkDistance
      );

      // Draw brighter pointer-to-particle connections when mouse is present
      if (pointer && sceneConfig.pointerEnabled && !isBooting) {
        for (const p of particles) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < sceneConfig.pointerLinkDistance) {
            const alpha =
              palette.pointerLineOpacityMax *
              (1 - dist / sceneConfig.pointerLinkDistance);
            ctx.strokeStyle = `rgba(${palette.lineRgb}, ${alpha})`;
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
        ctx.shadowColor = palette.dotGlowColor;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = palette.dotColor;
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

      const width = window.innerWidth;
      const height = window.innerHeight;
      const sceneConfig = getParticleSceneConfig(width);
      const dpr = Math.min(window.devicePixelRatio || 1, sceneConfig.dprCap);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const particles = createParticles(sceneConfig.count, width, height, false);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
      const palette = paletteRef.current;
      drawParticleLinks(
        ctx,
        particles,
        0.75,
        palette,
        sceneConfig.maxLinkDistance
      );

      if (DOT_GLOW_BLUR > 0) {
        ctx.shadowBlur = DOT_GLOW_BLUR;
        ctx.shadowColor = palette.dotGlowColor;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = palette.dotColor;
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
  }, [reduceMotion, colorMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
