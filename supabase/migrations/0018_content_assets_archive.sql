-- 0018: conference document metadata, news attachments, archive metadata.
-- Idempotent. No drops, no destructive changes.

alter table public.conference_documents
  add column if not exists file_path text;
alter table public.conference_documents
  add column if not exists file_format text;
alter table public.conference_documents
  add column if not exists description_vi text;
alter table public.conference_documents
  add column if not exists description_en text;

create index if not exists conference_documents_type_sort_idx
  on public.conference_documents (conference_id, doc_type, sort);

create table if not exists public.news_attachments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news(id) on delete cascade,
  title_vi text,
  title_en text,
  file_path text not null,
  file_format text,
  sort integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists news_attachments_news_idx
  on public.news_attachments (news_id, sort);

alter table public.news_attachments enable row level security;

drop policy if exists "news_attachments_public_read" on public.news_attachments;
create policy "news_attachments_public_read"
  on public.news_attachments
  for select
  to anon, authenticated
  using (
    is_public
    and exists (
      select 1 from public.news n
      where n.id = news_attachments.news_id
        and n.status = 'published'
        and n.deleted_at is null
    )
  );

drop policy if exists "news_attachments_admin_write" on public.news_attachments;
create policy "news_attachments_admin_write"
  on public.news_attachments
  for all
  to authenticated
  using (public.has_permission('news.write'))
  with check (public.has_permission('news.write'));
