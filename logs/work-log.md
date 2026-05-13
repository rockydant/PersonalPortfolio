# Work log

## 2026-05-11 — Bootstrap platform scaffold

- **Objective:** Copy Seloros Cursor rules, add roadmap, scaffold Next.js + Tailwind + Supabase per `src/personal-portfolio-platform-instructions.md`.
- **Actions:** Added `.cursor/rules`, initial SQL migration for core tables, public route stubs, admin shell with setup wizard UI, Supabase client helpers, middleware session refresh, `ROADMAP.md`.
- **Files:** `.cursor/rules/*.mdc`, `logs/work-log.md`, `ROADMAP.md`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/**/*`, `supabase/migrations/*`, `.env.example`, `.gitignore`.
- **Verification:** `npm install`, `npm run build`, and `npm run lint` succeeded (Next.js 16.2.6, `src/proxy.ts` session + admin gate).
- **Follow-ups:** Wire Supabase project + run migration; implement auth and CRUD; tighten `contact_inquiries` update RLS to admin-only; Vercel deploy.

## 2026-05-11 — Admin auth (magic link + OAuth)

- **Objective:** Implement both email magic link and GitHub/Google OAuth for `/admin/login`, with safe post-login redirects and sign-out.
- **Actions:** Added `GET /auth/callback` (`exchangeCodeForSession`), `AdminLoginForm`, `AdminSignOut`, `safeInternalPath` helper, proxy updates for `next` param, `.env.example` `NEXT_PUBLIC_SITE_URL`, `/auth/auth-code-error` page.
- **Files:** `src/app/auth/callback/route.ts`, `src/app/auth/auth-code-error/page.tsx`, `src/components/admin-login-form.tsx`, `src/components/admin-sign-out.tsx`, `src/lib/auth-redirect.ts`, `src/app/admin/login/page.tsx`, `src/app/admin/(panel)/layout.tsx`, `src/proxy.ts`, `.env.example`.
- **Verification:** `npm run build` succeeded.
- **Follow-ups:** In Supabase Dashboard enable Email + GitHub + Google providers; add redirect URLs; set `NEXT_PUBLIC_SITE_URL` in production.

## 2026-05-11 — CMS, public reads, owner model, SEO

- **Objective:** Continue roadmap Phases 1–4: profiles/site owner/contact RLS, admin CRUD, public Supabase-backed pages, setup persistence, sitemap/robots.
- **Actions:** Added migration `20260512000000_profiles_site_owner_setup.sql`; server actions for projects, blog, resume, inquiries, setup; claim-site banner + `lib/site-actions.ts`; wired `(site)` pages + `/blog/[slug]`; admin edit routes; dashboard counts; `sitemap.ts` / `robots.ts`; form actions return `void` where required by Next form types.
- **Verification:** `npm run build` succeeded.
- **Follow-ups:** Run new migration on Supabase; Storage-based media uploads; PDF resume; `@vercel/analytics`; richer setup `payload` and form error surfacing.

## 2026-05-11 — Roadmap: media, PDF, Vercel instrumentation, analytics UI, persona blocks

- **Objective:** Close remaining roadmap items: Storage media library, resume PDF, Vercel analytics/speed insights, admin analytics page, persona/SEO home blocks.
- **Actions:** Migration `20260513000000_portfolio_media_storage.sql`; `MediaLibrary` client; `PORTFOLIO_MEDIA_BUCKET`; `GET /api/resume/pdf` (Node runtime) + `ResumePdfDocument`; root `Analytics`/`SpeedInsights`; `metadataBase` + Open Graph/Twitter defaults; `/admin/analytics`; `PersonaHighlights` on home; resume “Download PDF”; robots disallow `/api/`.
- **Verification:** `npm run build` succeeded (after `Uint8Array` body fix for PDF route).
- **Follow-ups:** Run Storage migration; tune `allowed_mime_types`; richer charts if you add a query warehouse.

## 2026-05-11 — SEO + DX polish

- **Objective:** Verify build, tighten SEO metadata, enable `next/image` for Supabase Storage hosts, surface analytics from dashboard.
- **Actions:** Default `src/app/opengraph-image.tsx`; `next.config.ts` `images.remotePatterns` from `NEXT_PUBLIC_SUPABASE_URL`; blog post `openGraph`/`twitter` in `generateMetadata`; dashboard link to `/admin/analytics`.
- **Verification:** `npm run build` succeeded.
- **Follow-ups:** Per-post OG art; `next/image` in `MediaLibrary` instead of raw `img` if desired.

## 2026-05-11 — Roadmap backlog: Markdown blog, dynamic OG, useFormState

- **Objective:** Clear remaining roadmap backlog items (Markdown + sanitize, per-post OG image, form error UX) and align with prior work-log follow-ups.
- **Actions:** Added `src/lib/markdown.ts` (`marked` + `sanitize-html`), `BlogMarkdownBody`, `.md-content` styles; `blog/[slug]/opengraph-image.tsx` and `openGraph.images` in post metadata; `createProjectFormAction` / `CreateProjectForm` and `createBlogPostFormAction` / `CreateBlogPostForm` with `useFormState` + `useFormStatus`; split form state into non–`use server` modules (`create-project-state.ts`, `create-blog-state.ts`) per Next export rules.
- **Files:** `package.json`, `src/lib/markdown.ts`, `src/components/blog-markdown-body.tsx`, `src/app/globals.css`, `src/app/(site)/blog/[slug]/page.tsx`, `src/app/(site)/blog/[slug]/opengraph-image.tsx`, `src/app/admin/(panel)/projects/*`, `src/app/admin/(panel)/blog/*`.
- **Verification:** `npm run build` succeeded.
- **Follow-ups:** Edit-route `useFormState`; admin Markdown preview; optional `next/image` in media grid.

## 2026-05-11 — README

- **Objective:** Add root `README.md` with install and test/verification instructions.
- **Actions:** Documented prerequisites, `npm ci` / env copy, migrations note, scripts table, lint + build + manual dev verification (no `npm test` in repo).
- **Files:** `README.md`, `logs/work-log.md`.
- **Verification:** `npm run build` succeeded; `npm run lint` reports 1 existing error in `src/components/media-library.tsx` (`react-hooks/set-state-in-effect`).
- **Follow-ups:** Add Jest/Vitest/Playwright and a `test` script if you want automated tests.

## 2026-05-11 — README production setup

- **Objective:** Document production deployment (env, Supabase, Vercel, optional self-host).
- **Actions:** Added “Production setup” to `README.md` with env table, Supabase Auth URLs, migrations/Storage, Vercel steps, Node self-host.
- **Files:** `README.md`, `logs/work-log.md`.
- **Verification:** N/A (documentation).
- **Follow-ups:** None.

## 2026-05-11 — Dev admin credentials from .env.local

- **Objective:** Optional local default admin sign-in driven by `DEV_ADMIN_EMAIL` / `DEV_ADMIN_PASSWORD` in `.env.local`.
- **Actions:** Added `POST /api/auth/dev-login` (development-only), `GET` 405; admin login page shows dev quick sign-in when vars set; documented in `.env.example` and `README.md`.
- **Files:** `src/app/api/auth/dev-login/route.ts`, `src/app/admin/login/page.tsx`, `src/components/admin-login-form.tsx`, `.env.example`, `README.md`, `logs/work-log.md`.
- **Verification:** `npm run build` succeeded.
- **Follow-ups:** None.

## 2026-05-11 — Supabase auth setup guide (markdown)

- **Objective:** Detailed markdown instructions for configuring admin sign-in (magic link, GitHub, Google) with Supabase.
- **Actions:** Added `docs/supabase-auth-setup.md` (URL config, providers, env vars, production checklist, troubleshooting, dev password optional section).
- **Files:** `docs/supabase-auth-setup.md`, `README.md`, `logs/work-log.md`.
- **Verification:** N/A (documentation).
- **Follow-ups:** Linked from `README.md` Install step 3.

## 2026-05-13 — Dashboard Bao Dang sample data

- **Objective:** Admin dashboard buttons to load sample CMS data from `bao-dang.md` profile pack and remove tagged sample rows.
- **Actions:** Added `bao-dang-constants`, `bao-dang-profile-data`, `bao-dang-sample-actions` (seed + cleanup), `DashboardBaoDangSampleCard` on admin dashboard; sample slugs + `resume_versions.content._sampleSeed` for safe cleanup; resume seed blocked if primary resume already has unrelated content.
- **Files:** `src/lib/sample-data/*`, `src/components/dashboard-bao-dang-sample-card.tsx`, `src/app/admin/(panel)/page.tsx`, `logs/work-log.md`.
- **Verification:** `npm run build` succeeded.
- **Follow-ups:** PDF resume is not parsed; data mirrors repo markdown only.
