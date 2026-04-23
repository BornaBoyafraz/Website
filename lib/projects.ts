import { fetchAllRepos } from "./github";
import { isCurrentWorkingOnProject } from "./workingOn";

const GITHUB_USERNAME = "BornaBoyafraz";

export async function getProjects() {
  const projects = await fetchAllRepos(GITHUB_USERNAME);

  return projects.filter((project) => !isCurrentWorkingOnProject(project.name));
}
