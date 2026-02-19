"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, RefreshCw, ChevronDown } from "lucide-react";
import { ProjectCard, type ProjectData } from "./ProjectCard";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { cn } from "@/lib/cn";
import { getCategory, type Category } from "@/lib/projectCategory";

type Project = {
  title: string;
  description: string;
  href: string;
  category: "Project" | "Fun" | "Pitch";
  startDate: string;
  endDate?: string;
  thumbnail?: string;
};

type SortOrder = "newest" | "oldest";

type ProjectDateOverride = Pick<Project, "startDate" | "endDate">;

const PROJECT_DATE_OVERRIDES: Record<string, ProjectDateOverride> = {
  cargame: { startDate: "2022-01-01" },
  flappybird: { startDate: "2022-02-01" },
  matchinggame: { startDate: "2022-04-01" },
  defence2d: { startDate: "2022-09-01", endDate: "2022-11-01" },
  packman: { startDate: "2023-01-01", endDate: "2023-05-01" },
  pacman: { startDate: "2023-01-01", endDate: "2023-05-01" },
  subwaysurfers: { startDate: "2024-01-01", endDate: "2024-03-01" },
  subwaysurface: { startDate: "2024-01-01", endDate: "2024-03-01" },
  gta6: { startDate: "2025-04-01", endDate: "2025-07-01" },
  gtavi: { startDate: "2025-04-01", endDate: "2025-07-01" },
  calorytracker: { startDate: "2025-07-01", endDate: "2025-10-01" },
  aisearchagent: { startDate: "2026-01-01" },
};

const manualProjects: Project[] = [
  {
    title: "Loveable.ai User Growth Pitch",
    description: "A pitch focused on increasing Loveable.ai users.",
    href: "https://www.loom.com/share/e0d66f81e0784b3896f6cb886a029657",
    category: "Pitch",
    startDate: "2026-02-19",
    thumbnail: "/pictures/Loveable.png",
  },
];

function normalizeProjectKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getProjectDateOverride(projectName: string): ProjectDateOverride | null {
  return PROJECT_DATE_OVERRIDES[normalizeProjectKey(projectName)] ?? null;
}

const getSortDate = (project: Project) =>
  new Date(project.endDate ?? project.startDate).getTime();

function toSortableProject(project: ProjectData): Project {
  return {
    title: project.name,
    description: project.description ?? "",
    href: project.html_url,
    category: resolveProjectCategory(project),
    startDate: project.startDate ?? project.updated_at,
    endDate: project.endDate,
    thumbnail: project.thumbnail,
  };
}

const manualProjectCards: ProjectData[] = manualProjects.map((project) => ({
  id: project.href,
  name: project.title,
  description: project.description,
  html_url: project.href,
  homepage: null,
  updated_at: project.endDate ?? project.startDate,
  category: project.category,
  startDate: project.startDate,
  endDate: project.endDate,
  thumbnail: project.thumbnail,
  primaryCtaLabel: "Watch on Loom",
  isVideo: true,
}));

function resolveProjectCategory(project: ProjectData): Category {
  return project.category ?? getCategory(project.name);
}

type ProjectFilter = "All" | Category;

const FILTER_OPTIONS: ProjectFilter[] = ["All", "Project", "Pitch", "Fun"];
const SORT_OPTIONS: Array<{ label: string; value: SortOrder }> = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

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
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const projects = useMemo(() => {
    const githubProjectsWithDates = githubProjects.map((project) => {
      const dateOverride = getProjectDateOverride(project.name);
      const startDate = dateOverride?.startDate ?? project.startDate ?? project.updated_at;
      const endDate = dateOverride?.endDate ?? project.endDate;

      return {
        ...project,
        startDate,
        endDate,
        updated_at: endDate ?? startDate,
      };
    });

    return [...manualProjectCards, ...githubProjectsWithDates];
  }, [githubProjects]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!isSortMenuOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (sortDropdownRef.current?.contains(target)) return;
      setIsSortMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isSortMenuOpen]);

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
      .sort((a, b) => {
        const aDate = getSortDate(toSortableProject(a));
        const bDate = getSortDate(toSortableProject(b));
        return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
      });
  }, [projects, search, categoryFilter, sortOrder]);

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

            <div ref={sortDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSortMenuOpen((prev) => !prev)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/70 bg-white/70 dark:bg-neutral-900/70 px-4 backdrop-blur-md shadow-sm shadow-neutral-900/5 dark:shadow-black/20",
                  "text-sm transition-colors text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-neutral-950"
                )}
                aria-haspopup="menu"
                aria-expanded={isSortMenuOpen}
                aria-controls="projects-sort-menu"
              >
                <span className="font-medium">Sort</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {sortOrder === "newest" ? "Newest" : "Oldest"}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-neutral-500 dark:text-neutral-400 transition-transform duration-200",
                    isSortMenuOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isSortMenuOpen && (
                  <motion.div
                    id="projects-sort-menu"
                    role="menu"
                    initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 z-20 mt-2 w-40 rounded-xl border border-neutral-200/80 bg-white/95 p-1 shadow-lg shadow-neutral-900/10 backdrop-blur-md dark:border-neutral-700/80 dark:bg-neutral-900/95 dark:shadow-black/30"
                  >
                    {SORT_OPTIONS.map((option) => {
                      const isActive = sortOrder === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isActive}
                          onClick={() => {
                            setSortOrder(option.value);
                            setIsSortMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-300",
                            isActive
                              ? "bg-indigo-50 text-neutral-900 dark:bg-indigo-500/20 dark:text-white"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                          )}
                        >
                          {option.label}
                          {isActive && (
                            <span className="text-xs text-indigo-600 dark:text-indigo-300">
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              size={18}
            />
            <Input
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-2xl border-neutral-200/70 dark:border-neutral-700/70 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md"
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
