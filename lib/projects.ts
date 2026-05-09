import { fetchAllRepos } from "./github";

const GITHUB_USERNAME = "BornaBoyafraz";

export async function getProjects() {
  return fetchAllRepos(GITHUB_USERNAME);
}
