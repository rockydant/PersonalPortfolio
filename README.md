# Personal Portfolio

Next.js App Router site and admin CMS for a personal portfolio, resume content, blog, and contact inquiries. Uses TypeScript, Tailwind CSS v4, Supabase (auth, Postgres, Storage), and Vercel analytics hooks.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 LTS or newer (matches `@types/node` in this repo)
- A [Supabase](https://supabase.com/) project if you want auth, the CMS, and database-backed pages (optional for a quick UI-only run if you leave public env vars unset; admin routes expect Supabase when configured)

## Install

1. Clone the repository and enter the project directory.

2. Install dependencies (this repo uses npm and includes `package-lock.json`):

   ```bash
   npm ci
   ```

   For day-to-day work after the first install, `npm install` is fine when you change dependencies.

3. Copy `.env.example` to `.env.local` and fill in values from your Supabase project (Auth → API, and your site URL for redirects). Examples:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env.local
   ```

   ```powershell
   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

   See [.env.example](.env.example) for every variable. At minimum for full behavior set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` (production base URL, used for magic links and OAuth redirects).

4. Apply database migrations to your Supabase project (SQL under `supabase/migrations/`). Use the Supabase CLI or paste/run migrations in the SQL editor in the dashboard, following your usual workflow.

## Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Next.js dev server (default port 3000) |
| `npm run build`   | Production build                                 |
| `npm run start`   | Run the production server (after `build`)        |
| `npm run lint`    | Run ESLint with the Next.js config               |

## Test and verify

This repository does not define a unit or end-to-end test runner (no `npm test` script). Use the following to validate the app locally:

1. **Lint**

   ```bash
   npm run lint
   ```

2. **Production build** (catches TypeScript and many Next.js issues):

   ```bash
   npm run build
   ```

3. **Manual smoke test** (with `.env.local` configured and migrations applied):

   ```bash
   npm run dev
   ```

   Open the app in the browser, exercise public routes, `/admin` login, and any flows you care about.

## Project layout (high level)

- `src/app/` — App Router routes (public site, admin, auth callback)
- `src/components/` — React components
- `src/lib/` — Shared utilities and server helpers
- `supabase/migrations/` — Postgres schema and RLS

More planning detail lives in [ROADMAP.md](ROADMAP.md).

## License

Private project (`"private": true` in `package.json`). Adjust if you publish the repo.
