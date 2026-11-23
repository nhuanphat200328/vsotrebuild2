-- 0020: allow published news without a publication date.
-- Source pages for the 2026 announcements do not expose an exact publish date,
-- so the site must not invent one. Published rows with published_at = null are
-- visible; scheduling still works for rows that do have a future timestamp.

drop policy if exists "public read news" on public.news;
create policy "public read news"
  on public.news
  for select
  to anon, authenticated
  using (
    status = 'published'
    and deleted_at is null
    and (published_at is null or published_at <= now())
  );
