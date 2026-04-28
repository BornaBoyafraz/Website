"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Github, Instagram, Linkedin, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CURRENT_WORKING_ON } from "@/lib/workingOn";
import XTwitterIcon from "./icons/XTwitterIcon";
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
  ctaLabel: "Source Code",
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

const socialLinks = [
  { href: SITE.github, icon: Github, label: "GitHub" },
  { href: SITE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: SITE.x, icon: XTwitterIcon, label: "X" },
  { href: SITE.instagram, icon: Instagram, label: "Instagram" },
  { href: SITE.mailto, icon: Mail, label: "Email me" },
];

function HeroProjectCard({ project }: { project: HeroProjectSpotlight }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/35">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(130deg,rgba(245,158,11,0.14),transparent_45%)]" />
      <div className="relative">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {project.label}
        </p>
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
            "bg-primary text-primary-foreground",
            "transition-colors hover:brightness-95",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          )}
        >
          <Github size={16} />
          {project.ctaLabel}
        </a>
      </div>
    </div>
  );
}

function HeroSplineCard() {
  return (
    <Card className="relative h-[500px] w-full overflow-hidden rounded-xl border-none bg-transparent shadow-none">
      <SplineScene
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="w-full h-full"
      />
    </Card>
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
        "relative min-h-screen overflow-hidden pt-24 pb-16 sm:pt-28 lg:pt-32",
        "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.08),transparent)]",
        "dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.06),transparent)]",
        "px-4 sm:px-6 lg:px-8"
      )}
      aria-labelledby="hero-heading"
    >
      <div className="container-wide">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)] lg:gap-14">
          <motion.div
            className="text-center lg:text-left"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground dark:text-amber-300"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              PORTFOLIO
            </p>
            <div className="mb-5 flex items-center justify-center gap-4 lg:justify-start">
              <button
                type="button"
                onClick={handleProfileClick}
                className={cn(
                  "group relative shrink-0 rounded-full",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                )}
                aria-label="Spin the Borna profile coin"
              >
                <div className="relative h-[5.25rem] w-[5.25rem] [perspective:1200px] sm:h-[5.5rem] sm:w-[5.5rem]">
                  <div
                    key={spinVersion}
                    className="relative h-full w-full rounded-full [transform-style:preserve-3d] [will-change:transform]"
                    style={isSpinning ? coinSpinStyle : undefined}
                    onAnimationEnd={() => setIsSpinning(false)}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 overflow-hidden rounded-full border border-white/10 bg-secondary shadow-[0_0_28px_rgba(245,158,11,0.22)] ring-2 ring-primary",
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
                        "absolute inset-0 rounded-full border border-white/10 shadow-[0_0_28px_rgba(245,158,11,0.22)] ring-2 ring-primary",
                        "bg-[radial-gradient(circle_at_30%_28%,rgba(255,250,214,0.98)_0%,rgba(245,198,77,0.96)_34%,rgba(194,124,18,0.94)_72%,rgba(110,59,9,0.98)_100%)]",
                        "[backface-visibility:hidden] [transform:rotateY(180deg)]"
                      )}
                    >
                      <span className="absolute inset-[12%] rounded-full border border-white/35" />
                      <span className="absolute inset-[22%] rounded-full border border-amber-950/15" />
                      <span className="absolute inset-0 rounded-full bg-[linear-gradient(140deg,rgba(255,255,255,0.62),transparent_34%,rgba(120,53,15,0.18)_74%,rgba(255,255,255,0.16)_100%)]" />
                      <span className="absolute left-[16%] top-[14%] h-[22%] w-[42%] rounded-full bg-white/30 blur-[7px]" />
                      <span className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.35),inset_0_-10px_14px_rgba(120,53,15,0.3)]" />
                      <span className="absolute inset-0 flex items-center justify-center text-xl font-black tracking-normal text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.45)] sm:text-2xl">
                        BA
                      </span>
                    </div>
                  </div>
                </div>
              </button>
              <h1
                id="hero-heading"
                className="text-4xl font-bold leading-[1.1] tracking-normal text-foreground sm:text-5xl lg:text-6xl xl:text-[4.3rem]"
              >
                Borna B. Afraz
              </h1>
            </div>
            <p className="mb-5 text-xl font-medium tracking-normal text-secondary-foreground sm:text-2xl">
              Python Developer | Machine Learning • Game Development • Algorithms
            </p>
            <p className="mx-auto mb-9 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              High school developer building practical software with Python.
              Machine learning experiments, games, and tools that solve real
              problems. VibeCoding meets algorithmic thinking.
            </p>
            <motion.div
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <a
                href="#projects"
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-lg px-8 py-3.5 text-lg font-medium sm:w-auto",
                  "bg-primary text-primary-foreground",
                  "transition-colors hover:brightness-95",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                View Projects
                <ChevronDown className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#contact"
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-lg border border-border bg-secondary px-8 py-3.5 text-lg font-medium text-secondary-foreground sm:w-auto",
                  "transition-colors hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                Contact Me
              </a>
            </motion.div>
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 lg:justify-start"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              aria-label="Social links"
            >
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("mailto")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full"
            initial={
              reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroSplineCard />
          </motion.div>
        </div>

        <motion.div
          className="mx-auto mt-12 flex w-full max-w-3xl flex-col gap-6 lg:mt-14"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Featured project updates"
        >
          {workingOnProject && <HeroProjectCard project={workingOnProject} />}
          <HeroProjectCard project={latestProject} />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="mx-auto mt-12 flex w-fit rounded-full p-1 text-muted-foreground transition-colors hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
