"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github, PlayCircle } from "lucide-react";
import { Card } from "./ui/card";
import { GlowingShadow } from "./ui/glowing-shadow";
import { cn } from "@/lib/cn";
import type { ProjectLink } from "@/lib/manualProjects";
import LoomIcon from "@/components/icons/LoomIcon";
import {
  getCategoryBadgeClass,
  getProjectCategories,
  type Category,
} from "@/lib/projectCategory";
import { getProjectImage } from "@/lib/projectImages";

const DESCRIPTION_TOGGLE_CHAR_THRESHOLD = 140;

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
}

function formatMonthYear(date: string): string {
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? `${date}T12:00:00`
    : date;

  return new Date(normalizedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function getProjectDateLabel(project: ProjectData): string | null {
  const startDate = project.startDate;
  if (!startDate) return null;
  if (project.endDate) {
    return `${formatMonthYear(startDate)} – ${formatMonthYear(project.endDate)}`;
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
    case "source":
      return Github;
    case "video":
      return PlayCircle;
    case "live":
    default:
      return ExternalLink;
  }
}

export function ProjectCard({
  project,
  index,
  reduceMotion = false,
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

  return (
    <motion.article
      className="h-full"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <GlowingShadow className="h-full rounded-lg">
        <Card className="h-full flex flex-col overflow-hidden transition-shadow md:hover:shadow-lg dark:md:hover:shadow-neutral-900/50">
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={project.thumbnail ?? getProjectImage(project.name)}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover scale-[1.02]"
              priority={false}
            />
          </div>
          <div className="p-6 flex flex-col flex-1 min-h-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {project.name}
                </h3>
                {projectDateLabel && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {projectDateLabel}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                      getCategoryBadgeClass(category)
                    )}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4 flex-1">
              <div className="relative">
                <p
                  id={descriptionId}
                  className={cn(
                    "text-muted-foreground text-sm leading-relaxed overflow-hidden transition-all duration-300",
                    !expanded && "line-clamp-3"
                  )}
                >
                  {description}
                </p>
                {!expanded && canToggleDescription && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card to-transparent" />
                )}
              </div>
              {canToggleDescription && (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="mt-1 text-sm font-medium text-accent-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-sm"
                  aria-expanded={expanded}
                  aria-controls={descriptionId}
                >
                  {expanded ? "Less" : "More"}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {projectLinks.map((link, linkIndex) => {
                const Icon = getProjectLinkIcon(link);
                const isPrimary =
                  link.variant === "primary" ||
                  (!link.variant && linkIndex === 0);

                return (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={normalizeExternalUrl(link.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                      isPrimary
                        ? "bg-primary text-primary-foreground transition-colors hover:brightness-95"
                        : "border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon size={16} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </Card>
      </GlowingShadow>
    </motion.article>
  );
}
