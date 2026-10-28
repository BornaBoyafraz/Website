"use client";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Github,
  History,
  PlayCircle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCompactNumber, formatRelativeTime } from "@/lib/utils";
import { getLanguageColor } from "@/lib/languageColors";
import type { ProjectLink } from "@/lib/manualProjects";
import LoomIcon from "@/components/icons/LoomIcon";
import { ProjectCover } from "@/components/ProjectCover";
import {
  getCategoryAccent,
  getProjectCategories,
  type Category,
} from "@/lib/projectCategory";

const DESCRIPTION_TOGGLE_CHAR_THRESHOLD = 150;
const MAX_TILT_DEG = 5;

export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  pushed_at?: string;
  updated_at?: string;
  language?: string | null;
  topics?: string[];
  stars?: number;
  forks?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  categories?: Category[];
  category?: Category;
  thumbnail?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  isVideo?: boolean;
  links?: ProjectLink[];
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  reduceMotion?: boolean;
  isHovered?: boolean;
  isAnyHovered?: boolean;
  pushDirection?: "left" | "right" | "none";
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

function formatMonthYear(date: string): string {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? `${date}T12:00:00`
    : date;
  return new Date(normalized).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function getProjectDateLabel(project: ProjectData): string | null {
  const startDate = project.startDate;
  if (!startDate) return null;
  if (project.endDate) {
    return `${formatMonthYear(startDate)} — ${formatMonthYear(project.endDate)}`;
  }
  return formatMonthYear(startDate);
}

function normalizeExternalUrl(href: string): string {
  return href.startsWith("http") ? href : `https://${href}`;
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

const chipBase =
  "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.65rem] lowercase";

export function ProjectCard({
  project,
  index,
  reduceMotion = false,
  isHovered = false,
  isAnyHovered = false,
  pushDirection = "none",
  onHoverStart,
  onHoverEnd,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const categories = getProjectCategories(project);
  const accent = getCategoryAccent(categories[0]);
  const primaryCtaLabel = project.primaryCtaLabel ?? "Source Code";
  const secondaryCtaLabel = project.secondaryCtaLabel ?? "Live Demo";
  const description = project.description;
  const projectDateLabel = getProjectDateLabel(project);
  const canToggleDescription =
    description.length > DESCRIPTION_TOGGLE_CHAR_THRESHOLD;

  // Live GitHub metadata (absent on hand-curated projects).
  const language = project.language ?? null;
  const stars = project.stars ?? 0;
  const updatedLabel = formatRelativeTime(project.pushed_at ?? project.updated_at);
  const hasMetaRow = Boolean(language || stars > 0 || updatedLabel);

  // Pointer-driven 3D tilt + cursor glow (disabled when motion is reduced).
  const tiltX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rotateX = useTransform(tiltX, (v) => `${v}deg`);
  const rotateY = useTransform(tiltY, (v) => `${v}deg`);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * MAX_TILT_DEG * 2);
    tiltX.set(-py * MAX_TILT_DEG * 2);
    cardRef.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    cardRef.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const homepageUrl = project.homepage
    ? project.homepage.startsWith("http")
      ? project.homepage
      : `https://${project.homepage}`
    : null;

  const projectLinks =
    project.links && project.links.length > 0
      ? project.links
      : [
          {
            label: primaryCtaLabel,
            href: project.html_url,
            kind:
              primaryCtaLabel.toLowerCase().includes("loom") ||
              project.html_url.toLowerCase().includes("loom.com") ||
              project.isVideo
                ? "video"
                : "source",
            variant: "primary",
          } satisfies ProjectLink,
          ...(homepageUrl
            ? [
                {
                  label: secondaryCtaLabel,
                  href: homepageUrl,
                  kind:
                    secondaryCtaLabel.toLowerCase().includes("loom") ||
                    homepageUrl.toLowerCase().includes("loom.com") ||
                    project.isVideo
                      ? "video"
                      : "live",
                  variant: "secondary",
                } satisfies ProjectLink,
              ]
            : []),
        ];

  const shouldShift = isAnyHovered && !isHovered && !reduceMotion;

  return (
    <motion.article
      className={cn(
        "group relative h-full [perspective:1400px]",
        isHovered ? "z-30" : "z-0"
      )}
      style={
        {
          "--accent": accent,
          "--accent-ring": `${accent}80`,
          "--accent-glow": `${accent}55`,
        } as CSSProperties
      }
      onMouseEnter={onHoverStart}
      onMouseLeave={() => {
        resetTilt();
        onHoverEnd?.();
      }}
      onPointerMove={handlePointerMove}
      onFocus={onHoverStart}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          resetTilt();
          onHoverEnd?.();
        }
      }}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        ref={cardRef}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-xl border bg-surface transition-[border-color,transform,box-shadow,opacity] duration-500 ease-out will-change-transform",
          isHovered ? "border-[var(--accent)]" : "border-border",
          isHovered &&
            !reduceMotion &&
            "lg:-translate-y-2 lg:scale-[1.05] lg:shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85),0_0_0_1px_var(--accent-ring),0_0_46px_-8px_var(--accent-glow)]",
          shouldShift &&
            pushDirection === "left" &&
            "lg:-translate-x-6 lg:scale-[0.93] lg:opacity-45",
          shouldShift &&
            pushDirection === "right" &&
            "lg:translate-x-6 lg:scale-[0.93] lg:opacity-45"
        )}
      >
        {/* cursor-follow glow */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 mix-blend-screen transition-opacity duration-300",
            !reduceMotion && "group-hover:opacity-100"
          )}
          style={{
            background:
              "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), var(--accent-glow), transparent 60%)",
          }}
        />

        {/* thumbnail — full cover shown, 16:10, no crop */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-border bg-elevated">
          <div className="cover-media absolute inset-0">
            <ProjectCover
              name={project.name}
              categories={categories}
              className="h-full w-full"
            />
          </div>
          <span className="absolute right-3 top-3 rounded-md border border-border bg-background/85 px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* caption */}
        <div className="relative z-20 flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const catAccent = getCategoryAccent(category);
              return (
                <span
                  key={category}
                  className={chipBase}
                  style={{
                    color: catAccent,
                    borderColor: `${catAccent}59`,
                    backgroundColor: `${catAccent}14`,
                  }}
                >
                  {category}
                </span>
              );
            })}
            {projectDateLabel && (
              <span className="ml-auto font-mono text-[0.65rem] lowercase text-faint">
                {projectDateLabel}
              </span>
            )}
          </div>

          <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-[var(--accent)]">
            {project.name}
          </h3>

          {hasMetaRow && (
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.65rem] text-muted-foreground">
              {language && (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: getLanguageColor(language) }}
                    aria-hidden="true"
                  />
                  {language}
                </span>
              )}
              {stars > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star size={11} aria-hidden="true" />
                  {formatCompactNumber(stars)}
                  <span className="sr-only"> stars</span>
                </span>
              )}
              {updatedLabel && (
                <span className="inline-flex items-center gap-1 lowercase">
                  <History size={11} aria-hidden="true" />
                  updated {updatedLabel}
                </span>
              )}
            </div>
          )}

          <div className="mb-5 mt-3 flex-1">
            <p
              id={descriptionId}
              className={cn(
                "text-sm leading-relaxed text-muted-foreground",
                !expanded && canToggleDescription && "line-clamp-2"
              )}
            >
              {description}
            </p>
            {canToggleDescription && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-1.5 cursor-pointer rounded-sm font-mono text-[0.65rem] lowercase text-[var(--accent)] transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                aria-expanded={expanded}
                aria-controls={descriptionId}
              >
                {expanded ? "show less" : "read more"}
              </button>
            )}
          </div>

          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
            {projectLinks.map((link, linkIndex) => {
              const Icon = getProjectLinkIcon(link);
              const isPrimary =
                link.variant === "primary" || (!link.variant && linkIndex === 0);
              return (
                <a
                  key={`${link.label}-${link.href}`}
                  href={normalizeExternalUrl(link.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-[0.7rem] lowercase transition-[filter,color,border-color] hover:brightness-110",
                    "focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]",
                    isPrimary
                      ? "text-[#0a0a0b]"
                      : "border-border bg-background text-foreground hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  )}
                  style={
                    isPrimary
                      ? { backgroundColor: accent, borderColor: accent }
                      : undefined
                  }
                >
                  <Icon size={13} aria-hidden="true" />
                  {link.label}
                  {isPrimary && <ArrowUpRight size={12} aria-hidden="true" />}
                </a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
