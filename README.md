# Borna B. Afraz – Personal Portfolio

A professional, minimal portfolio website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Projects are automatically fetched from GitHub.

## Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **Add New** → **Project** and import your repo.
4. Configure build: 
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click **Deploy**.

Vercel will assign a public URL (e.g. `your-project.vercel.app`).

## Personal Information

Edit these files to update your details:

| What | Where |
|------|-------|
| Name, headline, bio | `components/Hero.tsx`, `components/About.tsx`, `components/Navbar.tsx` |
| **Email, social links** | `lib/constants.ts` (single source of truth) |
| GitHub username | `lib/github.ts`, `lib/projects.ts`, `app/api/projects/route.ts` |
| Profile image | Replace `public/profile.jpg` with your photo (placeholder included) |

**LinkedIn:** Set your LinkedIn URL in `lib/constants.ts` (replace `ADD_PROFILE_LINK_HERE`).

## How Projects Auto-Update

- Projects come from the GitHub API:  
  `https://api.github.com/users/BornaBoyafraz/repos?per_page=100&sort=updated`
- Fetching happens server-side in `lib/github.ts` and `lib/projects.ts`.
- Responses are cached for 1 hour (`revalidate: 3600`).
- Pagination is handled if you have more than 100 repositories.
- No manual updates needed; new repos appear after cache expiry or redeploy.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react
