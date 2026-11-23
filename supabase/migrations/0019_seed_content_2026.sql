-- 0019: seed VSOT 2026 news, document metadata and conference archive entries.
-- Sources: PrototypeClone/public_html/hoinghi2026 and 2027 demo/public/legacy.
-- Idempotent by slug / unique file_path.

insert into public.news_categories (slug, status, sort)
values
  ('hoi-nghi', 'published', 10),
  ('su-kien', 'published', 20),
  ('thong-bao', 'published', 30)
on conflict (slug) do update set status = excluded.status, sort = excluded.sort;

insert into public.news_category_translations (category_id, locale, name, status)
select id, 'vi', 'Hội nghị', 'published' from public.news_categories where slug = 'hoi-nghi'
on conflict (category_id, locale) do update set name = excluded.name, status = excluded.status;

insert into public.news_category_translations (category_id, locale, name, status)
select id, 'vi', 'Sự kiện', 'published' from public.news_categories where slug = 'su-kien'
on conflict (category_id, locale) do update set name = excluded.name, status = excluded.status;

insert into public.news_category_translations (category_id, locale, name, status)
select id, 'vi', 'Thông báo', 'published' from public.news_categories where slug = 'thong-bao'
on conflict (category_id, locale) do update set name = excluded.name, status = excluded.status;

insert into public.news_category_translations (category_id, locale, name, status)
select id, 'en', 'Congress', 'published' from public.news_categories where slug = 'hoi-nghi'
on conflict (category_id, locale) do update set name = excluded.name, status = excluded.status;

insert into public.news_category_translations (category_id, locale, name, status)
select id, 'en', 'Events', 'published' from public.news_categories where slug = 'su-kien'
on conflict (category_id, locale) do update set name = excluded.name, status = excluded.status;

insert into public.news_category_translations (category_id, locale, name, status)
select id, 'en', 'Announcements', 'published' from public.news_categories where slug = 'thong-bao'
on conflict (category_id, locale) do update set name = excluded.name, status = excluded.status;

-- News 1
with cat as (
  select id from public.news_categories where slug = 'hoi-nghi'
), row as (
  insert into public.news (slug, category_id, status, published_at, is_featured)
  values ('tong-hop-abstract-vsot-2026', (select id from cat), 'published', null, true)
  on conflict (slug) do update set
    category_id = excluded.category_id,
    status = excluded.status,
    is_featured = excluded.is_featured
  returning id
)
insert into public.news_translations (news_id, locale, title, excerpt, body, status)
select id, 'vi',
  'Hội nghị VSOT 2026: Tổng hợp abstract',
  'Toàn bộ tóm tắt báo cáo khoa học tại Hội nghị thường niên lần X, TP. Hồ Chí Minh.',
  jsonb_build_object('text', 'Tài liệu tổng hợp abstract của Hội nghị khoa học thường niên VSOT 2026. Vui lòng tải tệp đính kèm để xem toàn văn.'),
  'published'
from row
on conflict (news_id, locale) do update set
  title = excluded.title, excerpt = excluded.excerpt, body = excluded.body, status = excluded.status;

-- News 2
with cat as (
  select id from public.news_categories where slug = 'su-kien'
), row as (
  insert into public.news (slug, category_id, status, published_at, is_featured)
  values ('tuan-le-hien-ghep-mo-tang-2026', (select id from cat), 'published', null, false)
  on conflict (slug) do update set
    category_id = excluded.category_id,
    status = excluded.status,
    is_featured = excluded.is_featured
  returning id
)
insert into public.news_translations (news_id, locale, title, excerpt, body, status)
select id, 'vi',
  'Tuần lễ Hiến và Ghép mô tạng Việt Nam 2026',
  'Diễn ra từ ngày 13/10 đến 17/10/2026 tại TP. Đà Nẵng.',
  jsonb_build_object('text', 'Chương trình khung Tuần lễ Hiến và Ghép mô tạng Việt Nam 2026. Vui lòng tải tệp đính kèm để xem chi tiết.'),
  'published'
from row
on conflict (news_id, locale) do update set
  title = excluded.title, excerpt = excluded.excerpt, body = excluded.body, status = excluded.status;

