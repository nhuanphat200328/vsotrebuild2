-- 0012_migration_tracking.sql
create schema if not exists supabase_migrations;

create table if not exists supabase_migrations.schema_migrations (
  version text primary key,
  name text,
  applied_at timestamptz not null default now()
);
