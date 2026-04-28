"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Card } from "./ui/card";
import { GlowingShadow } from "./ui/glowing-shadow";
import { cn } from "@/lib/cn";
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
  const PrimaryCtaIcon = project.isVideo ? ExternalLink : Github;
  const description = project.description;
  const projectDateLabel = getProjectDateLabel(project);
  const canToggleDescription =
    description.length > DESCRIPTION_TOGGLE_CHAR_THRESHOLD;

  const homepageUrl = project.homepage
    ? project.homepage.startsWith("http")
      ? project.homepage
      : `https://${project.homepage}`
    : null;

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
        <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-neutral-900/50">
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
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-primary text-primary-foreground",
                  "transition-colors hover:brightness-95",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                )}
              >
                <PrimaryCtaIcon
                  size={16}
                  className={project.isVideo ? "fill-current" : undefined}
                />
                {primaryCtaLabel}
              </a>

              {homepageUrl && (
                <a
                  href={homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                    "border border-border bg-secondary text-secondary-foreground",
                    "hover:bg-accent hover:text-accent-foreground transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  )}
                >
                  <ExternalLink size={16} />
                  {secondaryCtaLabel}
                </a>
              )}
            </div>
          </div>
        </Card>
      </GlowingShadow>
    </motion.article>
  );
}