-- News 3
with cat as (
  select id from public.news_categories where slug = 'thong-bao'
), row as (
  insert into public.news (slug, category_id, status, published_at, is_featured)
  values ('thong-bao-ho-so-record-vn', (select id from cat), 'published', null, false)
  on conflict (slug) do update set
    category_id = excluded.category_id,
    status = excluded.status,
    is_featured = excluded.is_featured
  returning id
)
insert into public.news_translations (news_id, locale, title, excerpt, body, status)
select id, 'vi',
  'Thông báo làm hồ sơ cho Record VN',
  'Hướng dẫn nộp hồ sơ đề xuất kỷ lục cho cá nhân và đơn vị.',
  jsonb_build_object('text', 'Thông báo và hướng dẫn làm hồ sơ đề xuất kỷ lục Record VN. Vui lòng tải tệp đính kèm để xem chi tiết.'),
  'published'
from row
on conflict (news_id, locale) do update set
  title = excluded.title, excerpt = excluded.excerpt, body = excluded.body, status = excluded.status;

-- Attachments
insert into public.news_attachments (news_id, title_vi, file_path, file_format, sort)
select id, 'Tổng hợp abstract (PDF)', '/media/2026/documents/abs-tong-hop.pdf', 'PDF', 10
from public.news where slug = 'tong-hop-abstract-vsot-2026'
and not exists (
  select 1 from public.news_attachments a
  where a.news_id = public.news.id and a.file_path = '/media/2026/documents/abs-tong-hop.pdf'
);

insert into public.news_attachments (news_id, title_vi, file_path, file_format, sort)
select id, 'Chương trình khung Tuần lễ (PDF)', '/media/2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf', 'PDF', 10
from public.news where slug = 'tuan-le-hien-ghep-mo-tang-2026'
and not exists (
  select 1 from public.news_attachments a
  where a.news_id = public.news.id and a.file_path = '/media/2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf'
);

insert into public.news_attachments (news_id, title_vi, file_path, file_format, sort)
select id, 'Thông báo làm hồ sơ Record VN (PDF)', '/media/2026/news/thong-bao-ho-so-record-vn.pdf', 'PDF', 10
from public.news where slug = 'thong-bao-ho-so-record-vn'
and not exists (
  select 1 from public.news_attachments a
  where a.news_id = public.news.id and a.file_path = '/media/2026/news/thong-bao-ho-so-record-vn.pdf'
);

-- Conference documents (homepage sections + abstract)
insert into public.conference_documents
  (conference_id, media_id, doc_type, title_vi, title_en, description_vi, description_en, file_path, file_format, sort, is_public)
select c.id, null, 'template',
  'Template slide 16:9 — Hội nghị khoa học thường niên',
  '16:9 slide template — Annual scientific congress',
  'Mẫu trình bày báo cáo (khổ ngang 16:9) dùng cho các phiên tại Hội nghị khoa học thường niên.',
  'Presentation template (16:9) for annual scientific congress sessions.',
  '/media/2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx', 'PPTX', 10, true
from public.conferences c where c.slug = '2026'
and not exists (select 1 from public.conference_documents d where d.file_path = '/media/2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx');

insert into public.conference_documents
  (conference_id, media_id, doc_type, title_vi, title_en, description_vi, description_en, file_path, file_format, sort, is_public)
select c.id, null, 'template',
  'Template slide 16:9 — Trung tâm điều phối hiến tạng',
  '16:9 slide template — Organ donation coordination centre',
  'Mẫu trình bày (khổ ngang 16:9) dùng cho nội dung của Trung tâm điều phối hiến tạng.',
  'Presentation template (16:9) for organ donation coordination content.',
  '/media/2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx', 'PPTX', 20, true
from public.conferences c where c.slug = '2026'
and not exists (select 1 from public.conference_documents d where d.file_path = '/media/2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx');

insert into public.conference_documents
  (conference_id, media_id, doc_type, title_vi, title_en, description_vi, description_en, file_path, file_format, sort, is_public)
select c.id, null, 'template',
  'Template Poster 9:16',
  'Poster template 9:16',
  'Mẫu poster (khổ dọc 9:16) dùng cho phần trình bày Poster tại hội nghị.',
  'Poster template (9:16 portrait) for poster presentations.',
  '/media/2026/templates/template-poster-9x16.pptx', 'PPTX', 30, true
