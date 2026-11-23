-- 0005_conferences_people.sql
create table if not exists public.conferences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  year int not null unique,
  status public.conference_status not null default 'draft',
  start_date date,
  end_date date,
  city text,
  country text not null default 'Vietnam',
  theme_vi text,
  theme_en text,
  brand_color text,
  banner_media_id uuid references public.media(id) on delete set null,
  logo_media_id uuid references public.media(id) on delete set null,
  landing_config jsonb not null default '{}'::jsonb,
  legacy_site_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.conference_translations (
  id uuid primary key default gen_random_uuid(),
  conference_id uuid not null references public.conferences(id) on delete cascade,
  locale public.locale not null,
  name text,
  short_name text,
  intro text,
  description jsonb,
  venue_name text,
  status public.translation_status not null default 'missing',
  unique (conference_id, locale)
);

create table if not exists public.conference_dates (
  id uuid primary key default gen_random_uuid(),
  conference_id uuid not null references public.conferences(id) on delete cascade,
  date date not null,
  label_vi text,
  label_en text,
  kind text not null default 'scientific',
  sort int not null default 0,
  unique (conference_id, date)
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  conference_id uuid not null references public.conferences(id) on delete cascade,
  code text not null,
  name_vi text not null,
  name_en text,
  floor text,
  capacity int,
  sort int not null default 0,
  unique (conference_id, code)
);

create table if not exists public.session_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_vi text,
  name_en text,
  color text,
  is_break boolean not null default false
);

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  conference_id uuid references public.conferences(id) on delete cascade,
  code text not null,
  name_vi text,
  name_en text,
  color text,
  unique nulls not distinct (conference_id, code)
);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  display_name text,
  title text,
  degree text,
  position text,
  institution text,
  department text,
  city text,
  country text,
  email_public text,
  photo_media_id uuid references public.media(id) on delete set null,
  linkedin_url text,
  orcid_url text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.person_translations (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  locale public.locale not null,
  bio text,
  position text,
  institution text,
  status public.translation_status not null default 'missing',
  unique (person_id, locale)
);

create index if not exists conferences_year_idx on public.conferences (year desc);
create index if not exists rooms_conference_idx on public.rooms (conference_id, sort);
create index if not exists people_name_idx on public.people (full_name);
