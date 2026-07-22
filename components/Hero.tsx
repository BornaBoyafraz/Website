"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
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
import { type Category } from "@/lib/projectCategory";
import LoomIcon from "@/components/icons/LoomIcon";
import XTwitterIcon from "./icons/XTwitterIcon";
import { ProjectCover } from "@/components/ProjectCover";

const HeroObject = dynamic(() => import("@/components/three/HeroObject"), {
  ssr: false,
  loading: () => <HeroObjectFallback />,
});

function HeroObjectFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full border border-mint opacity-30" />
    </div>
  );
}

type SkillDashboard = {
  id: string;
  label: string;
  buttonLabel: string;
  buttonDescription: string;
  icon: typeof Code2;
  bars: Array<{ label: string; value: number }>;
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

const latestProject = {
  label: "Latest",
  title: CODEPULSE_PROJECT.title,
  description: CODEPULSE_PROJECT.description,
  startDate: CODEPULSE_PROJECT.startDate,
  endDate: CODEPULSE_PROJECT.endDate,
  categories: CODEPULSE_PROJECT.categories as Category[],
  thumbnail: CODEPULSE_PROJECT.thumbnail,
  links: CODEPULSE_PROJECT.links ?? [
    {
      label: "Source Code",
      href: CODEPULSE_PROJECT.href,
      kind: "source" as const,
      variant: "primary" as const,
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
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? `${date}T12:00:00`
    : date;
  return new Date(normalized).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function getDateLabel(startDate?: string, endDate?: string): string | null {
  if (!startDate) return null;
  if (endDate) return `${formatMonthYear(startDate)} — ${formatMonthYear(endDate)}`;
  return formatMonthYear(startDate);
}

function isLoomLink(link: ProjectLink): boolean {
  return (
    link.label.toLowerCase().includes("loom") ||
    link.href.toLowerCase().includes("loom.com")
  );
}

function getLinkIcon(link: ProjectLink) {
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

const chip =
  "inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 font-mono text-xs lowercase text-mint";

/* ---------------- Capabilities ---------------- */

function Capabilities({ reduceMotion }: { reduceMotion: boolean }) {
  const [selectedId, setSelectedId] = useState(SKILL_DASHBOARDS[0].id);
  const selected =
    SKILL_DASHBOARDS.find((s) => s.id === selectedId) ?? SKILL_DASHBOARDS[0];
  const Icon = selected.icon;
  const activeIndex = SKILL_DASHBOARDS.findIndex((s) => s.id === selected.id);

  return (
    <div className="relative border-t border-border pt-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono-label"><span className="mint">//</span> capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold lowercase tracking-tight text-foreground sm:text-4xl">
            A working range
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Four disciplines I keep sharp — selected across production-minded work.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
        {/* discipline list */}
        <div className="bg-surface">
          {SKILL_DASHBOARDS.map((skill, i) => {
            const SkillIcon = skill.icon;
            const isActive = selected.id === skill.id;
            return (
              <button
                key={skill.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedId(skill.id)}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-4 border-b border-border px-5 py-5 text-left transition-colors last:border-b-0 sm:px-6",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-mint",
                  isActive ? "bg-accent" : "hover:bg-surface-2"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs transition-colors",
                    isActive ? "text-mint" : "text-faint"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    isActive
                      ? "border-mint bg-accent text-mint"
                      : "border-border text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  <SkillIcon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-base font-medium leading-tight transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {skill.buttonLabel}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {skill.buttonDescription}
                  </span>
                </span>
                <ArrowUpRight
                  className={cn(
                    "ml-auto h-4 w-4 shrink-0 transition-all duration-300",
                    isActive
                      ? "rotate-45 text-mint opacity-100"
                      : "text-muted-foreground opacity-0 group-hover:opacity-60"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* detail */}
        <div aria-live="polite" className="dot-grid bg-surface-2 p-7 sm:p-10">
          <div className="mb-9 flex items-start justify-between gap-6 border-b border-border pb-6">
            <div>
              <p className="mono-label mb-3"><span className="mint">//</span> current focus</p>
              <h3 className="text-3xl font-semibold leading-none tracking-tight text-foreground sm:text-4xl">
                {selected.label}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {selected.buttonDescription} through practical, production-minded
                work.
              </p>
            </div>
            <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-mint bg-accent text-mint sm:inline-flex">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>

          <div className="grid content-start gap-7">
            {selected.bars.map(({ label, value }, index) => (
              <div key={label}>
                <div className="mb-2 flex items-end justify-between gap-4">
                  <span className="font-mono text-xs lowercase text-muted-foreground">
                    {label}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {value}
                    <span className="text-mint">/100</span>
                  </span>
                </div>
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-elevated">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-mint"
                    initial={{ width: reduceMotion ? `${value}%` : "0%" }}
                    whileInView={{ width: `${value}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.7,
                      delay: reduceMotion ? 0 : index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex items-center justify-between border-t border-border pt-4 font-mono text-xs lowercase text-muted-foreground">
            <span>Applied expertise</span>
            <span>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(SKILL_DASHBOARDS.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Latest feature ---------------- */

function LatestFeature() {
  const dateLabel = getDateLabel(latestProject.startDate, latestProject.endDate);

  return (
    <div className="relative mt-16 border-t border-border pt-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-center">
        <div className="group cover-card relative order-2 aspect-[16/11] overflow-hidden rounded-xl border border-border bg-surface hover:border-mint lg:order-1">
          <div className="cover-media absolute inset-0">
            <ProjectCover
              name={latestProject.title}
              categories={latestProject.categories ?? []}
              className="h-full w-full"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,11,0.82),rgba(10,10,11,0.1),transparent)]" />
          <span className="absolute bottom-4 left-4 rounded-full border border-border bg-background px-3 py-1 font-mono text-xs lowercase text-mint backdrop-blur-md">
            recently shipped
          </span>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mb-5 flex items-center gap-4">
            <span className="mono-label"><span className="mint">//</span> {latestProject.label}</span>
            <span className="h-px flex-1 bg-border" />
            {dateLabel && (
              <span className="font-mono text-xs text-muted-foreground">
                {dateLabel}
              </span>
            )}
          </div>
          <h3 className="text-4xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-5xl">
            {latestProject.title}
          </h3>
          {latestProject.categories && latestProject.categories.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {latestProject.categories.map((category) => (
                <span key={category} className={chip}>
                  {category}
                </span>
              ))}
            </div>
          )}
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {latestProject.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {latestProject.links.map((link, index) => {
              const Icon = getLinkIcon(link);
              const isPrimary =
                link.variant === "primary" || (!link.variant && index === 0);
              return (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-2.5 font-mono text-xs lowercase transition-colors",
                    "focus:outline-none focus-visible:ring-1 focus-visible:ring-mint",
                    isPrimary
                      ? "border-mint bg-mint text-[#05231d] hover:bg-mint-bright"
                      : "border-border text-foreground hover:border-mint hover:text-mint"
                  )}
                >
                  <Icon size={14} />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Hero ---------------- */

export default function Hero() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handle = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  // Hero renders above the fold. We intentionally do NOT use framer's
  // mount/in-view animation on these elements — it can leave content stuck at
  // opacity:0 on load. A single reliable CSS fade sits on the hero container
  // (.hero-in in globals.css). rise() is a no-op kept for call-site brevity.
  const rise = (_delay: number) => ({});

  return (
    <section id="home" className="dot-grid relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_72%_22%,rgba(45,212,191,0.10),transparent_38%)]" />

      <div className="hero-in container-wide relative px-5 pb-24 pt-32 sm:px-8 sm:pt-36 lg:px-0 lg:pb-28 lg:pt-40">
        {/* meta line */}
        <motion.div
          {...rise(0)}
          className="mb-12 flex items-center justify-between border-b border-border pb-4"
        >
          <span className="mono-label">
            <span className="mint">//</span> Portfolio — MMXXVI
          </span>
          <span className="hidden font-mono text-xs lowercase text-faint sm:block">
            Software · Python · ML
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-xs lowercase text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
            Available for work
          </span>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.72fr)] lg:items-center lg:gap-12">
          {/* left — statement */}
          <div className="flex flex-col justify-center">
            <motion.p
              {...rise(0.05)}
              className="mono-label mb-5"
            >
              <span className="mint">//</span> portfolio
            </motion.p>

            <motion.h1
              {...rise(0.12)}
              className="text-[3.5rem] font-semibold leading-[0.9] tracking-[-0.065em] text-foreground sm:text-7xl lg:text-[5.75rem]"
            >
              Borna B. Afraz<span className="caret" aria-hidden="true" />
            </motion.h1>

            <motion.p
              {...rise(0.17)}
              className="mt-6 max-w-2xl text-base leading-7 sm:text-lg"
            >
              <span className="font-medium text-foreground">Software Developer</span>
              <span className="text-muted-foreground"> working across </span>
              <span className="text-foreground">
                Python · Machine Learning · Game Development
              </span>
            </motion.p>

            <motion.h2
              {...rise(0.22)}
              className="mt-8 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl"
            >
              Practical software, built with curiosity.
            </motion.h2>

            <motion.p
              {...rise(0.26)}
              className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
            >
              I turn machine-learning experiments, game mechanics, and
              algorithmic ideas into focused software people can actually use.
            </motion.p>

            <motion.div {...rise(0.31)} className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-mint px-5 py-3 font-mono text-xs lowercase text-[#05231d] transition-colors hover:bg-mint-bright focus:outline-none focus-visible:ring-1 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explore my work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-5 py-3 font-mono text-xs lowercase text-foreground transition-colors hover:border-mint hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
              >
                Start a conversation
              </a>
            </motion.div>

            <motion.div
              {...rise(0.36)}
              className="mt-8 flex items-center gap-1"
              aria-label="Social links"
            >
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("mailto")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-surface hover:text-mint focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
                  aria-label={label}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* right — live 3D object */}
          <motion.div
            {...(reduceMotion
              ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
              : {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  transition: {
                    duration: 1.2,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                })}
            className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-surface">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="pointer-events-none absolute inset-0 [background:radial-gradient(58%_54%_at_50%_46%,rgba(45,212,191,0.12),transparent_70%)]" />
              <div className="absolute inset-0">
                <HeroObject />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between border-t border-border bg-background p-4">
                <p className="font-mono text-xs lowercase text-muted-foreground">
                  <span className="text-mint">//</span> wireframe.obj
                </p>
                <span className="hidden items-center gap-2 font-mono text-xs lowercase text-muted-foreground sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                  Rendered live
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Capabilities + Latest */}
        <div className="mt-24 lg:mt-32">
          <Capabilities reduceMotion={reduceMotion} />
          <LatestFeature />
        </div>
      </div>
    </section>
  );
}
