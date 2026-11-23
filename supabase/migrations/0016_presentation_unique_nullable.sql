-- 0016_presentation_unique_nullable.sql
-- Allow multiple new presentations with NULL legacy_pid per session.
alter table public.presentations
  drop constraint if exists presentations_legacy_unique;

alter table public.presentations
  add constraint presentations_legacy_unique unique (session_id, legacy_pid);
