"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  BrainCircuit,
  ChevronDown,
  Code2,
  ExternalLink,
  Gamepad2,
  GitBranch,
  Github,
  Instagram,
  Linkedin,
  Mail,
  PlayCircle,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CODEPULSE_PROJECT, type ProjectLink } from "@/lib/manualProjects";
import {
  getCategoryBadgeClass,
  type Category,
} from "@/lib/projectCategory";
import LoomIcon from "@/components/icons/LoomIcon";
import XTwitterIcon from "./icons/XTwitterIcon";
import bornaPortrait from "@/app/assets/Borna.jpeg";

type HeroProjectSpotlight = {
  label: string;
  subtitle?: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  categories?: Category[];
  links: ProjectLink[];
};

const latestProject: HeroProjectSpotlight = {
  label: "Latest",
  title: CODEPULSE_PROJECT.title,
  description: CODEPULSE_PROJECT.description,
  startDate: CODEPULSE_PROJECT.startDate,
  endDate: CODEPULSE_PROJECT.endDate,
  categories: CODEPULSE_PROJECT.categories,
  links: CODEPULSE_PROJECT.links ?? [
    {
      label: "Source Code",
      href: CODEPULSE_PROJECT.href,
      kind: "source",
      variant: "primary",
    },
  ],
};

const coinSpinStyle: CSSProperties = {
  animation: "hero-profile-coin-spin 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
};

const socialLinks = [
  { href: SITE.github, icon: Github, label: "GitHub" },
  { href: SITE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: SITE.x, icon: XTwitterIcon, label: "X" },
  { href: SITE.instagram, icon: Instagram, label: "Instagram" },
  { href: SITE.mailto, icon: Mail, label: "Email me" },
];

