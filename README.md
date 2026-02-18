# Borna B. Afraz Portfolio

## Live Demo
https://bornaba.com

## Overview
This repository contains a production-ready personal developer portfolio built with Next.js App Router, TypeScript, and Tailwind CSS. The site renders key profile sections and dynamically displays public GitHub repositories through a server-side data pipeline. It is deployed on Vercel and served through the custom domain `https://bornaba.com`.

## Features
- Dynamic project listing from the GitHub API.
- Data-layer filtering for private, forked, and explicitly hidden repositories.
- Consistent project-card presentation with thumbnail support.
- Server-side fetch with revalidation for predictable performance.
- Responsive UI and dark mode support.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Vercel (hosting and deployment)

## Architecture Overview
- `app/`: App Router entrypoints, layout, and API routes.
- `app/api/projects/route.ts`: Server endpoint used by the frontend to retrieve repositories.
- `lib/github.ts`: GitHub API integration, pagination, and repository filtering logic.
- `lib/projects.ts`: Project retrieval orchestration and GitHub username binding.
- `components/`: UI sections and reusable components, including project cards.
- `lib/projectImages.ts`: Thumbnail path resolution for repository names.
- `public/`: Static assets, including project thumbnail images.

## Adding New Project Thumbnails
Project thumbnails are served from `public/projects` using a slug-based naming convention.

1. Add a PNG file to `public/projects`.
2. Name the file using a lowercase slug derived from the repository name.
3. Ensure the mapping/resolution in `lib/projectImages.ts` can resolve that repository name.

Examples:
- `AI-Search-Agent` -> `ai-search-agent.png`
- `Calory Tracker` -> `calory-tracker.png`

Expected path format:
- `/public/projects/<slug>.png`

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
This project is deployed on Vercel.

1. Connect the repository in Vercel.
2. Use the default Next.js build settings.
3. Configure required environment variables if needed.
4. Attach the custom domain `bornaba.com`.

## Customization
- Profile text and section content: update files in `components/`.
- Contact and social metadata: update `lib/constants.ts`.
- GitHub source account: update the username in `lib/projects.ts`.
- Repository filtering rules: update `lib/github.ts`.
- Thumbnail mappings: update `lib/projectImages.ts`.

## Future Improvements
- Add automated tests for repository filtering and mapping rules.
- Add CI checks for linting and production build validation.
- Add structured SEO metadata per section/project.
- Add observability (analytics and error monitoring) for production diagnostics.

## License
No license file is currently defined in this repository. Add a `LICENSE` file to specify distribution and usage terms.
