"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, RefreshCw, ChevronDown } from "lucide-react";
import { ProjectCard, type ProjectData } from "./ProjectCard";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card } from "./ui/card";
import { cn } from "@/lib/cn";
import {
  FILTER_CATEGORIES,
  getProjectCategories,
  type Category,
} from "@/lib/projectCategory";
import { MANUAL_PROJECTS, type ManualProject } from "@/lib/manualProjects";
import { WORKING_ON_PROJECTS } from "@/lib/workingOn";

type SortOrder = "newest" | "oldest";

type FixedProjectDates = {
  startDate: string;
  endDate?: string;
};

const FIXED_PROJECT_DATES: Record<string, FixedProjectDates> = {
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
  calorietracker: { startDate: "2025-07-01", endDate: "2025-10-01" },
  aisearchagent: { startDate: "2026-01-01" },
};

function normalizeProjectName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const WORKING_ON_PROJECT_NAMES = new Set(
  WORKING_ON_PROJECTS.map((project) => normalizeProjectName(project.title))
);

function getFixedProjectDates(projectName: string): FixedProjectDates | null {
  return FIXED_PROJECT_DATES[normalizeProjectName(projectName)] ?? null;
}

function toManualProjectData(project: ManualProject): ProjectData {
  return {
    id: project.id,
    name: project.title,
    description: project.description,
    html_url: project.href,
    homepage: project.homepage ?? null,
    categories: project.categories,
    startDate: project.startDate,
    endDate: project.endDate,
    date: project.endDate ?? project.startDate,
    thumbnail: project.thumbnail,
    primaryCtaLabel: project.primaryCtaLabel,
    secondaryCtaLabel: project.secondaryCtaLabel,
    isVideo: project.isVideo,
    links: project.links,
  };
}

function mergeManualProject(
  existingProject: ProjectData,
  manualProject: ManualProject
): ProjectData {
  return {
    ...existingProject,
    id: manualProject.id,
    name: manualProject.title,
    description: manualProject.description,
    html_url: manualProject.href,
    homepage: manualProject.homepage ?? existingProject.homepage,
    categories: manualProject.categories,
    startDate: manualProject.startDate,
    endDate: manualProject.endDate,
    date: manualProject.endDate ?? manualProject.startDate,
    thumbnail: manualProject.thumbnail ?? existingProject.thumbnail,
    primaryCtaLabel:
      manualProject.primaryCtaLabel ?? existingProject.primaryCtaLabel,
    secondaryCtaLabel:
      manualProject.secondaryCtaLabel ?? existingProject.secondaryCtaLabel,
    isVideo: manualProject.isVideo ?? existingProject.isVideo,
    links: manualProject.links ?? existingProject.links,
  };
}

function getSortDate(project: ProjectData): number | null {
  const sortDate = project.endDate ?? project.startDate;
  if (!sortDate) return null;
  const timestamp = new Date(sortDate).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

type ProjectFilter = "All" | Category;

const FILTER_OPTIONS: ProjectFilter[] = ["All", ...FILTER_CATEGORIES];
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
  const [isMobile, setIsMobile] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const projects = useMemo(() => {
    const githubReposMapped = githubProjects
      .filter(
        (project) =>
          !WORKING_ON_PROJECT_NAMES.has(normalizeProjectName(project.name))
      )
      .map((project) => {
        const fixedDates = getFixedProjectDates(project.name);
        return {
          ...project,
          startDate: fixedDates?.startDate,
          endDate: fixedDates?.endDate,
          date: fixedDates
            ? fixedDates.endDate ?? fixedDates.startDate
            : undefined,
        };
      });

    const projectsByName = new Map<string, ProjectData>(
      githubReposMapped.map((project) => [
        normalizeProjectName(project.name),
        project,
      ])
    );

    for (const manualProject of MANUAL_PROJECTS) {
      const projectKey = normalizeProjectName(manualProject.title);
      const existingProject = projectsByName.get(projectKey);

      if (existingProject) {
        projectsByName.set(
          projectKey,
          mergeManualProject(existingProject, manualProject)
        );
        continue;
      }

      projectsByName.set(projectKey, toManualProjectData(manualProject));
    }

    return Array.from(projectsByName.values());
  }, [githubProjects]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const syncMotion = () => {
      setReduceMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    mobileQuery.addEventListener("change", syncMotion);

    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      mobileQuery.removeEventListener("change", syncMotion);
    };
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
        return getProjectCategories(project).includes(categoryFilter);
      })
      .sort((a, b) => {
        const aDate = getSortDate(a);
        const bDate = getSortDate(b);

        if (aDate === null && bDate === null) return 0;
        if (aDate === null) return 1;
        if (bDate === null) return -1;

        return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
      });
  }, [projects, search, categoryFilter, sortOrder]);

  const shouldReduceMotion = reduceMotion || isMobile;

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
        className="section-padding bg-transparent"
        aria-labelledby="projects-heading"
      >
        <div className="container-wide">
          <h2
            id="projects-heading"
            className="mb-8 font-serif text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
          >
            Projects
          </h2>
          <Card className="washi-panel border-border p-12 text-center shadow-none">
            <p className="text-muted-foreground mb-6">{error}</p>
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
      className="section-padding relative bg-transparent"
      aria-labelledby="projects-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 h-px bg-border" />
      <div className="container-wide relative">
        <motion.div
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Project archive
            </p>
            <h2
              id="projects-heading"
              className="font-serif text-3xl font-semibold tracking-normal text-foreground sm:text-4xl"
            >
              Projects
            </h2>
          </div>
          {error && (
            <button
              onClick={retry}
              disabled={loading}
              className="flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Retry fetch
            </button>
          )}
        </motion.div>

        <motion.div
          className="washi-panel mb-14 flex flex-col gap-4 border border-border p-3 shadow-[10px_10px_0_rgba(49,82,67,0.12)] lg:flex-row lg:items-center lg:justify-between dark:shadow-[10px_10px_0_rgba(217,104,70,0.10)]"
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1 border border-border bg-background p-1">
              {FILTER_OPTIONS.map((option) => {
                const isActive = categoryFilter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategoryFilter(option)}
                    className={cn(
                      "relative px-4 py-2.5 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="project-category-pill"
                        className="absolute inset-0 border border-primary bg-accent shadow-sm"
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
                  "inline-flex h-11 items-center gap-2 border px-4 shadow-sm dark:shadow-black/20 md:backdrop-blur-md",
                  "text-sm transition-colors text-secondary-foreground hover:text-foreground",
                  "border-border bg-background shadow-none md:backdrop-blur-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
                aria-haspopup="menu"
                aria-expanded={isSortMenuOpen}
                aria-controls="projects-sort-menu"
              >
                <span className="font-medium">Sort</span>
                <span className="text-xs text-muted-foreground">
                  {sortOrder === "newest" ? "Newest" : "Oldest"}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-muted-foreground transition-transform duration-200",
                    isSortMenuOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isSortMenuOpen && (
                  <motion.div
                    id="projects-sort-menu"
                    role="menu"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 4 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 4 }
                    }
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 z-20 mt-2 w-40 border border-border bg-card p-1 shadow-sm md:shadow-lg md:shadow-black/10 md:backdrop-blur-md dark:md:shadow-black/30"
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
                            "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {option.label}
                          {isActive && (
                            <span className="text-xs text-accent-foreground">
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
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-border bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
              aria-label="Search projects"
            />
          </div>
        </motion.div>

        {filteredAndSorted.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSorted.map((project, i) => (
              <ProjectCard
                key={project.id ?? project.html_url}
                project={project}
                index={i}
                reduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-16">
            No projects match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
