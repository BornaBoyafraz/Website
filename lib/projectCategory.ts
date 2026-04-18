export type Category = "Project" | "Fun" | "Pitch" | "Research";

export const FILTER_CATEGORIES: Category[] = [
  "Project",
  "Pitch",
  "Fun",
  "Research",
];

export const CATEGORY_BY_REPO: Record<string, Category> = {
  "AI-Search-Agent": "Project",
  PackMan: "Project",
  Packman: "Project",
  packman: "Project",
  PacMan: "Project",
  Pacman: "Project",
  "pack-man": "Project",
  "pac-man": "Project",
};

function normalizeRepoName(repoName: string): string {
  return repoName.trim().toLowerCase();
}

const CATEGORY_BY_REPO_NORMALIZED: Record<string, Category> = Object.fromEntries(
  Object.entries(CATEGORY_BY_REPO).map(([name, category]) => [
    normalizeRepoName(name),
    category,
  ])
) as Record<string, Category>;

export function getCategory(repoName: string): Category {
  return (
    CATEGORY_BY_REPO[repoName] ??
    CATEGORY_BY_REPO_NORMALIZED[normalizeRepoName(repoName)] ??
    "Fun"
  );
}

export function getProjectCategories(project: {
  name: string;
  categories?: Category[];
  category?: Category;
}): Category[] {
  const fallbackCategories = project.category
    ? [project.category]
    : [getCategory(project.name)];
  const categories =
    project.categories && project.categories.length > 0
      ? project.categories
      : fallbackCategories;

  return Array.from(new Set(categories));
}

export function getCategoryBadgeClass(category: Category): string {
  switch (category) {
    case "Project":
      return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-200 dark:border-indigo-500/30";
    case "Pitch":
      return "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-500/30";
    case "Research":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30";
    case "Fun":
    default:
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/20 dark:text-purple-200 dark:border-purple-500/30";
  }
}
