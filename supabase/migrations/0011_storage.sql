-- 0011_storage.sql
insert into storage.buckets (id, name, public)
values
  ('media-public', 'media-public', true),
  ('documents', 'documents', false),
  ('legacy', 'legacy', false)
on conflict (id) do nothing;

drop policy if exists "public read media-public" on storage.objects;
create policy "public read media-public" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media-public');

drop policy if exists "authenticated upload media" on storage.objects;
create policy "authenticated upload media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('media-public', 'documents', 'legacy')
    and public.has_permission('media.upload')
  );

drop policy if exists "authenticated update media" on storage.objects;
create policy "authenticated update media" on storage.objects
  for update to authenticated
  using (public.has_permission('media.upload'))
  with check (public.has_permission('media.upload'));

drop policy if exists "authenticated delete media" on storage.objects;
create policy "authenticated delete media" on storage.objects
  for delete to authenticated
  using (public.has_permission('media.delete'));
