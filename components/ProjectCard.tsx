"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Card } from "./ui/Card";
import { cn } from "@/lib/cn";
import { getCategory, type Category } from "@/lib/projectCategory";
import { getProjectImage } from "@/lib/projectImages";

export interface ProjectData {
  id?: string;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  updated_at: string;
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

export function ProjectCard({
  project,
  index,
  reduceMotion = false,
}: ProjectCardProps) {
  const category = project.category ?? getCategory(project.name);
  const primaryCtaLabel = project.primaryCtaLabel ?? "Source Code";
  const PrimaryCtaIcon = project.isVideo ? ExternalLink : Github;
  const categoryBadgeClass =
    category === "Project"
      ? "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-200 dark:border-indigo-500/30"
      : category === "Pitch"
        ? "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-500/30"
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
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight">
              {project.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shrink-0",
                categoryBadgeClass
              )}
            >
              {category}
            </span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
            {project.description ?? "No description available."}
          </p>

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
