export type Category = "Project" | "Fun" | "Pitch";

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
