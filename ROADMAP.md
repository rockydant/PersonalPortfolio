# Personal Portfolio + Resume CMS — roadmap

Aligned with `src/personal-portfolio-platform-instructions.md` and patterns from the Seloros stack (Next.js, Supabase SSR, Tailwind v4).

## Phase 0 — Foundation (current)

- [x] Repo rules (`work-log`, `confirmation-first`) and work log
- [x] Next.js App Router, TypeScript, Tailwind v4, ESLint (Next core-web-vitals)
- [x] Supabase client utilities (browser, server, middleware session refresh)
- [x] Initial database migration: `portfolio_projects`, `resume_versions`, `resume_experience`, `resume_skills`, `contact_inquiries`, `blog_posts`
- [x] Public page stubs: Home, Resume, Projects, Experience, Skills, Blog, About, Contact
- [x] Admin shell: dashboard placeholder, login route placeholder, setup wizard steps (UI)

## Phase 1 — Auth and admin access

- [x] Supabase Auth (email magic link + GitHub + Google)
- [x] RLS: `profiles`, `site_settings` owner, tightened `contact_inquiries` (migration `20260512000000_*`)
- [x] Protect `/admin/*` via `src/proxy.ts` when Supabase env is set
- [x] Admin layout, sign-out, **Claim site** banner for first owner

## Phase 2 — CMS modules

- [x] Resume CMS (primary version, headline/summary, experience + skills CRUD)
- [x] Project CMS (list, create, edit, delete; featured, GitHub URL, publish, sort)
- [x] Blog CMS (list, create, edit, delete; draft/publish, slug; plain-text body)
- [x] Media library (Supabase Storage bucket `portfolio-media`, policies, admin upload/list/delete)
- [x] Contact inquiries (public API + admin list + mark read)

## Phase 3 — Public site consumption

- [x] Public routes read published data (`revalidate` 120s on key pages)
- [x] Resume PDF export (`GET /api/resume/pdf` from published resume via `@react-pdf/renderer`)
- [x] SEO: `sitemap.ts`, `robots.ts`, per-post `generateMetadata` on `/blog/[slug]`

## Phase 4 — Setup wizard and launch

- [x] Persist wizard step in `setup_progress` (payload reserved for richer fields)
- [x] Launch checklist copy in wizard final step
- [x] `@vercel/analytics` + `@vercel/speed-insights` in root layout; deploy on Vercel for data

## Phase 5 — Growth

- [x] Analytics dashboard (`/admin/analytics`: inquiry counts + Vercel guidance; page views in Vercel UI)
- [x] Persona / SEO positioning blocks on home (`PersonaHighlights` — executive, CTO, AI consultant lanes)

## Backlog (optional)

- [x] Rich text or Markdown rendering for blog bodies (`marked` + `sanitize-html`, `BlogMarkdownBody`)
- [x] Per-route dynamic OG images (`/blog/[slug]/opengraph-image.tsx` + metadata `openGraph.images`)
- [x] `useFormState` for admin create flows (projects + blog) with inline error/success messages

### Further ideas

- [ ] `useFormState` on edit forms and other admin mutations; toast library
- [ ] Markdown preview split-pane in admin blog editor
