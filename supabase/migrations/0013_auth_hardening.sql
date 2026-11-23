-- 0013_auth_hardening.sql
-- Block public signup: only users created by the invitation/bootstrap flow
-- (user_metadata.vsot_invite = true) get a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'vsot_invite', '') <> 'true' then
    raise exception 'Public signup is disabled';
  end if;

  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  return new;
end;
$$;

-- One-time bootstrap. Returns true only for the first successful call.
create or replace function public.bootstrap_super_admin(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role_id uuid;
  v_exists boolean;
begin
  perform pg_advisory_xact_lock(hashtext('vsot.bootstrap.super_admin'));

  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where r.code = 'super_admin'
  ) into v_exists;

  if v_exists then
    return false;
  end if;

  select id into v_role_id from public.roles where code = 'super_admin';
  if v_role_id is null then
    raise exception 'super_admin role missing';
  end if;

  insert into public.user_roles (user_id, role_id)
  values (p_user_id, v_role_id)
  on conflict do nothing;

  return true;
end;
$$;

revoke all on function public.bootstrap_super_admin(uuid) from public;
grant execute on function public.bootstrap_super_admin(uuid) to service_role;
