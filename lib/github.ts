export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  fork: boolean;
  updated_at: string;
  pushed_at: string;
}

export interface ProjectData {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  updated_at: string;
}

const GITHUB_API_BASE = "https://api.github.com";
const EXCLUDED_PROJECT_NAMES = new Set([
  "ticktacktoe",
  "ticktacktow",
  "tictactoe",
]);

function normalizeRepoName(name: string): string {
  return name.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

async function fetchReposPage(
  username: string,
  page: number = 1,
  perPage: number = 100
): Promise<GitHubRepo[]> {
  const url = `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data as GitHubRepo[];
}

export async function fetchAllRepos(username: string): Promise<ProjectData[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  const usernameLower = username.toLowerCase();

  while (true) {
    const repos = await fetchReposPage(username, page, perPage);
    if (repos.length === 0) break;

    allRepos.push(...repos);

    if (repos.length < perPage) break;
    page++;
  }

  // Intentionally return only repository metadata used by the UI.
  // No README/content fetch is performed here.
  return allRepos
    .filter((repo) => {
      const name = repo.name.toLowerCase();
      const normalizedName = normalizeRepoName(repo.name);
      if (repo.private) return false;
      if (repo.fork) return false;
      if (name === "readme" || name.includes("readme")) return false;
      if (name === usernameLower || name === `${usernameLower}.github.io`) {
        return false;
      }
      if (EXCLUDED_PROJECT_NAMES.has(normalizedName)) {
        return false;
      }
      return true;
    })
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage || null,
      updated_at: repo.updated_at,
    }));
}
