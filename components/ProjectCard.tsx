"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Github,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ProjectLink } from "@/lib/manualProjects";
import LoomIcon from "@/components/icons/LoomIcon";
import { ProjectCover } from "@/components/ProjectCover";
import { getProjectCategories, type Category } from "@/lib/projectCategory";

const DESCRIPTION_TOGGLE_CHAR_THRESHOLD = 150;

export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  pushed_at?: string;
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

const chip =
  "inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[0.65rem] lowercase text-mint";

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
  const categories = getProjectCategories(project);
  const primaryCtaLabel = project.primaryCtaLabel ?? "Source Code";
  const secondaryCtaLabel = project.secondaryCtaLabel ?? "Live Demo";
  const description = project.description;
  const projectDateLabel = getProjectDateLabel(project);
  const canToggleDescription =
    description.length > DESCRIPTION_TOGGLE_CHAR_THRESHOLD;

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
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
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
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-xl border bg-surface transition-all duration-500 ease-out will-change-transform",
          isHovered ? "border-mint" : "border-border",
          isHovered &&
            !reduceMotion &&
            "lg:-translate-y-2 lg:scale-[1.07] lg:shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(45,212,191,0.35),0_0_44px_-10px_rgba(45,212,191,0.35)]",
          shouldShift &&
            pushDirection === "left" &&
            "lg:-translate-x-6 lg:scale-[0.93] lg:opacity-45",
          shouldShift &&
            pushDirection === "right" &&
            "lg:translate-x-6 lg:scale-[0.93] lg:opacity-45"
        )}
      >
        {/* thumbnail — fully visible, 16:10 */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-elevated">
          <div className="cover-media absolute inset-0">
            <ProjectCover
              name={project.name}
              categories={categories}
              className="h-full w-full"
            />
          </div>
          <span className="absolute right-3 top-3 rounded-md border border-border bg-background/80 px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* caption */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <span key={category} className={chip}>
                {category}
              </span>
            ))}
            {projectDateLabel && (
              <span className="ml-auto font-mono text-[0.65rem] lowercase text-faint">
                {projectDateLabel}
              </span>
            )}
          </div>

          <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-mint">
            {project.name}
          </h3>

          <div className="mb-5 mt-2 flex-1">
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
                className="mt-1.5 cursor-pointer font-mono text-[0.65rem] lowercase text-mint transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-1 focus-visible:ring-mint"
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
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-[0.7rem] lowercase transition-colors",
                    "focus:outline-none focus-visible:ring-1 focus-visible:ring-mint",
                    isPrimary
                      ? "border-mint bg-mint text-[#05231d] hover:bg-mint-bright"
                      : "border-border bg-background text-foreground hover:border-mint hover:text-mint"
                  )}
                >
                  <Icon size={13} />
                  {link.label}
                  {isPrimary && <ArrowUpRight size={12} />}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
