-- Public portfolio media bucket + per-user path prefix (first path segment = auth.uid())

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760,
  array[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio_media_public_read" on storage.objects;
drop policy if exists "portfolio_media_insert_own" on storage.objects;
drop policy if exists "portfolio_media_update_own" on storage.objects;
drop policy if exists "portfolio_media_delete_own" on storage.objects;

create policy "portfolio_media_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio-media');

create policy "portfolio_media_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "portfolio_media_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'portfolio-media'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "portfolio_media_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and split_part(name, '/', 1) = auth.uid()::text
  );
