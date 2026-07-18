"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, ExternalLink, Github, PlayCircle } from "lucide-react";
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
  const offsetClass =
    index % 3 === 1
      ? "lg:translate-y-8"
      : index % 3 === 2
        ? "lg:-translate-y-2"
        : "";

  return (
    <motion.article
      className={cn("h-full", offsetClass)}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <GlowingShadow className="h-full">
        <Card className="washi-panel group relative flex h-full flex-col overflow-hidden border-border transition-transform md:hover:-translate-y-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-primary" />
          <div className="relative mx-4 mt-4 h-48 overflow-hidden border border-border bg-muted">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(32,28,23,0.12),transparent_34%,rgba(183,65,46,0.10))] opacity-80" />
            <Image
              src={project.thumbnail ?? getProjectImage(project.name)}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover scale-[1.02] transition-transform duration-500 group-hover:scale-[1.06]"
              priority={false}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col p-6 pl-7">
            <div className="mb-4 flex flex-col gap-3">
              <div className="min-w-0">
                <h3 className="font-serif text-xl font-semibold leading-tight text-foreground">
                  {project.name}
                </h3>
                {projectDateLabel && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {projectDateLabel}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
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
                  className="mt-1 text-sm font-medium text-accent-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
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
                      "inline-flex items-center gap-2 border px-4 py-2 text-sm font-medium",
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
        </Card>
      </GlowingShadow>
    </motion.article>
  );
}
