import type { Category } from "@/lib/projectCategory";

const MINT = "#2dd4bf";

type Circle = {
  cx: number;
  cy: number;
  radius: number;
  opacity: number;
  filled: boolean;
};

type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  width: number;
};

type Artwork = {
  seed: number;
  circles: Circle[];
  lines: Line[];
  paths: string[];
  polylines: string[];
  ticks: Line[];
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function getInitials(name: string): string {
  const words = name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s\-_.]+/)
    .filter(Boolean);

  if (words.length > 1) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return (words[0] ?? name).slice(0, 2).toUpperCase();
}

function sanitizeForId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32) || "project"
  );
}

function generateArtwork(
  name: string,
  category: Category | undefined
): Artwork {
  const seed = hashString(name);
  const random = mulberry32(seed);
  const circles: Circle[] = [];
  const lines: Line[] = [];
  const paths: string[] = [];
  const polylines: string[] = [];
  const ticks: Line[] = [
    { x1: 20, y1: 20, x2: 42, y2: 20, opacity: 0.68, width: 1.25 },
    { x1: 20, y1: 20, x2: 20, y2: 42, opacity: 0.68, width: 1.25 },
    { x1: 598, y1: 20, x2: 620, y2: 20, opacity: 0.68, width: 1.25 },
    { x1: 620, y1: 20, x2: 620, y2: 42, opacity: 0.68, width: 1.25 },
    { x1: 20, y1: 380, x2: 42, y2: 380, opacity: 0.68, width: 1.25 },
    { x1: 20, y1: 358, x2: 20, y2: 380, opacity: 0.68, width: 1.25 },
    { x1: 598, y1: 380, x2: 620, y2: 380, opacity: 0.68, width: 1.25 },
    { x1: 620, y1: 358, x2: 620, y2: 380, opacity: 0.68, width: 1.25 },
  ];

  switch (category) {
    case "Project": {
      const centerX = round(470 + random() * 46);
      const centerY = round(155 + random() * 48);
      const ringCount = 5 + Math.floor(random() * 3);

      for (let index = 0; index < ringCount; index += 1) {
        circles.push({
          cx: centerX,
          cy: centerY,
          radius: round(24 + index * (17 + random() * 6)),
          opacity: round(0.12 + index * 0.045),
          filled: false,
        });
      }

      const pulseY = round(304 + random() * 18);
      const pulsePoints: string[] = [];
      for (let index = 0; index < 10; index += 1) {
        const x = round(38 + index * 63);
        const offset =
          index === 4
            ? round(-48 - random() * 14)
            : index === 5
              ? round(29 + random() * 12)
              : round((random() - 0.5) * 10);
        pulsePoints.push(`${x},${round(pulseY + offset)}`);
      }
      polylines.push(pulsePoints.join(" "));
      break;
    }

    case "Researches/Articles": {
      const nodes: Array<{ x: number; y: number; radius: number }> = [];
      for (let index = 0; index < 9; index += 1) {
        nodes.push({
          x: round(320 + random() * 276),
          y: round(54 + random() * 288),
          radius: round(2.5 + random() * 3),
        });
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        circles.push({
          cx: node.x,
          cy: node.y,
          radius: node.radius,
          opacity: round(0.32 + random() * 0.3),
          filled: true,
        });

        if (index > 0) {
          const target = nodes[Math.floor(random() * index)];
          lines.push({
            x1: node.x,
            y1: node.y,
            x2: target.x,
            y2: target.y,
            opacity: round(0.18 + random() * 0.14),
            width: round(0.65 + random() * 0.35),
          });
        }
      }
      break;
    }

    case "Pitch": {
      const centerX = round(476 + random() * 28);
      const centerY = round(198 + (random() - 0.5) * 24);
      const rayCount = 16;

      for (let index = 0; index < rayCount; index += 1) {
        const angle =
          (index / rayCount) * Math.PI * 2 + round((random() - 0.5) * 0.08);
        const inner = round(68 + random() * 10);
        const outer = round(142 + random() * 72);
        lines.push({
          x1: round(centerX + Math.cos(angle) * inner),
          y1: round(centerY + Math.sin(angle) * inner),
          x2: round(centerX + Math.cos(angle) * outer),
          y2: round(centerY + Math.sin(angle) * outer),
          opacity: round(0.12 + random() * 0.12),
          width: round(0.6 + random() * 0.35),
        });
      }

      const size = round(50 + random() * 12);
      paths.push(
        `M ${round(centerX)} ${round(centerY - size)} L ${round(
          centerX + size * 0.87
        )} ${round(centerY + size * 0.5)} L ${round(
          centerX - size * 0.87
        )} ${round(centerY + size * 0.5)} Z`
      );
      break;
    }

    case "Fun": {
      for (let index = 0; index < 38; index += 1) {
        circles.push({
          cx: round(300 + random() * 304),
          cy: round(34 + random() * 326),
          radius: round(1.5 + random() * 5),
          opacity: round(0.12 + random() * 0.38),
          filled: true,
        });
      }
      break;
    }

    default: {
      const offset = round(random() * 40);
      for (let index = 0; index < 13; index += 1) {
        const x = round(280 + index * 35 + offset);
        lines.push({
          x1: x,
          y1: 0,
          x2: round(x - 122),
          y2: 400,
          opacity: round(0.1 + random() * 0.12),
          width: round(0.55 + random() * 0.25),
        });
      }
    }
  }

  return { seed, circles, lines, paths, polylines, ticks };
}