from public.conferences c where c.slug = '2026'
and not exists (select 1 from public.conference_documents d where d.file_path = '/media/2026/templates/template-poster-9x16.pptx');

insert into public.conference_documents
  (conference_id, media_id, doc_type, title_vi, title_en, description_vi, description_en, file_path, file_format, sort, is_public)
select c.id, null, 'invitation',
  'Thư mời tham dự Hội nghị (PDF)',
  'Congress invitation letter (PDF)',
  'Thư mời chính thức của Ban Tổ chức kính mời tham dự Hội nghị khoa học thường niên Hội ghép tạng Việt Nam lần thứ XI – 2026 tại TP. Đà Nẵng.',
  'Official invitation from the Organising Committee to the 11th Annual Scientific Congress in Da Nang.',
  '/media/2026/invitations/thu-moi-dien-tu-vsot-2026.pdf', 'PDF', 10, true
from public.conferences c where c.slug = '2026'
and not exists (select 1 from public.conference_documents d where d.file_path = '/media/2026/invitations/thu-moi-dien-tu-vsot-2026.pdf');

insert into public.conference_documents
  (conference_id, media_id, doc_type, title_vi, title_en, description_vi, description_en, file_path, file_format, sort, is_public)
select c.id, null, 'invitation',
  'Thư mời dự tiệc Gala Dinner (ảnh)',
  'Gala Dinner invitation (image)',
  'Thư mời tham dự tiệc chào mừng Gala Dinner của Hội nghị.',
  'Invitation to the congress Gala Dinner.',
  '/media/2026/invitations/thu-moi-galadinner.jpg', 'JPG', 20, true
from public.conferences c where c.slug = '2026'
and not exists (select 1 from public.conference_documents d where d.file_path = '/media/2026/invitations/thu-moi-galadinner.jpg');

insert into public.conference_documents
  (conference_id, media_id, doc_type, title_vi, title_en, description_vi, description_en, file_path, file_format, sort, is_public)
select c.id, null, 'abstract',
  'Tổng hợp abstract Hội nghị VSOT 2026',
  'VSOT 2026 abstract collection',
  'Toàn bộ tóm tắt báo cáo khoa học tại Hội nghị thường niên.',
  'Collection of scientific abstracts from the annual congress.',
  '/media/2026/documents/abs-tong-hop.pdf', 'PDF', 10, true
from public.conferences c where c.slug = '2026'
and not exists (select 1 from public.conference_documents d where d.file_path = '/media/2026/documents/abs-tong-hop.pdf');

-- Conference archive (files copied to public/legacy/<year>/)
insert into public.legacy_sites (slug, year, title, description, entry_path, status, has_dynamic_content, notes)
values
  ('2025', 2025, 'Hội nghị VSOT 2025', 'Chương trình hội nghị khoa học VSOT 2025.', '/legacy/2025/index.html', 'published', false, 'Nguồn: 2027 demo/public/legacy/2025'),
  ('2023', 2023, 'Chương trình VSOT 2023', 'Chương trình hội nghị VSOT 2023.', '/legacy/2023/index.html', 'published', false, 'Nguồn: 2027 demo/public/legacy/2023'),
  ('2022', 2022, 'Chương trình Hội nghị VSOT 2022', 'Chương trình và tóm tắt hội nghị VSOT 2022.', '/legacy/2022/index.html', 'published', false, 'Nguồn: 2027 demo/public/legacy/2022'),
  ('2021', 2021, 'Hội nghị VSOT 2021', 'Chương trình hội nghị VSOT 2021.', '/legacy/2021/index.html', 'published', false, 'Nguồn: 2027 demo/public/legacy/2021'),
  ('2019', 2019, 'Hội nghị VSOT 2019', 'Chương trình hội nghị VSOT 2019.', '/legacy/2019/index.html', 'published', false, 'Nguồn: 2027 demo/public/legacy/2019'),
  ('2018', 2018, 'Hội nghị VSOT 2018', 'Chương trình hội nghị VSOT 2018.', '/legacy/2018/index.html', 'published', false, 'Nguồn: 2027 demo/public/legacy/2018')
on conflict (slug) do update set
  year = excluded.year,
  title = excluded.title,
  description = excluded.description,
  entry_path = excluded.entry_path,
  status = excluded.status,
  notes = excluded.notes;
