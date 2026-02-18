// Paste/update your Defence 2D image path here if you want to change it later.
const DEFENCE_2D_IMAGE_PATH = "/projects/defence-2d.png";
// Paste/update your Matching Game image path here if you want to change it later.
const MATCHING_GAME_IMAGE_PATH = "/projects/matching-game.png";

export const PROJECT_IMAGES: Record<string, string> = {
  "AI-Search-Agent": "/projects/ai-search-agent.png",
  "Flappy-bird": "/projects/flappy-bird.png",
  FlappyBird: "/projects/flappy-bird.png",
  "flappy-bird": "/projects/flappy-bird.png",
  GTAVI: "/projects/gtavi.png",
  gtavi: "/projects/gtavi.png",
  "Calory-Tracker": "/projects/calory-tracker.png",
  "calory-tracker": "/projects/calory-tracker.png",
  CaloryTracker: "/projects/calory-tracker.png",
  "Calory Tracker": "/projects/calory-tracker.png",
  "Subway-Surface": "/projects/subway-surfers.png",
  "subway-surface": "/projects/subway-surfers.png",
  SubwaySurface: "/projects/subway-surfers.png",
  subwaysurface: "/projects/subway-surfers.png",
  "Subway-Surfers": "/projects/subway-surfers.png",
  "subway-surfers": "/projects/subway-surfers.png",
  SubwaySurfers: "/projects/subway-surfers.png",
  subwaysurfers: "/projects/subway-surfers.png",
  "Defence-2D": DEFENCE_2D_IMAGE_PATH,
  Defence2D: DEFENCE_2D_IMAGE_PATH,
  "defence-2d": DEFENCE_2D_IMAGE_PATH,
  defence2d: DEFENCE_2D_IMAGE_PATH,
  "Defence 2D": DEFENCE_2D_IMAGE_PATH,
  PACMAN: "/projects/pacman.png",
  Pacman: "/projects/pacman.png",
  pacman: "/projects/pacman.png",
  Packman: "/pictures/PackMan.png",
  packman: "/pictures/PackMan.png",
  PackMan: "/projects/pacman.png",
  "Pac-Man": "/projects/pacman.png",
  "pac-man": "/projects/pacman.png",
  "Car-Game": "/projects/car-game.png",
  "car-game": "/projects/car-game.png",
  CarGame: "/projects/car-game.png",
  cargame: "/projects/car-game.png",
  "Car Game": "/projects/car-game.png",
  "Matching-Game": MATCHING_GAME_IMAGE_PATH,
  "matching-game": MATCHING_GAME_IMAGE_PATH,
  MatchingGame: MATCHING_GAME_IMAGE_PATH,
  matchinggame: MATCHING_GAME_IMAGE_PATH,
  "Matching Game": MATCHING_GAME_IMAGE_PATH,
};

function normalizeRepoName(repoName: string): string {
  return repoName
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

const PROJECT_IMAGES_NORMALIZED: Record<string, string> = Object.fromEntries(
  Object.entries(PROJECT_IMAGES).map(([repoName, imagePath]) => [
    normalizeRepoName(repoName),
    imagePath,
  ])
) as Record<string, string>;

export function getProjectImage(repoName: string): string {
  return (
    PROJECT_IMAGES[repoName] ??
    PROJECT_IMAGES_NORMALIZED[normalizeRepoName(repoName)] ??
    "/projects/default.png"
  );
}
