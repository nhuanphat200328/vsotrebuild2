-- 0024: add two verified 2026 announcements found in the source website.
-- Sources: hoinghi2026/thong-bao-2.html and hoinghi2026/thu-moi-tai-tro.html.
-- No publication dates are exposed by the source, so published_at stays null.

with cat as (
  select id from public.news_categories where slug = 'thong-bao'
), row as (
  insert into public.news (slug, category_id, status, published_at, is_featured)
  values ('thong-bao-so-2-vsot-2026', (select id from cat), 'published', null, false)
  on conflict (slug) do update set
    category_id = excluded.category_id,
    status = excluded.status,
    is_featured = excluded.is_featured
  returning id
)
insert into public.news_translations (news_id, locale, title, excerpt, body, status)
select id, 'vi',
  'Thông báo số 2: Cập nhật Hội nghị khoa học thường niên VSOT 2026',
  'Cập nhật thông tin tổ chức Hội nghị khoa học thường niên Hội Ghép tạng Việt Nam lần thứ XI.',
  jsonb_build_object('text', 'Thông báo số 2 của Hội nghị khoa học thường niên VSOT 2026. Vui lòng tải tệp đính kèm để xem nội dung đầy đủ.'),
  'published'
from row
on conflict (news_id, locale) do update set
  title = excluded.title, excerpt = excluded.excerpt, body = excluded.body, status = excluded.status;

with cat as (
  select id from public.news_categories where slug = 'thong-bao'
), row as (
  insert into public.news (slug, category_id, status, published_at, is_featured)
  values ('thu-moi-tai-tro-vsot-2026', (select id from cat), 'published', null, false)
  on conflict (slug) do update set
    category_id = excluded.category_id,
    status = excluded.status,
    is_featured = excluded.is_featured
  returning id
)
insert into public.news_translations (news_id, locale, title, excerpt, body, status)
select id, 'vi',
  'Thư mời tài trợ VSOT 2026',
  'Thư mời tài trợ và trưng bày sản phẩm tại Hội nghị khoa học thường niên Hội Ghép tạng Việt Nam lần thứ XI.',
  jsonb_build_object('text', 'Thư mời tài trợ VSOT 2026. Vui lòng tải tệp đính kèm để xem chi tiết các hình thức tài trợ và trưng bày.'),
  'published'
from row
on conflict (news_id, locale) do update set
  title = excluded.title, excerpt = excluded.excerpt, body = excluded.body, status = excluded.status;

insert into public.news_attachments
  (news_id, title_vi, file_path, file_format, sort, storage_bucket, storage_path)
select id, 'Thông báo số 2 (PDF)', '/media/2026/news/thong-bao-2.pdf', 'PDF', 10,
  'media-public', 'conference-2026/news/thong-bao-2.pdf'
from public.news where slug = 'thong-bao-so-2-vsot-2026'
and not exists (
  select 1 from public.news_attachments a
  where a.news_id = public.news.id and a.file_path = '/media/2026/news/thong-bao-2.pdf'
);

insert into public.news_attachments
  (news_id, title_vi, file_path, file_format, sort, storage_bucket, storage_path)
select id, 'Thư mời tài trợ (PDF)', '/media/2026/news/thu-moi-tai-tro.pdf', 'PDF', 10,
  'media-public', 'conference-2026/news/thu-moi-tai-tro.pdf'
from public.news where slug = 'thu-moi-tai-tro-vsot-2026'
and not exists (
  select 1 from public.news_attachments a
  where a.news_id = public.news.id and a.file_path = '/media/2026/news/thu-moi-tai-tro.pdf'
);