function formatMonthYear(date: string): string {
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? `${date}T12:00:00`
    : date;

  return new Date(normalizedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function getProjectDateLabel(project: HeroProjectSpotlight): string | null {
  if (!project.startDate) return null;

  if (project.endDate) {
    return `${formatMonthYear(project.startDate)} – ${formatMonthYear(project.endDate)}`;
  }

  return formatMonthYear(project.startDate);
}

function isLoomLink(link: ProjectLink): boolean {
  return (
    link.label.toLowerCase().includes("loom") ||
    link.href.toLowerCase().includes("loom.com")
  );
}

function getProjectLinkIcon(link: ProjectLink) {
  if (isLoomLink(link)) return LoomIcon;

  switch (link.kind) {
    case "article":
      return BookOpen;
    case "source":
      return Github;
    case "video":
      return PlayCircle;
    case "live":
    default:
      return ExternalLink;
  }
}

function HeroProjectCard({ project }: { project: HeroProjectSpotlight }) {
  const dateLabel = getProjectDateLabel(project);
  const categories = project.categories ?? [];

  return (
    <div className="washi-panel joinery-shadow relative flex h-full flex-col overflow-hidden border border-border p-6 md:p-7">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-2 bg-primary" />
      <div className="pointer-events-none absolute right-5 top-5 h-16 w-16 border-r border-t border-border" />
      <div className="relative flex h-full flex-col">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {project.label}
          </p>
          {dateLabel && (
            <p className="text-sm text-muted-foreground">{dateLabel}</p>
          )}
        </div>

        <div className="mb-4">
          {project.subtitle && (
            <p className="mb-2 text-sm font-medium text-primary">
              {project.subtitle}
            </p>
          )}
          <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground">
            {project.title}
          </h3>
          {categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className={cn(
                    "inline-flex max-w-full items-center border px-2.5 py-1 text-xs font-semibold leading-tight",
                    getCategoryBadgeClass(category)
                  )}
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.links.map((link, index) => {
            const Icon = getProjectLinkIcon(link);
            const isPrimary =
              link.variant === "primary" || (!link.variant && index === 0);

            return (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  isPrimary
                    ? "border-primary bg-primary text-primary-foreground transition-colors hover:brightness-95"
                    : "border-border bg-secondary text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon size={16} />
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeroArchitecturePanel({ reduceMotion }: { reduceMotion: boolean }) {
  const specialties = [
    { label: "Python", icon: Code2 },
    { label: "ML", icon: BrainCircuit },
    { label: "Games", icon: Gamepad2 },
  ];

  return (
    <div className="washi-panel joinery-shadow relative min-h-[430px] max-w-full overflow-hidden border border-border sm:min-h-[500px]">
      <div className="pointer-events-none absolute inset-0 shoji-grid opacity-55" />
      <div className="absolute left-0 top-0 h-4 w-full bg-[#315243] dark:bg-[#8fb08e]" />
      <div className="absolute left-0 top-4 h-2 w-2/5 bg-primary" />
      <div className="absolute bottom-0 right-0 h-20 w-2 bg-primary" />
      <div className="absolute bottom-0 right-2 h-2 w-1/2 bg-[#315243] dark:bg-[#8fb08e]" />

      <div className="relative grid min-h-[430px] grid-cols-1 gap-0 p-4 sm:min-h-[500px] sm:grid-cols-[1fr_112px] sm:p-8">
        <div className="relative border border-border bg-background p-5">
          <div className="absolute -left-3 top-10 h-24 w-3 bg-primary" />
          <div className="absolute -right-5 bottom-12 h-32 w-5 bg-secondary" />
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Build log
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold text-foreground">
                Code garden
              </h2>
            </div>
            <GitBranch className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>

          <div className="grid gap-4">
            {[
              ["Repository intelligence", "78%"],
              ["Prediction systems", "92%"],
              ["Prototype velocity", "86%"],
            ].map(([label, value], index) => (
              <motion.div
                key={label}
                className="grid grid-cols-[minmax(0,1fr)_64px] items-center gap-4"
                initial={
                  reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
              >
                <div className="h-12 border border-border bg-card p-2">
                  <div
                    className="h-full bg-primary"
                    style={{ width: value }}
                  />
                </div>
                <span className="font-mono text-sm text-muted-foreground">
                  {value}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {specialties.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex min-h-24 flex-col justify-between border border-border bg-card p-4"
              >
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden border-y border-r border-border bg-secondary sm:block">
          <div className="absolute inset-x-0 top-0 h-1/3 border-b border-border bg-accent" />
          <div className="absolute inset-x-0 top-1/3 h-1/3 border-b border-border bg-card" />
          <div className="absolute bottom-8 left-1/2 h-28 w-px -translate-x-1/2 bg-primary" />
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap text-xs font-semibold uppercase text-muted-foreground">
            Studio systems
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const handleProfileClick = () => {
    if (reduceMotion || isMobile !== false) return;
    setSpinVersion((current) => current + 1);
    setIsSpinning(true);
  };

  const shouldPauseContinuousMotion = reduceMotion || isMobile !== false;

  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40"
      )}
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 shoji-grid opacity-45" />
      <div className="pointer-events-none absolute left-0 top-28 h-3 w-1/2 bg-primary sm:w-1/3" />
      <div className="pointer-events-none absolute right-0 top-56 h-px w-2/3 bg-border" />
      <div className="container-wide relative">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(380px,1fr)] lg:gap-16">
          <motion.div
            className="relative min-w-0 text-center lg:text-left"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -left-8 top-0 hidden h-full w-px bg-border lg:block" />
            <p
              className="mb-3 text-[11px] uppercase text-muted-foreground"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              Portfolio studio
            </p>
            <div className="mb-5 flex min-w-0 flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
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
                  <span className="absolute -inset-2 border border-primary" />
                  <div
                    key={spinVersion}
                    className="relative h-full w-full rounded-full [transform-style:preserve-3d] [will-change:transform]"
                    style={
                      isSpinning && !shouldPauseContinuousMotion
                        ? coinSpinStyle
                        : undefined
                    }
                    onAnimationEnd={() => setIsSpinning(false)}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 overflow-hidden rounded-full border border-white/10 bg-secondary shadow-[0_0_28px_rgba(183,65,46,0.22)] ring-2 ring-primary",
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
                          quality={85}
                          className="object-cover object-[center_32%]"
                          sizes="(min-width: 640px) 88px, 84px"
                          priority
                          onError={() => setImgError(true)}
                        />
                      )}
                    </div>
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full border border-white/10 shadow-[0_0_28px_rgba(183,65,46,0.22)] ring-2 ring-primary",
                        "bg-[radial-gradient(circle_at_30%_28%,rgba(255,250,214,0.98)_0%,rgba(217,104,70,0.96)_34%,rgba(126,63,47,0.94)_72%,rgba(54,32,24,0.98)_100%)]",
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
                className="max-w-full font-serif text-4xl font-semibold leading-[1.05] tracking-normal text-foreground sm:text-5xl lg:text-6xl xl:text-[4.3rem]"
              >
                Borna B. Afraz
              </h1>
            </div>
            <div className="mb-5 h-1 w-32 timber-rule mx-auto lg:mx-0" />
            <p className="mb-5 text-xl font-medium tracking-normal text-secondary-foreground sm:text-2xl">
              Python Developer | Machine Learning • Game Development • Algorithms
            </p>
            <p className="mx-auto mb-9 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Software developer building practical software with Python.
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
                  "inline-flex w-full items-center justify-center border border-primary px-8 py-3.5 text-lg font-medium sm:w-auto",
                  "bg-primary text-primary-foreground shadow-[6px_6px_0_rgba(49,82,67,0.18)]",
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
                  "inline-flex w-full items-center justify-center border border-border bg-secondary px-8 py-3.5 text-lg font-medium text-secondary-foreground sm:w-auto",
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
                  className="inline-flex h-11 w-11 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative min-w-0 w-full"
            initial={
              reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -left-5 -top-5 h-20 w-20 border-l-8 border-t-8 border-primary" />
            <div className="pointer-events-none absolute -bottom-5 right-6 h-24 w-2 bg-[#315243] dark:bg-[#8fb08e]" />
            <HeroArchitecturePanel reduceMotion={shouldPauseContinuousMotion} />
          </motion.div>
        </div>

        <motion.div
          className="mx-auto mt-14 grid w-full max-w-2xl gap-6 lg:ml-0 lg:mt-16"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Featured project updates"
        >
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
          animate={shouldPauseContinuousMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={28} strokeWidth={2} />
        </motion.div>
      </motion.a>
    </section>
  );
}
