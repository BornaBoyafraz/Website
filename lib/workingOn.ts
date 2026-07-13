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
