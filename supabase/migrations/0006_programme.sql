-- 0006_programme.sql
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  conference_id uuid not null references public.conferences(id) on delete cascade,
  date_id uuid not null references public.conference_dates(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  session_type_id uuid references public.session_types(id) on delete set null,
  track_id uuid references public.tracks(id) on delete set null,
  start_time time not null,
  end_time time not null,
  program_number text,
  status public.content_status not null default 'draft',
  sort int not null default 0,
  legacy_sid text,
  is_separator boolean not null default false,
  separator_label_vi text,
  separator_label_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint sessions_time_check check (end_time > start_time),
  constraint sessions_legacy_unique unique nulls not distinct (conference_id, legacy_sid)
);

create table if not exists public.session_translations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  locale public.locale not null,
  title text,
  short_title text,
  description jsonb,
  status public.translation_status not null default 'missing',
  unique (session_id, locale)
);

create table if not exists public.presentations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  start_time time,
  end_time time,
  sort int not null default 0,
  presentation_type text,
  abstract text,
  keywords text[],
  status public.content_status not null default 'draft',
  legacy_pid text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint presentations_time_check check (
    end_time is null or start_time is null or end_time > start_time
  ),
  constraint presentations_legacy_unique unique nulls not distinct (session_id, legacy_pid)
);

create table if not exists public.presentation_translations (
  id uuid primary key default gen_random_uuid(),
  presentation_id uuid not null references public.presentations(id) on delete cascade,
  locale public.locale not null,
  title text,
  abstract text,
  status public.translation_status not null default 'missing',
  unique (presentation_id, locale)
);

create table if not exists public.session_people (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  role public.assignment_role not null,
  sort int not null default 0,
  constraint session_people_role_check check (role in ('chair', 'co_chair', 'discussant', 'moderator')),
  unique (session_id, person_id, role)
);

create table if not exists public.presentation_people (
  id uuid primary key default gen_random_uuid(),
  presentation_id uuid not null references public.presentations(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  role public.assignment_role not null,
  sort int not null default 0,
  constraint presentation_people_role_check check (role in ('presenter', 'invited_speaker')),
  unique (presentation_id, person_id, role)
);

create index if not exists sessions_conference_date_idx on public.sessions (conference_id, date_id, start_time);
create index if not exists sessions_room_time_idx on public.sessions (room_id, start_time);
create index if not exists presentations_session_idx on public.presentations (session_id, sort);
create index if not exists session_people_person_idx on public.session_people (person_id, role);
create index if not exists presentation_people_person_idx on public.presentation_people (person_id, role);
create index if not exists sessions_status_idx on public.sessions (status);
