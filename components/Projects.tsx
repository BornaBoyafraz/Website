"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";
import { ProjectCard, type ProjectData } from "./ProjectCard";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { cn } from "@/lib/cn";
import { getCategory, type Category } from "@/lib/projectCategory";

type ManualProject = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: Category;
  date?: string;
  thumbnail?: string;
};

const manualProjects: ManualProject[] = [
  {
    id: "loveable-ai-user-growth-pitch",
    title: "Loveable.ai User Growth Pitch",
    description: "A pitch focused on increasing Loveable.ai users.",
    href: "https://www.loom.com/share/e0d66f81e0784b3896f6cb886a029657",
    category: "Pitch",
    date: "2026-02-19T00:00:00.000Z",
    thumbnail: "/pictures/Loveable.png",
  },
];

const manualProjectCards: ProjectData[] = manualProjects.map((project) => ({
  id: project.id,
  name: project.title,
  description: project.description,
  html_url: project.href,
  homepage: null,
  updated_at: project.date ?? "1970-01-01T00:00:00.000Z",
  category: project.category,
  thumbnail: project.thumbnail,
  primaryCtaLabel: "Watch on Loom",
  isVideo: true,
}));

function resolveProjectCategory(project: ProjectData): Category {
  return project.category ?? getCategory(project.name);
}

type ProjectFilter = "All" | Category;

const FILTER_OPTIONS: ProjectFilter[] = ["All", "Project", "Pitch", "Fun"];

interface ProjectsProps {
  initialProjects: ProjectData[];
  error?: string;
}

export default function Projects({
  initialProjects,
  error: initialError,
}: ProjectsProps) {
  const [githubProjects, setGithubProjects] =
    useState<ProjectData[]>(initialProjects);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProjectFilter>("All");
  const [reduceMotion, setReduceMotion] = useState(false);

  const projects = useMemo(
    () => [...manualProjectCards, ...githubProjects],
    [githubProjects]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    return [...projects]
      .filter((project) => {
        if (!q) return true;
        return (
          project.name.toLowerCase().includes(q) ||
          (project.description?.toLowerCase().includes(q) ?? false)
        );
      })
      .filter((project) => {
        if (categoryFilter === "All") return true;
        return resolveProjectCategory(project) === categoryFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [projects, search, categoryFilter]);

  const retry = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGithubProjects(data);
    } catch {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error && projects.length === 0) {
    return (
      <section
        id="projects"
        className="section-padding bg-neutral-50/50 dark:bg-neutral-950/50"
        aria-labelledby="projects-heading"
      >
        <div className="container-wide">
          <h2
            id="projects-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8"
          >
            Projects
          </h2>
          <Card className="p-12 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
            <Button
              onClick={retry}
              disabled={loading}
              variant="primary"
              size="lg"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              Retry
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="section-padding bg-neutral-50/50 dark:bg-neutral-950/50"
      aria-labelledby="projects-heading"
    >
      <div className="container-wide">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            id="projects-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Projects
          </h2>
          {error && (
            <button
              onClick={retry}
              disabled={loading}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Retry fetch
            </button>
          )}
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-10"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          <div className="inline-flex items-center rounded-2xl border border-neutral-200/70 dark:border-neutral-700/70 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md p-1 shadow-sm shadow-neutral-900/5 dark:shadow-black/20">
            {FILTER_OPTIONS.map((option) => {
              const isActive = categoryFilter === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategoryFilter(option)}
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-neutral-950",
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  )}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-category-pill"
                      className="absolute inset-0 rounded-xl border border-indigo-400/35 bg-gradient-to-r from-indigo-500/20 to-indigo-400/10 dark:from-indigo-500/35 dark:to-indigo-300/20 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              size={18}
            />
            <Input
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 rounded-2xl border-neutral-200/70 dark:border-neutral-700/70 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md"
              aria-label="Search projects"
            />
          </div>
        </motion.div>

        {filteredAndSorted.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((project, i) => (
              <ProjectCard
                key={project.id ?? project.html_url}
                project={project}
                index={i}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-16">
            No projects match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
