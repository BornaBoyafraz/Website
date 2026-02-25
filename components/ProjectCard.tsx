"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, ExternalLink, Github } from "lucide-react";
import { Card } from "./ui/Card";
import { cn } from "@/lib/cn";
import { getCategory, type Category } from "@/lib/projectCategory";
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
  category?: Category;
  thumbnail?: string;
  primaryCtaLabel?: string;
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
  const category = project.category ?? getCategory(project.name);
  const isResearch = category === "Research";
  const primaryCtaLabel = project.primaryCtaLabel ?? (isResearch ? "Read on Medium" : "Source Code");
  const PrimaryCtaIcon = isResearch
    ? BookOpen
    : project.isVideo
      ? ExternalLink
      : Github;
  const description = project.description;
  const projectDateLabel = getProjectDateLabel(project);
  const canToggleDescription =
    description.length > DESCRIPTION_TOGGLE_CHAR_THRESHOLD;
  const categoryBadgeClass =
    category === "Project"
      ? "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-200 dark:border-indigo-500/30"
      : category === "Pitch"
        ? "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-500/30"
        : category === "Research"
          ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30"
          : "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/20 dark:text-purple-200 dark:border-purple-500/30";

  const homepageUrl = project.homepage
    ? project.homepage.startsWith("http")
      ? project.homepage
      : `https://${project.homepage}`
    : null;

  return (
    <motion.article
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
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
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight">
                {project.name}
              </h3>
              {projectDateLabel && (
                <p className="mt-1 text-sm text-muted-foreground">{projectDateLabel}</p>
              )}
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shrink-0",
                categoryBadgeClass
              )}
            >
              {category}
            </span>
          </div>

          <div className="mb-4 flex-1">
            <div className="relative">
              <p
                id={descriptionId}
                className={cn(
                  "text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed overflow-hidden transition-all duration-300",
                  !expanded && "line-clamp-3"
                )}
              >
                {description}
              </p>
              {!expanded && canToggleDescription && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent dark:from-neutral-900 dark:to-transparent" />
              )}
            </div>
            {canToggleDescription && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-300 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-300 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 rounded-sm"
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
                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
                "hover:opacity-90 transition-opacity",
                "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
              )}
            >
              <PrimaryCtaIcon
                size={18}
                className={!isResearch && project.isVideo ? "fill-current" : undefined}
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
                  "border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white",
                  "hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                )}
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.article>
  );
}
