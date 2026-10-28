export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
}

export interface ProjectData {
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  updated_at: string;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
}

const GITHUB_API_BASE = "https://api.github.com";

// Cache GitHub responses for an hour. This keeps the homepage fast and,
// crucially, avoids hammering the unauthenticated 60-req/hr limit on Vercel.
const REVALIDATE_SECONDS = 3600;

const HIDDEN_REPOS = new Set([
  "website",
  "portfolio",
  "borna-portfolio",
  "bornaba",
]);
const EXCLUDED_PROJECT_NAMES = new Set([
  "safewalk",
  "ticktacktoe",
  "ticktacktow",
  "tictactoe",
  "qneo",
  "codepulse",
  "opportunityos",
]);

function normalizeRepoName(name: string): string {
  return name.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    // `+json` returns `topics` inline, so no preview header is needed.
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Optional: set GITHUB_TOKEN in the environment to raise the rate limit
  // from 60 to 5,000 requests/hour. The site works fine without it.
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchReposPage(
  username: string,
  page: number = 1,
  perPage: number = 100
): Promise<GitHubRepo[]> {
  const url = `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=pushed`;
  const res = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
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

  return allRepos
    .filter((repo) => {
      const name = repo.name.toLowerCase();
      const normalizedName = normalizeRepoName(repo.name);
      if (repo.private) return false;
      if (repo.fork) return false;
      if (repo.archived) return false;
      if (HIDDEN_REPOS.has(name)) return false;
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
      description: repo.description ?? "No description provided on GitHub.",
      html_url: repo.html_url,
      homepage: repo.homepage || null,
      pushed_at: repo.pushed_at,
      updated_at: repo.updated_at,
      language: repo.language ?? null,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
    }));
}