export function ProjectCover({
  name,
  categories,
  className,
}: {
  name: string;
  categories: Category[];
  className?: string;
}) {
  const primaryCategory = categories[0];
  const artwork = generateArtwork(name, primaryCategory);
  const initials = getInitials(name);
  const idBase = `project-cover-${sanitizeForId(name)}-${artwork.seed.toString(
    36
  )}`;

  return (
    <svg
      viewBox="0 0 640 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${name} cover artwork`}
      className={className}
    >
      <defs>
        <linearGradient id={`${idBase}-background`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d0e11" />
          <stop offset="1" stopColor="#17171b" />
        </linearGradient>
        <radialGradient id={`${idBase}-glow`} cx="76%" cy="28%" r="72%">
          <stop offset="0" stopColor={MINT} stopOpacity="0.2" />
          <stop offset="0.52" stopColor={MINT} stopOpacity="0.06" />
          <stop offset="1" stopColor={MINT} stopOpacity="0" />
        </radialGradient>
        <pattern
          id={`${idBase}-dots`}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.8" fill="#ffffff" opacity="0.08" />
        </pattern>
      </defs>

      <rect width="640" height="400" fill={`url(#${idBase}-background)`} />
      <rect width="640" height="400" fill={`url(#${idBase}-dots)`} />
      <rect width="640" height="400" fill={`url(#${idBase}-glow)`} />

      <g aria-hidden="true">
        {artwork.lines.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={MINT}
            strokeWidth={line.width}
            opacity={line.opacity}
          />
        ))}
        {artwork.polylines.map((points, index) => (
          <polyline
            key={`polyline-${index}`}
            points={points}
            fill="none"
            stroke={MINT}
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.42"
          />
        ))}
        {artwork.paths.map((path, index) => (
          <path
            key={`path-${index}`}
            d={path}
            fill="none"
            stroke={MINT}
            strokeWidth="1.25"
            strokeLinejoin="round"
            opacity="0.56"
          />
        ))}
        {artwork.circles.map((circle, index) => (
          <circle
            key={`circle-${index}`}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.radius}
            fill={circle.filled ? MINT : "none"}
            stroke={circle.filled ? "none" : MINT}
            strokeWidth="0.9"
            opacity={circle.opacity}
          />
        ))}
      </g>

      <text
        x="40"
        y="252"
        fill={MINT}
        fillOpacity="0.22"
        stroke={MINT}
        strokeOpacity="0.16"
        strokeWidth="0.75"
        fontFamily="var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace"
        fontSize="184"
        fontWeight="650"
        letterSpacing="-8"
      >
        {initials}
      </text>
      <text
        x="46"
        y="112"
        fill={MINT}
        fillOpacity="0.5"
        fontFamily="var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace"
        fontSize="17"
        letterSpacing="1"
      >
        {"~/projects"}
      </text>

      {primaryCategory && (
        <g transform="translate(44 326)">
          <rect
            x="0"
            y="0"
            width={round(44 + primaryCategory.length * 8.2)}
            height="30"
            rx="15"
            fill="#0a0a0b"
            fillOpacity="0.76"
            stroke={MINT}
            strokeOpacity="0.3"
          />
          <text
            x="16"
            y="20"
            fill={MINT}
            fontFamily="var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace"
            fontSize="11"
            letterSpacing="0.8"
          >
            {primaryCategory.toLowerCase()}
          </text>
        </g>
      )}

      <g aria-hidden="true" stroke={MINT}>
        {artwork.ticks.map((tick, index) => (
          <line
            key={`tick-${index}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            strokeWidth={tick.width}
            opacity={tick.opacity}
          />
        ))}
      </g>
    </svg>
  );
}
