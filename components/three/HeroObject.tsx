"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

const MINT = "#2dd4bf";
const VIOLET = "#a78bfa";
const SKY = "#7dd3fc";

// rgb triplets (0..1) for per-point colors
const PALETTE: Array<[number, number, number]> = [
  [0.176, 0.831, 0.749], // mint
  [0.22, 0.741, 0.972], // sky
  [0.655, 0.545, 0.98], // violet
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function PointCloud() {
  const { positions, colors } = useMemo(() => {
    const n = 300;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.55 + Math.random() * 0.55;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = PALETTE[i % PALETTE.length];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    return { positions, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

function Network({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  const spin = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reduced) spin.current += delta * 0.18;
    const px = state.pointer.x;
    const py = state.pointer.y;
    group.current.rotation.y +=
      (spin.current + px * 0.45 - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-py * 0.3 - group.current.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      {/* outer wireframe cage — mint */}
      <mesh>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color={MINT} wireframe transparent opacity={0.38} />
      </mesh>
      {/* inner wireframe — violet */}
      <mesh rotation={[0.5, 0.3, 0]}>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.6} />
      </mesh>
      {/* glowing core — sky */}
      <mesh>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshBasicMaterial color={SKY} />
      </mesh>
      <PointCloud />
    </group>
  );
}

export default function HeroObject() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? "demand" : "always"}
      style={{ background: "transparent" }}
    >
      <Network reduced={reduced} />
    </Canvas>
  );
}
