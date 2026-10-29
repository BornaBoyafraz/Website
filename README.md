# Borna Afraz Portfolio

Live site: https://bornaba.com

## Overview

Seyedborna Boyafraz (Borna Afraz) Portfolio is a personal developer portfolio
built with Next.js, TypeScript, and Tailwind CSS. It presents profile
information, featured work, current projects, and a dynamic projects section
powered by live GitHub repository data.

The design is a dark, developer-forward theme: a deep midnight canvas lit by a
slow multi-hue aurora (teal, sky, violet, magenta, and amber), monospace
code-comment section labels, and the Geist Sans / Geist Mono type pairing.

## Features

- Responsive hero with an interactive 3D wireframe rendered live with
  three.js / React Three Fiber, a multilingual typewriter greeting, and
  magnetic call-to-action buttons.
- Slow, drifting multi-hue aurora backdrop and per-section accent colors, so
  each section (About, Projects, Contact) wears its own hue.
- Dynamic project listing that pulls live from GitHub and shows each repo's
  primary language, star count, and last-updated time.
- Project cards with generative cover art, a cursor-follow glow, and a subtle
  pointer tilt; filters for Project, Pitch, Fun, and Researches/Articles work,
  plus search and sorting.
- A live GitHub stats strip (projects, repositories synced, languages, stars)
  with count-up animation.
- Manual project entries merge with the GitHub data and can span multiple
  categories (for example, SafeWalk appears under Project, Pitch, and
  Researches/Articles with links to the source, live site, Loom walkthrough,
  and Medium article).
- Gradient scroll-progress indicator, back-to-top control, and contact and
  social links.
- All motion respects `prefers-reduced-motion`.

## Tech Stack

- Next.js App Router (14)
- TypeScript
- Tailwind CSS
- Framer Motion
- three.js (@react-three/fiber, @react-three/drei)
- Geist font
- Lucide React
- Vercel

## Project Structure

- `app/`: App Router pages, layout, global styles, and API routes
  (`app/api/projects`).
- `components/`: Portfolio sections, navigation, cards, backgrounds, and
  motion primitives (aurora, scroll progress, magnetic, count-up).
- `components/ui/`: Shared UI primitives.
- `lib/`: GitHub fetching, project data and categories, language colors,
  constants, and utilities.
- `public/`: Static images, icons, and project assets.

## Environment Variables

The site works with no configuration. Projects are fetched from the public
GitHub API for the configured username (`lib/projects.ts`).

- `GITHUB_TOKEN` (optional): a GitHub token raises the API rate limit from 60
  to 5,000 requests/hour. Without it, the app relies on hourly caching
  (ISR) and a graceful fallback, so the projects list still renders.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment

This project is deployed on Vercel and served at `https://bornaba.com`.
GitHub data is cached and revalidated hourly (ISR); `/api/projects` serves a
fresh fetch for the client-side retry path.

## License

This project is proprietary and all rights are reserved. No copying, reuse,
redistribution, or modification is permitted without written permission.
