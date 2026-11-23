-- 0001_extensions_and_enums.sql
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'locale') then
    create type public.locale as enum ('vi', 'en');
  end if;
  if not exists (select 1 from pg_type where typname = 'translation_status') then
    create type public.translation_status as enum
      ('missing', 'draft', 'pending_review', 'published', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('draft', 'published', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'conference_status') then
    create type public.conference_status as enum ('draft', 'published', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'assignment_role') then
    create type public.assignment_role as enum
      ('chair', 'co_chair', 'discussant', 'moderator', 'presenter', 'invited_speaker');
  end if;
  if not exists (select 1 from pg_type where typname = 'contact_status') then
    create type public.contact_status as enum ('new', 'in_progress', 'resolved', 'spam');
  end if;
  if not exists (select 1 from pg_type where typname = 'legacy_status') then
    create type public.legacy_status as enum ('draft', 'published', 'archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'media_visibility') then
    create type public.media_visibility as enum ('public', 'private');
  end if;
end $$;
