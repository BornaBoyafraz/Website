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

export const WORKING_ON_PROJECTS: WorkingOnProject[] = [
  {
    id: "foreman",
    title: "Foreman",
    description:
      "Make Claude a manager: Foreman routes your prompt to the best skills and agents, runs them in parallel like coworkers, keeps token spend low, and maintains a CLAUDE.md memory it updates as it works.",
    categories: ["Project", "Fun"],
    showInProjects: true,
    links: [
      {
        label: "Source Code",
        href: "https://github.com/BornaBoyafraz/Foreman",
        kind: "source",
        variant: "primary",
      },
    ],
  },
];
