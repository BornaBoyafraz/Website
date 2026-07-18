"use client";

import { useState, useEffect } from "react";
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

type SkillDashboard = {
  id: string;
  label: string;
  buttonLabel: string;
  buttonDescription: string;
  icon: typeof Code2;
  bars: Array<{
    label: string;
    value: number;
  }>;
};

const SKILL_DASHBOARDS: SkillDashboard[] = [
  {
    id: "python",
    label: "Python",
    buttonLabel: "Python",
    buttonDescription: "Automation and tools",
    icon: Code2,
    bars: [
      { label: "Automation pipelines", value: 92 },
      { label: "Backend foundations", value: 84 },
      { label: "Data tooling", value: 78 },
    ],
  },
  {
    id: "machine-learning",
    label: "Machine Learning",
    buttonLabel: "Machine Learning",
    buttonDescription: "Models and prediction",
    icon: BrainCircuit,
    bars: [
      { label: "Model building", value: 88 },
      { label: "Evaluation loops", value: 82 },
      { label: "Risk signals", value: 91 },
    ],
  },
  {
    id: "game-development",
    label: "Game Development",
    buttonLabel: "Game Development",
    buttonDescription: "Loops and feel",
    icon: Gamepad2,
    bars: [
      { label: "Game loops", value: 86 },
      { label: "Physics tuning", value: 74 },
      { label: "Player polish", value: 80 },
    ],
  },
  {
    id: "algorithms",
    label: "Algorithms",
    buttonLabel: "Algorithms",
    buttonDescription: "Logic and optimization",
    icon: GitBranch,
    bars: [
      { label: "Problem solving", value: 94 },
      { label: "Optimization", value: 83 },
      { label: "System design", value: 89 },
    ],
  },
];

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
  const [selectedSkillId, setSelectedSkillId] = useState(
    SKILL_DASHBOARDS[0].id
  );
  const selectedSkill =
    SKILL_DASHBOARDS.find((skill) => skill.id === selectedSkillId) ??
    SKILL_DASHBOARDS[0];
  const SelectedSkillIcon = selectedSkill.icon;

  return (
    <div className="hero-console relative w-full overflow-hidden border border-border bg-card">
      <div className="pointer-events-none absolute inset-0 shoji-grid opacity-25" />
      <div className="relative flex items-center justify-between border-b border-border bg-background/70 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 bg-primary shadow-[0_0_14px_rgba(217,104,70,0.7)]" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
            Capability profile
          </p>
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
          Select a discipline
        </p>
      </div>

      <div className="relative grid min-h-[470px] grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)]">
        <div
          className="border-b border-border bg-background/55 p-3 md:border-b-0 md:border-r md:p-4"
          role="group"
          aria-label="Technical disciplines"
        >
          <p className="px-3 pb-3 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Core disciplines
          </p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {SKILL_DASHBOARDS.map((skill) => {
              const Icon = skill.icon;
              const isActive = selectedSkill.id === skill.id;

              return (
                <button
                  key={skill.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={cn(
                    "group/skill relative flex min-h-[5.25rem] items-start gap-3 border px-3 py-3 text-left md:min-h-0 md:py-4",
                    "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring",
                    isActive
                      ? "border-primary/60 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-muted/70"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border transition-colors",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground group-hover/skill:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold leading-snug text-foreground sm:text-sm">
                      {skill.buttonLabel}
                    </span>
                    <span className="mt-1 hidden text-[11px] leading-snug text-muted-foreground sm:block">
                      {skill.buttonDescription}
                    </span>
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="active-skill-rail"
                      className="absolute -right-px bottom-3 top-3 w-0.5 bg-primary md:-right-[17px]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          aria-live="polite"
          className="flex min-w-0 flex-col p-5 sm:p-7 lg:p-8"
        >
          <div className="mb-8 flex items-start justify-between gap-5 border-b border-border pb-6">
            <div>
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Current focus
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                {selectedSkill.label}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {selectedSkill.buttonDescription} through practical, production-minded work.
              </p>
            </div>
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary sm:inline-flex">
              <SelectedSkillIcon className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>

          <div className="grid flex-1 content-start gap-6">
            {selectedSkill.bars.map(({ label, value }, index) => (
              <div key={label}>
                <div className="mb-2.5 flex items-end justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-secondary-foreground">
                    {label}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {value}<span className="text-primary">/100</span>
                  </span>
                </div>
                <div
                  className="relative h-2 overflow-hidden bg-secondary"
                  role="progressbar"
                  aria-label={label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={value}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(25%_-_1px),rgba(242,234,223,0.12)_calc(25%_-_1px),rgba(242,234,223,0.12)_25%)]" />
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: reduceMotion ? `${value}%` : "0%" }}
                    animate={{ width: `${value}%` }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.55,
                      delay: reduceMotion ? 0 : index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>Applied expertise</span>
            <span>{String(SKILL_DASHBOARDS.findIndex((skill) => skill.id === selectedSkill.id) + 1).padStart(2, "0")} / {String(SKILL_DASHBOARDS.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const shouldPauseContinuousMotion = reduceMotion;

  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36"
      )}
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 shoji-grid opacity-45" />
      <div className="pointer-events-none absolute right-0 top-56 h-px w-2/3 bg-border" />
      <div className="container-wide relative">
        <div className="grid min-w-0 items-start gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(560px,1.18fr)] lg:gap-12 xl:grid-cols-[minmax(0,0.78fr)_minmax(620px,1.22fr)] xl:gap-16">
          <div className="relative min-w-0 text-center lg:text-left">
            <div className="pointer-events-none absolute -left-8 top-0 hidden h-full w-px bg-border lg:block" />
            <div className="mb-7 inline-flex items-center gap-3 border border-border bg-card/80 p-2 pr-4 shadow-[6px_6px_0_rgba(49,82,67,0.13)]">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-primary bg-secondary ring-2 ring-primary/20">
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
                    sizes="56px"
                    priority
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Borna B. Afraz</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Software developer
                </p>
              </div>
            </div>
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Python · Machine learning · Game development
            </p>
            <h1
              id="hero-heading"
              className="max-w-2xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-[4rem] xl:text-[4.6rem]"
            >
              Practical software,
              <span className="mt-1 block text-muted-foreground">built with curiosity.</span>
            </h1>
            <p className="mx-auto mb-8 mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
              I turn machine-learning experiments, game mechanics, and
              algorithmic ideas into focused software people can actually use.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#projects"
                className={cn(
                  "inline-flex w-full items-center justify-center whitespace-nowrap border border-primary px-5 py-3.5 text-base font-semibold sm:w-auto",
                  "bg-primary text-primary-foreground shadow-[6px_6px_0_rgba(49,82,67,0.18)]",
                  "transition-colors hover:brightness-95",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                Explore my work
                <ChevronDown className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#contact"
                className={cn(
                  "inline-flex w-full items-center justify-center whitespace-nowrap border border-border bg-secondary px-5 py-3.5 text-base font-semibold text-secondary-foreground sm:w-auto",
                  "transition-colors hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                Start a conversation
              </a>
            </div>
            <div
              className="mt-6 flex items-center justify-center gap-2 lg:justify-start"
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
            </div>
          </div>

          <div className="relative min-w-0 w-full">
            <div className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 border-l-2 border-t-2 border-primary" />
            <div className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 border-b-2 border-r-2 border-[#315243] dark:border-[#8fb08e]" />
            <HeroArchitecturePanel reduceMotion={shouldPauseContinuousMotion} />
          </div>
        </div>

        <div
          className="mx-auto mt-14 grid w-full max-w-2xl gap-6 lg:ml-0 lg:mt-16"
          aria-label="Featured project updates"
        >
          <HeroProjectCard project={latestProject} />
        </div>
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
