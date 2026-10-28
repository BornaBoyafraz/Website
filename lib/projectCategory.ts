export type Category = "Project" | "Fun" | "Pitch" | "Researches/Articles";

export const FILTER_CATEGORIES: Category[] = [
  "Project",
  "Pitch",
  "Fun",
  "Researches/Articles",
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

/**
 * GitHub topic keywords → category. Lets a repo describe itself (via its
 * configured topics) so it lands in the right bucket instead of the generic
 * fallback. Kept conservative: only confident signals override.
 */
const TOPIC_CATEGORY: Record<string, Category> = {
  game: "Fun",
  gamedev: "Fun",
  "game-development": "Fun",
  pygame: "Fun",
  unity: "Fun",
  godot: "Fun",
  arcade: "Fun",
  research: "Researches/Articles",
  paper: "Researches/Articles",
  arxiv: "Researches/Articles",
  study: "Researches/Articles",
  article: "Researches/Articles",
  pitch: "Pitch",
  demo: "Pitch",
  presentation: "Pitch",
  "machine-learning": "Project",
  ml: "Project",
  ai: "Project",
  "deep-learning": "Project",
  "data-science": "Project",
  automation: "Project",
  tool: "Project",
  cli: "Project",
  app: "Project",
  webapp: "Project",
  api: "Project",
};

function inferCategoryFromTopics(topics?: string[]): Category | null {
  if (!topics || topics.length === 0) return null;
  for (const topic of topics) {
    const match = TOPIC_CATEGORY[topic.trim().toLowerCase()];
    if (match) return match;
  }
  return null;
}

export function getCategory(repoName: string, topics?: string[]): Category {
  return (
    CATEGORY_BY_REPO[repoName] ??
    CATEGORY_BY_REPO_NORMALIZED[normalizeRepoName(repoName)] ??
    inferCategoryFromTopics(topics) ??
    "Fun"
  );
}

export function getProjectCategories(project: {
  name: string;
  categories?: Category[];
  category?: Category;
  topics?: string[];
}): Category[] {
  const fallbackCategories = project.category
    ? [project.category]
    : [getCategory(project.name, project.topics)];
  const categories =
    project.categories && project.categories.length > 0
      ? project.categories
      : fallbackCategories;

  return Array.from(new Set(categories));
}

/**
 * Per-category accent colors. Harmonized on the near-black canvas so the
 * Projects section reads as a cohesive spectrum rather than one flat blue.
 */
export const CATEGORY_ACCENT: Record<Category, string> = {
  Project: "#2dd4bf", // teal / mint (primary)
  Pitch: "#f4b740", // amber
  Fun: "#f472b6", // pink
  "Researches/Articles": "#a78bfa", // violet
};

export function getCategoryAccent(category: Category | undefined): string {
  return (category && CATEGORY_ACCENT[category]) || "#2dd4bf";
}

/**
 * Section accent hues. Each page section owns one color from the palette so
 * the whole site reads as a cohesive spectrum rather than one flat mint.
 */
export const SECTION_ACCENT = {
  about: "#38bdf8", // sky
  workingOn: "#f4b740", // amber
  projects: "#2dd4bf", // mint
  contact: "#a78bfa", // violet
} as const;
