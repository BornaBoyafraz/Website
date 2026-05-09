import type { Category } from "./projectCategory";

export type ProjectLinkKind = "source" | "live" | "video";

export type ProjectLink = {
  label: string;
  href: string;
  kind: ProjectLinkKind;
  variant?: "primary" | "secondary";
};

export type ManualProject = {
  id: string;
  title: string;
  description: string;
  href: string;
  homepage?: string | null;
  categories: Category[];
  startDate: string;
  endDate?: string;
  thumbnail?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  isVideo?: boolean;
  links?: ProjectLink[];
};

export const SAFEWALK_PROJECT: ManualProject = {
  id: "safewalk",
  title: "SafeWalk",
  description:
    "SafeWalk is a safety-focused navigation platform designed to help users choose safer walking routes using location intelligence and safety-aware routing systems. The project combines a modern interface with practical urban safety concepts to support smarter and safer movement.",
  href: "https://github.com/BornaBoyafraz/Safe-Walk",
  homepage: "https://safewalk-two.vercel.app/",
  categories: ["Project"],
  startDate: "2026-04-01",
  endDate: "2026-05-01",
  thumbnail: "/pictures/SafeWalk.png",
  links: [
    {
      label: "Source Code",
      href: "https://github.com/BornaBoyafraz/Safe-Walk",
      kind: "source",
      variant: "primary",
    },
    {
      label: "Live Website",
      href: "https://safewalk-two.vercel.app/",
      kind: "live",
      variant: "secondary",
    },
    {
      label: "Watch on Loom",
      href: "https://www.loom.com/share/322eef060d6640678eb73de75c3df5e3",
      kind: "video",
      variant: "secondary",
    },
  ],
};

export const MANUAL_PROJECTS: ManualProject[] = [
  SAFEWALK_PROJECT,
  {
    id: "debtguard",
    title: "DebtGuard",
    description:
      "DebtGuard is an AI-assisted app for debt decisions. Users input their finances to assess risk and simulate what-if scenarios, helping them understand outcomes and make better financial choices.",
    href: "https://github.com/BornaBoyafraz/DebtGuard",
    categories: ["Project"],
    startDate: "2026-01-01",
    endDate: "2026-04-01",
    thumbnail: "/pictures/debtguard.png",
  },
  {
    id: "loveable-ai-user-growth-pitch",
    title: "Loveable.ai User Growth Pitch",
    description: "A pitch focused on increasing Loveable.ai users.",
    href: "https://www.loom.com/share/e0d66f81e0784b3896f6cb886a029657",
    categories: ["Pitch"],
    startDate: "2026-01-01",
    thumbnail: "/pictures/Loveable.png",
    primaryCtaLabel: "Watch on Loom",
    isVideo: true,
  },
  {
    id: "q-neo",
    title: "q-neo",
    description:
      "q-neo is a featured build with both its GitHub source and a Loom walkthrough, so it belongs in both the Project and Pitch views.",
    href: "https://github.com/BornaBoyafraz/q-neo",
    homepage: "https://www.loom.com/share/79e478861c6242a99139f08a8f679ef3",
    categories: ["Project", "Pitch"],
    startDate: "2026-03-01",
    thumbnail: "/pictures/q neo.png",
    primaryCtaLabel: "Source Code",
    secondaryCtaLabel: "Watch on Loom",
  },
];
