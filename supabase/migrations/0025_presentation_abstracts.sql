-- 0025: per-presentation abstract files (HTML/PDF) mapped from the 2026 source.
-- Binary files live in Storage/local; only metadata/paths are stored here.

alter table public.presentations
  add column if not exists abstract_file_path text;
alter table public.presentations
  add column if not exists abstract_storage_bucket text;
alter table public.presentations
  add column if not exists abstract_storage_path text;
alter table public.presentations
  add column if not exists abstract_format text;
alter table public.presentations
  add column if not exists abstract_source_file text;

create index if not exists presentations_abstract_idx
  on public.presentations (legacy_pid)
  where abstract_file_path is not null or abstract_storage_path is not null;
