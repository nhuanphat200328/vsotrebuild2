-- 0008_functions_triggers.sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
  tables text[] := array[
    'profiles', 'pages', 'news', 'conferences', 'people',
    'sessions', 'presentations', 'contact_requests', 'legacy_sites'
  ];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t
    );
  end loop;
end $$;

create or replace function public.has_permission(p_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid()
      and p.code = p_code
  );
$$;

revoke all on function public.has_permission(text) from public;
grant execute on function public.has_permission(text) to authenticated;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.code = 'super_admin'
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

-- Prevent non-super-admins from changing profile status directly.
create or replace function public.guard_profile_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status
     and not public.is_super_admin()
     and not public.has_permission('user.role.update') then
    raise exception 'Not allowed to change profile status';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_status on public.profiles;
create trigger guard_profile_status
  before update on public.profiles
  for each row execute function public.guard_profile_status();
