-- 0003_media_settings.sql
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media-public',
  path text not null,
  file_name text,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt_vi text,
  alt_en text,
  caption_vi text,
  caption_en text,
  visibility public.media_visibility not null default 'public',
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);
