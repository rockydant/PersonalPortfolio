-- Profiles (1:1 with auth.users), site owner singleton, setup progress, tighter contact RLS

-- --- profiles ---
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --- site owner (single row) ---
create table if not exists public.site_settings (
  id text primary key default 'default',
  owner_user_id uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, owner_user_id)
values ('default', null)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Public read so anonymous visitors can resolve the site owner for published content.
create policy "site_settings_select_public"
  on public.site_settings for select
  using (id = 'default');

create policy "site_settings_claim_owner"
  on public.site_settings for update
  using (owner_user_id is null)
  with check (owner_user_id = auth.uid());

create policy "site_settings_owner_update"
  on public.site_settings for update
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

-- --- setup wizard persistence ---
create table if not exists public.setup_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  step_index int not null default 0,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.setup_progress enable row level security;

create policy "setup_progress_own_all"
  on public.setup_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- --- contact: replace broad authenticated policies ---
drop policy if exists "contact_select_authenticated" on public.contact_inquiries;
drop policy if exists "contact_update_authenticated" on public.contact_inquiries;

create policy "contact_select_site_owner"
  on public.contact_inquiries for select
  using (
    auth.uid() is not null
    and (
      (select owner_user_id from public.site_settings where id = 'default') is null
      or (select owner_user_id from public.site_settings where id = 'default') = auth.uid()
    )
  );

create policy "contact_update_site_owner"
  on public.contact_inquiries for update
  using (
    auth.uid() is not null
    and (
      (select owner_user_id from public.site_settings where id = 'default') is null
      or (select owner_user_id from public.site_settings where id = 'default') = auth.uid()
    )
  )
  with check (
    auth.uid() is not null
    and (
      (select owner_user_id from public.site_settings where id = 'default') is null
      or (select owner_user_id from public.site_settings where id = 'default') = auth.uid()
    )
  );

-- Backfill profiles for existing auth users (trigger only runs on new inserts)
insert into public.profiles (id, display_name)
select
  id,
  coalesce(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    split_part(email, '@', 1)
  )
from auth.users
on conflict (id) do nothing;
