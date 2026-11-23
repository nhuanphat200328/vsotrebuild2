-- 0004_pages_news.sql
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  template text not null default 'default',
  status public.content_status not null default 'draft',
  published_at timestamptz,
  sort int not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.page_translations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  locale public.locale not null,
  title text,
  excerpt text,
  body jsonb,
  seo_title text,
  seo_description text,
  status public.translation_status not null default 'missing',
  updated_at timestamptz not null default now(),
  unique (page_id, locale)
);

create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status public.content_status not null default 'draft',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.news_category_translations (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.news_categories(id) on delete cascade,
  locale public.locale not null,
  name text,
  description text,
  status public.translation_status not null default 'missing',
  unique (category_id, locale)
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references public.news_categories(id) on delete set null,
  cover_media_id uuid references public.media(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.news_translations (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news(id) on delete cascade,
  locale public.locale not null,
  title text,
  excerpt text,
  body jsonb,
  seo_title text,
  seo_description text,
  status public.translation_status not null default 'missing',
  updated_at timestamptz not null default now(),
  unique (news_id, locale)
);

create table if not exists public.news_related (
  news_id uuid not null references public.news(id) on delete cascade,
  related_news_id uuid not null references public.news(id) on delete cascade,
  sort int not null default 0,
  primary key (news_id, related_news_id),
  check (news_id <> related_news_id)
);

create index if not exists pages_status_idx on public.pages (status);
create index if not exists news_status_published_idx on public.news (status, published_at desc);
create index if not exists news_category_idx on public.news (category_id);
