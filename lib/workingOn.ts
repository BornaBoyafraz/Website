export type WorkingOnConfig = {
  enabled: boolean;
  title: string;
  description: string;
  githubUrl: string;
};

// Toggle this off when there is no active in-progress project to feature.
export const CURRENT_WORKING_ON: WorkingOnConfig = {
  enabled: true,
  title: "SafeWalk",
  description:
    "SafeWalk is the project I am currently building. It focuses on creating a practical safety-focused tool that helps users feel more secure when planning or moving through routes.",
  githubUrl: "https://github.com/BornaBoyafraz/Safe-Walk",
};

function normalizeProjectName(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isCurrentWorkingOnProject(projectName: string): boolean {
  return (
    normalizeProjectName(projectName) ===
    normalizeProjectName(CURRENT_WORKING_ON.title)
  );
}
