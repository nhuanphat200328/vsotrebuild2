-- 0010_seed_rbac.sql
insert into public.roles (code, name_vi, name_en) values
  ('super_admin', 'Quản trị tối cao', 'Super Admin'),
  ('admin', 'Quản trị viên', 'Admin'),
  ('editor', 'Biên tập viên', 'Editor'),
  ('viewer', 'Người xem', 'Viewer')
on conflict (code) do nothing;

insert into public.permissions (code, description) values
  ('page.read', 'Xem trang'),
  ('page.write', 'Tạo/sửa trang'),
  ('page.publish', 'Xuất bản trang'),
  ('page.delete', 'Xóa trang'),
  ('news.read', 'Xem tin tức'),
  ('news.write', 'Tạo/sửa tin tức'),
  ('news.publish', 'Xuất bản tin tức'),
  ('news.delete', 'Xóa tin tức'),
  ('conference.read', 'Xem hội nghị'),
  ('conference.write', 'Tạo/sửa hội nghị'),
  ('conference.publish', 'Xuất bản hội nghị'),
  ('conference.delete', 'Xóa hội nghị'),
  ('programme.read', 'Xem chương trình'),
  ('programme.write', 'Tạo/sửa chương trình'),
  ('programme.publish', 'Xuất bản chương trình'),
  ('programme.delete', 'Xóa phiên/báo cáo'),
  ('person.read', 'Xem diễn giả'),
  ('person.write', 'Tạo/sửa diễn giả'),
  ('person.delete', 'Xóa diễn giả'),
  ('media.read', 'Xem media'),
  ('media.upload', 'Tải media'),
  ('media.delete', 'Xóa media'),
  ('contact.read', 'Xem liên hệ'),
  ('contact.update', 'Xử lý liên hệ'),
  ('user.read', 'Xem người dùng'),
  ('user.invite', 'Mời người dùng'),
  ('user.role.update', 'Gán/thu hồi vai trò'),
  ('user.disable', 'Khóa người dùng'),
  ('settings.read', 'Xem cấu hình'),
  ('settings.write', 'Sửa cấu hình'),
  ('audit.read', 'Xem audit log')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.code = 'super_admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.code = 'admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'page.read','page.write','news.read','news.write',
  'conference.read','conference.write','programme.read','programme.write',
  'person.read','person.write','media.read','media.upload',
  'settings.read'
)
where r.code = 'editor'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'page.read','news.read','conference.read','programme.read',
  'person.read','media.read','settings.read'
)
where r.code = 'viewer'
on conflict do nothing;

-- Restrictive delete policies: permissive policies allow read, but delete must
-- require an explicit delete permission.
do $$
declare
  pair record;
begin
  for pair in
    select * from (values
      ('pages', 'page.delete'),
      ('page_translations', 'page.delete'),
      ('news', 'news.delete'),
      ('news_translations', 'news.delete'),
      ('news_categories', 'news.delete'),
      ('news_category_translations', 'news.delete'),
      ('news_related', 'news.delete'),
      ('conferences', 'conference.delete'),
      ('conference_translations', 'conference.delete'),
      ('conference_dates', 'conference.delete'),
      ('rooms', 'conference.delete'),
      ('tracks', 'conference.delete'),
      ('session_types', 'programme.delete'),
      ('sessions', 'programme.delete'),
      ('session_translations', 'programme.delete'),
      ('presentations', 'programme.delete'),
      ('presentation_translations', 'programme.delete'),
      ('session_people', 'programme.delete'),
      ('presentation_people', 'programme.delete'),
      ('people', 'person.delete'),
      ('person_translations', 'person.delete'),
      ('media', 'media.delete'),
      ('conference_documents', 'conference.delete'),
      ('sponsors', 'conference.delete'),
      ('conference_sponsors', 'conference.delete'),
      ('legacy_sites', 'conference.delete'),
      ('site_settings', 'settings.write'),
      ('contact_notes', 'contact.update')
    ) as t(tbl, perm)
  loop
    execute format('drop policy if exists %I on public.%I', 'restrict delete ' || pair.tbl, pair.tbl);
    execute format(
      'create policy %I on public.%I as restrictive for delete to authenticated using (public.has_permission(%L))',
      'restrict delete ' || pair.tbl, pair.tbl, pair.perm
    );
  end loop;
end $$;
