/**
 * A curated subset of GitHub's linguist language colors. Used to render a
 * small language dot on project cards so the Projects grid reads as a lively
 * spectrum of real tech, pulled straight from GitHub.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Lua: "#000080",
  R: "#198CE7",
  Julia: "#a270ba",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Solidity: "#AA6746",
  Dockerfile: "#384d54",
  "Objective-C": "#438eff",
  MATLAB: "#e16737",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Scala: "#c22d40",
  Perl: "#0298c3",
};

const FALLBACK_LANGUAGE_COLOR = "#8b8b95";

export function getLanguageColor(language: string | null | undefined): string {
  if (!language) return FALLBACK_LANGUAGE_COLOR;
  return LANGUAGE_COLORS[language] ?? FALLBACK_LANGUAGE_COLOR;
}
