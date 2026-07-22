"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import bornaPortrait from "@/app/assets/Borna.jpeg";

export default function About() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  const rise = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden border-y border-border bg-surface"
      aria-labelledby="about-heading"
    >
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" />

      <div className="container-wide relative">
        <div className="mb-12 flex items-center gap-5">
          <span className="mono-label">
            <span className="mint">//</span> 01 — About
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs lowercase text-faint">
            The maker
          </span>
        </div>

        <motion.h2
          id="about-heading"
          {...rise}
          className="max-w-4xl text-[2.7rem] font-semibold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-[4.2rem]"
        >
          Turning ideas into
          <span className="text-mint"> working systems.</span>
        </motion.h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-20">
          {/* portrait */}
          <motion.div
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                  transition: {
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                })}
            className="relative mx-auto w-full max-w-sm rotate-[-1.5deg] lg:mx-0"
          >
            <div className="rounded-xl border border-border bg-surface-2 p-3 shadow-[14px_16px_0_rgba(45,212,191,0.05)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-elevated">
                {imgError ? (
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-6xl text-mint">
                    BA
                  </span>
                ) : (
                  <Image
                    src={bornaPortrait}
                    alt="Borna B. Afraz"
                    fill
                    quality={90}
                    sizes="(max-width: 1024px) 384px, 34vw"
                    className="object-cover object-[center_28%] grayscale-[0.2] contrast-[1.04]"
                    onError={() => setImgError(true)}
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-[linear-gradient(to_top,rgba(10,10,11,1),rgba(10,10,11,0.7),transparent)] p-5 pt-16">
                  <div>
                    <p className="text-xl font-semibold leading-none text-foreground">
                      Borna B. Afraz
                    </p>
                    <p className="mt-1.5 font-mono text-xs text-mint">
                      Software Developer
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    N°01
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* body */}
          <motion.div
            {...(reduceMotion
              ? {}
              : { ...rise, transition: { ...rise.transition, delay: 0.12 } })}
            className="space-y-7 border-l border-border pl-6 text-base leading-8 text-muted-foreground sm:pl-8 sm:text-lg"
          >
            <p>
              I am a developer focused on building practical software using
              Python. My work includes machine learning experiments, game
              development, and small tools designed to solve real problems
              quickly.
            </p>
            <p>
              I enjoy turning ideas into working systems using algorithmic
              thinking and a rapid VibeCoding approach. My goal is to keep
              building projects that combine creativity, automation, and
              intelligent problem-solving.
            </p>

            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              {[
                { k: "Focus", v: "Python & ML" },
                { k: "Approach", v: "VibeCoding" },
                { k: "Craft", v: "Practical tools" },
              ].map(({ k, v }) => (
                <div key={k} className="rounded-lg border border-border bg-surface-2 p-4">
                  <p className="font-mono text-xs lowercase text-mint">
                    {k}
                  </p>
                  <p className="mt-2 text-base font-medium text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
