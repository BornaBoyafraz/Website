"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, RefreshCw, ChevronDown } from "lucide-react";
import { ProjectCard, type ProjectData } from "./ProjectCard";
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

function getProjectRenderKey(project: ProjectData): string {
  return project.id ?? project.html_url ?? project.name;
}

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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
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
    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    const sync = () => {
      setReduceMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };
    sync();
    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
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
      if (event.key === "Escape") setIsSortMenuOpen(false);
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
        className="section-padding"
        aria-labelledby="projects-heading"
      >
        <div className="container-wide">
          <p className="mono-label mb-3"><span className="mint">//</span> 02 — Selected Work</p>
          <h2
            id="projects-heading"
            className="mb-10 text-4xl font-semibold lowercase tracking-tight text-foreground sm:text-5xl"
          >
            Projects
          </h2>
          <div className="rounded-xl border border-border bg-surface p-14 text-center">
            <p className="mb-8 text-muted-foreground">{error}</p>
            <button
              onClick={retry}
              disabled={loading}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-mint px-5 py-3 font-mono text-xs lowercase text-[#05231d] transition-colors hover:bg-mint-bright focus:outline-none focus-visible:ring-1 focus-visible:ring-mint disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="section-padding relative"
      aria-labelledby="projects-heading"
    >
      <div className="container-wide relative">
        {/* header */}
        <motion.div
          className="mb-10 flex flex-col gap-6 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="mono-label mb-3"><span className="mint">//</span> 02 — Selected Work</p>
            <h2
              id="projects-heading"
              className="text-4xl font-semibold lowercase leading-none tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Projects
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A living archive of builds, pitches and research — pulled from GitHub
            and curated by hand.
          </p>
        </motion.div>

        {/* toolbar */}
        <motion.div
          className="mb-10 flex flex-col gap-5 rounded-xl border border-border bg-surface p-3 lg:flex-row lg:items-center lg:justify-between"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* filters */}
            <div className="flex flex-wrap items-center gap-1">
              {FILTER_OPTIONS.map((option) => {
                const isActive = categoryFilter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategoryFilter(option)}
                    className={cn(
                      "relative cursor-pointer rounded-lg px-3 py-2 font-mono text-xs lowercase transition-colors",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint",
                      isActive
                        ? "bg-accent text-mint"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )}
                    aria-pressed={isActive}
                  >
                    {option}
                    {isActive && (
                      <motion.span
                        layoutId="project-filter-underline"
                        className="absolute inset-x-3 bottom-0 h-px bg-mint"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* sort */}
            <div ref={sortDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSortMenuOpen((prev) => !prev)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 font-mono text-xs lowercase text-muted-foreground transition-colors hover:border-mint hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint"
                aria-haspopup="menu"
                aria-expanded={isSortMenuOpen}
                aria-controls="projects-sort-menu"
              >
                <span>Sort</span>
                <span className="text-mint">
                  {sortOrder === "newest" ? "Newest" : "Oldest"}
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
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
                      reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }
                    }
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 z-20 mt-2 w-44 rounded-lg border border-border bg-elevated p-1 shadow-2xl"
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
                            "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 font-mono text-xs lowercase transition-colors",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint",
                            isActive
                              ? "bg-accent text-mint"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {option.label}
                          {isActive && <span className="text-mint">•</span>}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* search */}
          <div className="relative w-full lg:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-10 pr-3 font-mono text-xs text-foreground outline-none transition-colors placeholder:text-faint focus:border-mint focus:ring-1 focus:ring-mint"
              aria-label="Search projects"
            />
          </div>
        </motion.div>

        {filteredAndSorted.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:[perspective:1600px]">
            {filteredAndSorted.map((project, i) => {
              const key = getProjectRenderKey(project);
              const hoveredIndex = hoveredKey
                ? filteredAndSorted.findIndex(
                    (p) => getProjectRenderKey(p) === hoveredKey
                  )
                : -1;
              const isHovered = hoveredKey === key;
              const pushDirection: "left" | "right" | "none" =
                hoveredIndex === -1 || isHovered
                  ? "none"
                  : i < hoveredIndex
                    ? "left"
                    : "right";
              return (
                <ProjectCard
                  key={key}
                  project={project}
                  index={i}
                  reduceMotion={reduceMotion || isMobile}
                  isHovered={isHovered}
                  isAnyHovered={hoveredKey !== null}
                  pushDirection={pushDirection}
                  onHoverStart={() => setHoveredKey(key)}
                  onHoverEnd={() =>
                    setHoveredKey((current) => (current === key ? null : current))
                  }
                />
              );
            })}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            No projects match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
