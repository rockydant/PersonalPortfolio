-- Core schema for Personal Portfolio + Resume CMS
-- Run via Supabase CLI or SQL editor after linking the project.

create extension if not exists "pgcrypto";

-- --- portfolio_projects ---
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  body text,
  github_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

-- --- resume ---
create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Primary resume',
  is_primary boolean not null default false,
  is_published boolean not null default false,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_experience (
  id uuid primary key default gen_random_uuid(),
  resume_version_id uuid not null references public.resume_versions (id) on delete cascade,
  company text not null,
  role_title text not null,
  location text,
  start_date date,
  end_date date,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.resume_skills (
  id uuid primary key default gen_random_uuid(),
  resume_version_id uuid not null references public.resume_versions (id) on delete cascade,
  category text,
  name text not null,
  proficiency text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- --- blog ---
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  title text not null,
  excerpt text,
  body text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

-- --- contact ---
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- --- RLS ---
alter table public.portfolio_projects enable row level security;
alter table public.resume_versions enable row level security;
alter table public.resume_experience enable row level security;
alter table public.resume_skills enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_inquiries enable row level security;

-- Portfolio: public reads published; owners full access
create policy "portfolio_select_published"
  on public.portfolio_projects for select
  using (published = true);

create policy "portfolio_owner_all"
  on public.portfolio_projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Resume tree
create policy "resume_versions_select_published"
  on public.resume_versions for select
  using (is_published = true);

create policy "resume_versions_owner_all"
  on public.resume_versions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "resume_experience_select_via_published_parent"
  on public.resume_experience for select
  using (
    exists (
      select 1 from public.resume_versions rv
      where rv.id = resume_version_id and rv.is_published = true
    )
  );

create policy "resume_experience_owner_all"
  on public.resume_experience for all
  using (
    exists (
      select 1 from public.resume_versions rv
      where rv.id = resume_version_id and rv.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.resume_versions rv
      where rv.id = resume_version_id and rv.user_id = auth.uid()
    )
  );

create policy "resume_skills_select_via_published_parent"
  on public.resume_skills for select
  using (
    exists (
      select 1 from public.resume_versions rv
      where rv.id = resume_version_id and rv.is_published = true
    )
  );

create policy "resume_skills_owner_all"
  on public.resume_skills for all
  using (
    exists (
      select 1 from public.resume_versions rv
      where rv.id = resume_version_id and rv.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.resume_versions rv
      where rv.id = resume_version_id and rv.user_id = auth.uid()
    )
  );

-- Blog
create policy "blog_select_published"
  on public.blog_posts for select
  using (published = true);

create policy "blog_owner_all"
  on public.blog_posts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Contact: public submit; authenticated read/update (admin)
create policy "contact_insert_public"
  on public.contact_inquiries for insert
  with check (true);

create policy "contact_select_authenticated"
  on public.contact_inquiries for select
  using (auth.uid() is not null);

create policy "contact_update_authenticated"
  on public.contact_inquiries for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
