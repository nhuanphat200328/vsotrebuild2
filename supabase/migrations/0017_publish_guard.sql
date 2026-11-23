-- 0017_publish_guard.sql
-- Prevent non-publishers from setting published status via direct PostgREST.
-- Service-role/server actions have auth.uid() = null and are unaffected.

create or replace function public.guard_publish_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_permission text;
begin
  if auth.uid() is null or new.status is distinct from 'published' then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.status = 'published' then
    return new;
  end if;

  v_permission := case tg_table_name
    when 'pages' then 'page.publish'
    when 'page_translations' then 'page.publish'
    when 'news' then 'news.publish'
    when 'news_translations' then 'news.publish'
    when 'sessions' then 'programme.publish'
    when 'presentations' then 'programme.publish'
    else null
  end;

  if v_permission is not null and not public.has_permission(v_permission) then
    raise exception 'Publish permission required';
  end if;
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['pages','page_translations','news','news_translations','sessions','presentations'] loop
    execute format('drop trigger if exists guard_publish_status on public.%I', t);
    execute format(
      'create trigger guard_publish_status before insert or update on public.%I
       for each row execute function public.guard_publish_status()', t
    );
  end loop;
end $$;
