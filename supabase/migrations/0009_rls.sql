-- 0009_rls.sql
do $$
declare
  r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', r.tablename);
  end loop;
end $$;

-- ---------- public read ----------
drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null);

drop policy if exists "public read page translations" on public.page_translations;
create policy "public read page translations" on public.page_translations
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.pages p
      where p.id = page_id and p.status = 'published' and p.deleted_at is null
    )
  );

drop policy if exists "public read news categories" on public.news_categories;
create policy "public read news categories" on public.news_categories
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "public read category translations" on public.news_category_translations;
create policy "public read category translations" on public.news_category_translations
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "public read news" on public.news;
create policy "public read news" on public.news
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null and published_at <= now());

drop policy if exists "public read news translations" on public.news_translations;
create policy "public read news translations" on public.news_translations
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.news n
      where n.id = news_id and n.status = 'published' and n.deleted_at is null
    )
  );

drop policy if exists "public read conferences" on public.conferences;
create policy "public read conferences" on public.conferences
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null);

drop policy if exists "public read conference translations" on public.conference_translations;
create policy "public read conference translations" on public.conference_translations
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.conferences c
      where c.id = conference_id and c.status = 'published' and c.deleted_at is null
    )
  );

drop policy if exists "public read conference dates" on public.conference_dates;
create policy "public read conference dates" on public.conference_dates
  for select to anon, authenticated
  using (exists (select 1 from public.conferences c where c.id = conference_id and c.status = 'published'));

drop policy if exists "public read rooms" on public.rooms;
create policy "public read rooms" on public.rooms
  for select to anon, authenticated
  using (exists (select 1 from public.conferences c where c.id = conference_id and c.status = 'published'));

drop policy if exists "public read session types" on public.session_types;
create policy "public read session types" on public.session_types
  for select to anon, authenticated using (true);

drop policy if exists "public read tracks" on public.tracks;
create policy "public read tracks" on public.tracks
  for select to anon, authenticated using (true);

drop policy if exists "public read sessions" on public.sessions;
create policy "public read sessions" on public.sessions
  for select to anon, authenticated
  using (
    status = 'published' and deleted_at is null
    and exists (select 1 from public.conferences c where c.id = conference_id and c.status = 'published')
  );

drop policy if exists "public read session translations" on public.session_translations;
create policy "public read session translations" on public.session_translations
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (select 1 from public.sessions s where s.id = session_id and s.status = 'published')
  );

drop policy if exists "public read presentations" on public.presentations;
create policy "public read presentations" on public.presentations
  for select to anon, authenticated
  using (
    status = 'published' and deleted_at is null
    and exists (select 1 from public.sessions s where s.id = session_id and s.status = 'published')
  );

drop policy if exists "public read presentation translations" on public.presentation_translations;
create policy "public read presentation translations" on public.presentation_translations
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (select 1 from public.presentations pr where pr.id = presentation_id and pr.status = 'published')
  );

drop policy if exists "public read people" on public.people;
create policy "public read people" on public.people
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null);

drop policy if exists "public read person translations" on public.person_translations;
create policy "public read person translations" on public.person_translations
  for select to anon, authenticated using (status = 'published');

drop policy if exists "public read session people" on public.session_people;
create policy "public read session people" on public.session_people
  for select to anon, authenticated using (true);

drop policy if exists "public read presentation people" on public.presentation_people;
create policy "public read presentation people" on public.presentation_people
  for select to anon, authenticated using (true);

drop policy if exists "public read documents" on public.conference_documents;
create policy "public read documents" on public.conference_documents
  for select to anon, authenticated
  using (
    is_public = true
    and exists (select 1 from public.conferences c where c.id = conference_id and c.status = 'published')
  );

drop policy if exists "public read sponsors" on public.sponsors;
create policy "public read sponsors" on public.sponsors
  for select to anon, authenticated using (true);

drop policy if exists "public read conference sponsors" on public.conference_sponsors;
create policy "public read conference sponsors" on public.conference_sponsors
  for select to anon, authenticated using (true);

drop policy if exists "public read legacy" on public.legacy_sites;
create policy "public read legacy" on public.legacy_sites
  for select to anon, authenticated using (status = 'published');

drop policy if exists "public read media" on public.media;
create policy "public read media" on public.media
  for select to anon, authenticated using (visibility = 'public');

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "public insert contact" on public.contact_requests;
create policy "public insert contact" on public.contact_requests
  for insert to anon, authenticated with check (status = 'new');

-- ---------- self service ----------
drop policy if exists "self read profile" on public.profiles;
create policy "self read profile" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "self update profile" on public.profiles;
create policy "self update profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------- admin policies ----------
drop policy if exists "admin pages" on public.pages;
create policy "admin pages" on public.pages
  for all to authenticated
  using (public.has_permission('page.read'))
  with check (public.has_permission('page.write'));

drop policy if exists "admin page translations" on public.page_translations;
create policy "admin page translations" on public.page_translations
  for all to authenticated
  using (public.has_permission('page.read'))
  with check (public.has_permission('page.write'));

drop policy if exists "admin news" on public.news;
create policy "admin news" on public.news
  for all to authenticated
  using (public.has_permission('news.read'))
  with check (public.has_permission('news.write'));

drop policy if exists "admin news translations" on public.news_translations;
create policy "admin news translations" on public.news_translations
  for all to authenticated
  using (public.has_permission('news.read'))
  with check (public.has_permission('news.write'));

