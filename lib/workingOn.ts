import type { Category } from "./projectCategory";
import type { ProjectLink } from "./manualProjects";

export type WorkingOnProject = {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  links: ProjectLink[];
  showInProjects?: boolean;
};

export const WORKING_ON_PROJECTS: WorkingOnProject[] = [];
