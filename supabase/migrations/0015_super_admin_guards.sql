-- 0015_super_admin_guards.sql
create or replace function public.guard_profile_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_super_admin() then
    if exists (
      select 1
      from public.user_roles ur
      join public.roles r on r.id = ur.role_id
      where ur.user_id = old.id and r.code = 'super_admin'
    ) then
      raise exception 'Cannot modify a Super Admin profile';
    end if;
  end if;

  if new.status is distinct from old.status
     and auth.uid() is not null
     and not public.is_super_admin()
     and not public.has_permission('user.role.update') then
    raise exception 'Not allowed to change profile status';
  end if;

  return new;
end;
$$;

create or replace function public.guard_user_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role_id uuid;
  v_is_super boolean;
begin
  if auth.uid() is null or public.is_super_admin() then
    return coalesce(new, old);
  end if;

  v_role_id := case when tg_op = 'DELETE' then old.role_id else new.role_id end;

  select exists (
    select 1 from public.roles where id = v_role_id and code = 'super_admin'
  ) into v_is_super;

  if v_is_super then
    raise exception 'Only a Super Admin can change Super Admin roles';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists guard_user_roles on public.user_roles;
create trigger guard_user_roles
  before insert or update or delete on public.user_roles
  for each row execute function public.guard_user_roles();
