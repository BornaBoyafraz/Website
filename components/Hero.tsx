"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Github } from "lucide-react";
import { cn } from "@/lib/cn";
import { CURRENT_WORKING_ON } from "@/lib/workingOn";
import bornaPortrait from "@/app/assets/Borna.jpeg";

type HeroProjectSpotlight = {
  label: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

const latestProject: HeroProjectSpotlight = {
  label: "Latest",
  title: "DebtGuard",
  description:
    "AI-assisted debt decision app that helps users assess financial risk and run what-if scenarios before borrowing.",
  href: "https://github.com/BornaBoyafraz/DebtGuard",
  ctaLabel: "View on GitHub",
};

const coinSpinStyle: CSSProperties = {
  animation: "hero-profile-coin-spin 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
};

const workingOnProject: HeroProjectSpotlight | null = CURRENT_WORKING_ON.enabled
  ? {
      label: "Working On",
      title: CURRENT_WORKING_ON.title,
      description: CURRENT_WORKING_ON.description,
      href: CURRENT_WORKING_ON.githubUrl,
      ctaLabel: "Source Code",
    }
  : null;

function HeroProjectCard({ project }: { project: HeroProjectSpotlight }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-indigo-400/20 bg-white/55 dark:bg-neutral-900/55 p-6 shadow-xl shadow-indigo-900/10 backdrop-blur-xl dark:shadow-black/35">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(130deg,rgba(99,102,241,0.16),transparent_45%)]" />
      <div className="relative">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          {project.label}
        </p>
        <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">
          {project.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {project.description}
        </p>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
            "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
            "hover:opacity-90 transition-opacity",
            "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          )}
        >
          <Github size={16} />
          {project.ctaLabel}
        </a>
      </div>
    </div>
  );
}

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinVersion, setSpinVersion] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const handleProfileClick = () => {
    if (reduceMotion) return;
    setSpinVersion((current) => current + 1);
    setIsSpinning(true);
  };

  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen flex items-center justify-center pt-16 overflow-hidden",
        "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.08),transparent)]",
        "dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.05),transparent)]",
        "section-padding"
      )}
      aria-labelledby="hero-heading"
    >
      <div className="container-wide flex flex-col lg:flex-row items-start gap-12 lg:gap-14">
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className={cn(
              "text-[11px] uppercase tracking-widest text-gray-300 dark:text-indigo-300 mb-3"
            )}
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            PORTFOLIO
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-5">
            <button
              type="button"
              onClick={handleProfileClick}
              className={cn(
                "group relative shrink-0 rounded-full",
                "focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
              )}
              aria-label="Spin the Borna profile coin"
            >
              <div className="relative h-[5.25rem] w-[5.25rem] sm:h-[5.5rem] sm:w-[5.5rem] [perspective:1200px]">
                <div
                  key={spinVersion}
                  className="relative h-full w-full rounded-full [transform-style:preserve-3d] [will-change:transform]"
                  style={isSpinning ? coinSpinStyle : undefined}
                  onAnimationEnd={() => setIsSpinning(false)}
                >
                  <div
                    className={cn(
                      "absolute inset-0 overflow-hidden rounded-full border border-white/10 ring-2 ring-indigo-500/30 bg-neutral-200 dark:bg-neutral-800 shadow-[0_0_28px_rgba(99,102,241,0.28)]",
                      "[backface-visibility:hidden]"
                    )}
                  >
                    {imgError ? (
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                        BA
                      </span>
                    ) : (
                      <Image
                        src={bornaPortrait}
                        alt="Borna B. Afraz"
                        fill
                        quality={100}
                        className="object-cover object-[center_32%]"
                        sizes="(min-width: 640px) 88px, 84px"
                        priority
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full border border-white/10 ring-2 ring-indigo-500/30 shadow-[0_0_28px_rgba(99,102,241,0.28)]",
                      "bg-[radial-gradient(circle_at_30%_28%,rgba(255,250,214,0.98)_0%,rgba(245,198,77,0.96)_34%,rgba(194,124,18,0.94)_72%,rgba(110,59,9,0.98)_100%)]",
                      "[backface-visibility:hidden] [transform:rotateY(180deg)]"
                    )}
                  >
                    <span className="absolute inset-[12%] rounded-full border border-white/35" />
                    <span className="absolute inset-[22%] rounded-full border border-amber-950/15" />
                    <span className="absolute inset-0 rounded-full bg-[linear-gradient(140deg,rgba(255,255,255,0.62),transparent_34%,rgba(120,53,15,0.18)_74%,rgba(255,255,255,0.16)_100%)]" />
                    <span className="absolute left-[16%] top-[14%] h-[22%] w-[42%] rounded-full bg-white/30 blur-[7px]" />
                    <span className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(255,255,255,0.35),inset_0_-10px_14px_rgba(120,53,15,0.3)] rounded-full" />
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-black tracking-normal text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.45)] sm:text-2xl">
                      BA
                    </span>
                  </div>
                </div>
              </div>
            </button>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.3rem] font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              Borna B. Afraz
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-neutral-600 dark:text-neutral-400 mb-5 tracking-tight">
            Python Developer | Machine Learning • Game Development • Algorithms
          </p>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            High school developer building practical software with Python.
            Machine learning experiments, games, and tools that solve real
            problems. VibeCoding meets algorithmic thinking.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a
              href="#projects"
              className={cn(
                "inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium rounded-lg",
                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
                "hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950",
                "w-full sm:w-auto"
              )}
            >
              View Projects
              <ChevronDown className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#contact"
              className={cn(
                "inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium rounded-lg",
                "border-2 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950",
                "w-full sm:w-auto"
              )}
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className="w-full lg:w-auto lg:max-w-sm"
          initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-6">
            <HeroProjectCard project={latestProject} />
            {workingOnProject && <HeroProjectCard project={workingOnProject} />}
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 rounded-full p-1"
        aria-label="Scroll to about"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={28} strokeWidth={2} />
        </motion.div>
      </motion.a>
    </section>
  );
}