drop policy if exists "admin news categories" on public.news_categories;
create policy "admin news categories" on public.news_categories
  for all to authenticated
  using (public.has_permission('news.read'))
  with check (public.has_permission('news.write'));

drop policy if exists "admin category translations" on public.news_category_translations;
create policy "admin category translations" on public.news_category_translations
  for all to authenticated
  using (public.has_permission('news.read'))
  with check (public.has_permission('news.write'));

drop policy if exists "admin news related" on public.news_related;
create policy "admin news related" on public.news_related
  for all to authenticated
  using (public.has_permission('news.read'))
  with check (public.has_permission('news.write'));

drop policy if exists "admin conferences" on public.conferences;
create policy "admin conferences" on public.conferences
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('conference.write'));

drop policy if exists "admin conference translations" on public.conference_translations;
create policy "admin conference translations" on public.conference_translations
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('conference.write'));

drop policy if exists "admin conference dates" on public.conference_dates;
create policy "admin conference dates" on public.conference_dates
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('conference.write'));

drop policy if exists "admin rooms" on public.rooms;
create policy "admin rooms" on public.rooms
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin tracks" on public.tracks;
create policy "admin tracks" on public.tracks
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin session types" on public.session_types;
create policy "admin session types" on public.session_types
  for all to authenticated
  using (public.has_permission('programme.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin sessions" on public.sessions;
create policy "admin sessions" on public.sessions
  for all to authenticated
  using (public.has_permission('programme.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin session translations" on public.session_translations;
create policy "admin session translations" on public.session_translations
  for all to authenticated
  using (public.has_permission('programme.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin presentations" on public.presentations;
create policy "admin presentations" on public.presentations
  for all to authenticated
  using (public.has_permission('programme.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin presentation translations" on public.presentation_translations;
create policy "admin presentation translations" on public.presentation_translations
  for all to authenticated
  using (public.has_permission('programme.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin session people" on public.session_people;
create policy "admin session people" on public.session_people
  for all to authenticated
  using (public.has_permission('programme.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin presentation people" on public.presentation_people;
create policy "admin presentation people" on public.presentation_people
  for all to authenticated
  using (public.has_permission('programme.read'))
  with check (public.has_permission('programme.write'));

drop policy if exists "admin people" on public.people;
create policy "admin people" on public.people
  for all to authenticated
  using (public.has_permission('person.read'))
  with check (public.has_permission('person.write'));

drop policy if exists "admin person translations" on public.person_translations;
create policy "admin person translations" on public.person_translations
  for all to authenticated
  using (public.has_permission('person.read'))
  with check (public.has_permission('person.write'));

drop policy if exists "admin media" on public.media;
create policy "admin media" on public.media
  for all to authenticated
  using (public.has_permission('media.read'))
  with check (public.has_permission('media.upload'));

drop policy if exists "admin settings" on public.site_settings;
create policy "admin settings" on public.site_settings
  for all to authenticated
  using (public.has_permission('settings.read'))
  with check (public.has_permission('settings.write'));

drop policy if exists "admin documents" on public.conference_documents;
create policy "admin documents" on public.conference_documents
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('conference.write'));

drop policy if exists "admin sponsors" on public.sponsors;
create policy "admin sponsors" on public.sponsors
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('conference.write'));

drop policy if exists "admin conference sponsors" on public.conference_sponsors;
create policy "admin conference sponsors" on public.conference_sponsors
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('conference.write'));

drop policy if exists "admin legacy" on public.legacy_sites;
create policy "admin legacy" on public.legacy_sites
  for all to authenticated
  using (public.has_permission('conference.read'))
  with check (public.has_permission('conference.write'));

drop policy if exists "admin contact" on public.contact_requests;
create policy "admin contact" on public.contact_requests
  for select to authenticated using (public.has_permission('contact.read'));

drop policy if exists "admin update contact" on public.contact_requests;
create policy "admin update contact" on public.contact_requests
  for update to authenticated
  using (public.has_permission('contact.update'))
  with check (public.has_permission('contact.update'));

drop policy if exists "admin contact notes" on public.contact_notes;
create policy "admin contact notes" on public.contact_notes
  for all to authenticated
  using (public.has_permission('contact.read'))
  with check (public.has_permission('contact.update'));

drop policy if exists "admin profiles" on public.profiles;
create policy "admin profiles" on public.profiles
  for select to authenticated using (public.has_permission('user.read'));

drop policy if exists "admin update profiles" on public.profiles;
create policy "admin update profiles" on public.profiles
  for update to authenticated
  using (public.has_permission('user.role.update'))
  with check (public.has_permission('user.role.update'));

drop policy if exists "admin roles" on public.roles;
create policy "admin roles" on public.roles
  for select to authenticated using (public.has_permission('user.read'));

drop policy if exists "admin permissions" on public.permissions;
create policy "admin permissions" on public.permissions
  for select to authenticated using (public.has_permission('user.read'));

drop policy if exists "admin role permissions" on public.role_permissions;
create policy "admin role permissions" on public.role_permissions
  for select to authenticated using (public.has_permission('user.read'));

drop policy if exists "admin user roles" on public.user_roles;
create policy "admin user roles" on public.user_roles
  for all to authenticated
  using (public.has_permission('user.read'))
  with check (public.has_permission('user.role.update'));

drop policy if exists "admin audit" on public.audit_logs;
create policy "admin audit" on public.audit_logs
  for select to authenticated using (public.has_permission('audit.read'));

-- ---------- grants ----------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
