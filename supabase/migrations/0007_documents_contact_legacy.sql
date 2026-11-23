-- 0007_documents_contact_legacy.sql
create table if not exists public.conference_documents (
  id uuid primary key default gen_random_uuid(),
  conference_id uuid not null references public.conferences(id) on delete cascade,
  media_id uuid references public.media(id) on delete set null,
  doc_type text not null default 'document',
  title_vi text,
  title_en text,
  sort int not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_media_id uuid references public.media(id) on delete set null,
  website_url text,
  level text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.conference_sponsors (
  conference_id uuid not null references public.conferences(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  level text,
  sort int not null default 0,
  primary key (conference_id, sponsor_id)
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  subject text,
  message text not null,
  locale public.locale not null default 'vi',
  status public.contact_status not null default 'new',
  spam_score numeric,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.contact_requests(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.legacy_sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  year int,
  title text,
  description text,
  entry_path text,
  cover_media_id uuid references public.media(id) on delete set null,
  status public.legacy_status not null default 'draft',
  has_dynamic_content boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'conferences_legacy_site_fk'
  ) then
    alter table public.conferences
      add constraint conferences_legacy_site_fk
      foreign key (legacy_site_id) references public.legacy_sites(id) on delete set null;
  end if;
end $$;

create index if not exists contact_requests_status_idx on public.contact_requests (status, created_at desc);
create index if not exists documents_conference_idx on public.conference_documents (conference_id, sort);
create index if not exists legacy_sites_year_idx on public.legacy_sites (year desc);
