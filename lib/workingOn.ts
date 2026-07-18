import type { Category } from "./projectCategory";
import type { ProjectLink } from "./manualProjects";

export type WorkingOnProject = {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  links: ProjectLink[];
};

export const WORKING_ON_PROJECTS: WorkingOnProject[] = [
  {
    id: "drake",
    title: "Drake",
    description:
      'A tiny smart compiler that watches how a language model "thinks" step by step, then builds faster shortcuts for it on the fly using LLVM compiler technology.',
    categories: ["Project"],
    links: [
      {
        label: "Source Code",
        href: "https://github.com/BornaBoyafraz/DRAKE---",
        kind: "source",
        variant: "primary",
      },
    ],
  },
  {
    id: "opportunityos",
    title: "OpportunityOS",
    description:
      "A full-stack application that helps students organize opportunities, deadlines, and applications in one place.",
    categories: ["Project"],
    links: [
      {
        label: "Source Code",
        href: "https://github.com/BornaBoyafraz/OpportunityOS",
        kind: "source",
        variant: "primary",
      },
    ],
  },
];
