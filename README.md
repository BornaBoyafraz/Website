# Borna Afraz Portfolio

Live site: https://bornaba.com

## Overview

Seyedborna Boyafraz(Borna Afraz) Portfolio is a personal developer portfolio built with Next.js,
TypeScript, and Tailwind CSS. It presents profile information, featured work,
current projects, and a dynamic projects section powered by GitHub repository
data.

## Features

- Responsive hero layout with profile content and a Spline 3D scene.
- Working On and Latest sections for highlighted project updates.
- Dynamic project listing with GitHub data fetching.
- Project filters, sorting, thumbnails, and manual project entries.
- Dark mode support with a custom amber and neutral theme.
- Contact and social links.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Spline
- Lucide React
- Vercel

## Project Structure

- `app/`: App Router pages, layout, global styles, and API routes.
- `components/`: Portfolio sections, navigation, cards, and UI components.
- `components/ui/`: Shared shadcn-style UI primitives.
- `lib/`: Project data, GitHub fetching, constants, utilities, and config.
- `public/`: Static images, icons, and project assets.

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

## License

This project is proprietary and all rights are reserved. No copying, reuse,
redistribution, or modification is permitted without written permission.
