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

   See [.env.example](.env.example) for every variable. At minimum for full behavior set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` (production base URL, used for magic links and OAuth redirects). Step-by-step Supabase Auth setup (providers, redirect URLs, production checklist) is in **[docs/supabase-auth-setup.md](docs/supabase-auth-setup.md)**.

4. Apply database migrations to your Supabase project (SQL under `supabase/migrations/`). Use the Supabase CLI or paste/run migrations in the SQL editor in the dashboard, following your usual workflow. The admin **Load sample data** control and **Admin → Resume** both need `resume_versions` and related tables with RLS; if sample load fails, open **Admin → Resume**—the page shows the underlying Supabase error (often a skipped migration or RLS issue).

5. **Optional — default admin via `.env.local` (development only):** Set `DEV_ADMIN_EMAIL` and `DEV_ADMIN_PASSWORD` to match a real Supabase Auth user. In the Supabase dashboard, enable **Authentication → Providers → Email** with password sign-in (not magic link only), then create that user under **Authentication → Users** (or sign up once through your project). Run `npm run dev` (`NODE_ENV` must be `development`), open `/admin/login`, and use **Sign in with dev credentials**. Credentials are read **only on the server** from `.env.local`; they are never sent to the browser as public env vars. The `POST /api/auth/dev-login` handler returns 404 when `NODE_ENV` is not `development` (including `npm run start` and Vercel). **Do not** set `DEV_ADMIN_*` in production environments.

## Production setup

Use the **same Supabase project** (or a dedicated production project) with migrations applied before traffic hits the app.

### Environment variables on the host

Configure the same keys as [.env.example](.env.example) in your hosting provider’s environment settings (for example **Vercel → Project → Settings → Environment Variables**), scoped to **Production** (and Preview if you want staging to work end-to-end):

| Variable | Production notes |
| -------- | ------------------ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `NEXT_PUBLIC_SITE_URL` | **Required for auth:** the public site origin with no trailing slash, e.g. `https://your-domain.com`. Must match what you register in Supabase (below). Used for magic links and OAuth redirects outside the browser. |
| `NEXT_PUBLIC_STORAGE_BUCKET` | Optional; defaults to `portfolio-media` if unset—must match your Storage bucket name |
| `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` | Optional; often set automatically on Vercel for production URL hints |
| `DEV_ADMIN_EMAIL` / `DEV_ADMIN_PASSWORD` | **Do not set** in production. Local development shortcut only (see Install step 5). |

Redeploy after changing environment variables so the Next.js build picks up `NEXT_PUBLIC_*` values used at build time where applicable.

### Supabase (production)

1. **Auth → URL configuration**
   - **Site URL:** your production origin (e.g. `https://your-domain.com`).
   - **Redirect URLs:** include your OAuth/magic-link callback, e.g. `https://your-domain.com/auth/callback` (and preview URLs like `https://your-project.vercel.app/auth/callback` if you use Preview deployments with Supabase).

2. **Auth providers:** enable and configure Email, GitHub, Google, etc., in the Supabase dashboard; add the same production (and preview) origins to any provider “authorized redirect URI” fields if required.

3. **Database:** run all `supabase/migrations/*.sql` against the production database (CLI linked project or SQL editor).

4. **Storage:** if you use the media library, ensure the `portfolio-media` bucket (or your `NEXT_PUBLIC_STORAGE_BUCKET` name) exists and matches migration policies.

### Deploy on Vercel (recommended)

1. Import the Git repository in [Vercel](https://vercel.com/).
2. Framework preset **Next.js**; install command `npm ci`; build command `npm run build`; output is handled by Next.js automatically.
3. Add the environment variables above for Production (and Preview as needed).
4. Deploy, then complete **Claim site** / admin login flows against the production URL.

[Vercel Analytics](https://vercel.com/docs/analytics) and Speed Insights are wired in the app; they activate when the project runs on Vercel with those products enabled.

### Self-hosted Node

On a server with Node.js 20+:

```bash
npm ci
npm run build
```

Set the same environment variables in the process environment (not only `.env.local`), then start:

```bash
npm run start
```

Use a reverse proxy (TLS), a process manager (systemd, PM2, etc.), and your provider’s guidance for zero-downtime deploys.

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
