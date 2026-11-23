-- 0023: Supabase Storage metadata for managed 2026 documents/news attachments.
-- Files are uploaded by scripts/upload_media.py to bucket media-public.
-- Local public paths remain as fallback; storage_path is preferred by the UI.

alter table public.conference_documents add column if not exists storage_bucket text;
alter table public.conference_documents add column if not exists storage_path text;
alter table public.conference_documents add column if not exists source_url text;

alter table public.news_attachments add column if not exists storage_bucket text;
alter table public.news_attachments add column if not exists storage_path text;
alter table public.news_attachments add column if not exists source_url text;

insert into public.media (bucket, path, file_name, mime_type, size_bytes, visibility)
values
  ('media-public', 'conference-2026/branding/kv.png', 'kv.png', 'image/png', 1622520, 'public'),
  ('media-public', 'conference-2026/branding/logo.gif', 'logo.gif', 'image/gif', 7995, 'public'),
  ('media-public', 'conference-2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx', 'template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 15203567, 'public'),
  ('media-public', 'conference-2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx', 'template-16x9-trung-tam-dieu-phoi-hien-tang.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 9421234, 'public'),
  ('media-public', 'conference-2026/templates/template-poster-9x16.pptx', 'template-poster-9x16.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 1455606, 'public'),
  ('media-public', 'conference-2026/invitations/thu-moi-dien-tu-vsot-2026.pdf', 'thu-moi-dien-tu-vsot-2026.pdf', 'application/pdf', 11876924, 'public'),
  ('media-public', 'conference-2026/invitations/thu-moi-galadinner.jpg', 'thu-moi-galadinner.jpg', 'image/jpeg', 206499, 'public'),
  ('media-public', 'conference-2026/abstracts/abs-tong-hop.pdf', 'abs-tong-hop.pdf', 'application/pdf', 6524051, 'public'),
  ('media-public', 'conference-2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf', 'tuan-le-hien-ghep-mo-tang-2026.pdf', 'application/pdf', 145527, 'public'),
  ('media-public', 'conference-2026/news/thong-bao-ho-so-record-vn.pdf', 'thong-bao-ho-so-record-vn.pdf', 'application/pdf', 751712, 'public'),
  ('media-public', 'conference-2026/news/thong-bao-2.pdf', 'thong-bao-2.pdf', 'application/pdf', 798029, 'public'),
  ('media-public', 'conference-2026/news/thu-moi-tai-tro.pdf', 'thu-moi-tai-tro.pdf', 'application/pdf', 377270, 'public'),
  ('media-public', 'conference-2023/documents/chuong-trinh-vsot-2023.pdf', 'chuong-trinh-vsot-2023.pdf', 'application/pdf', 640187, 'public'),
  ('media-public', 'conference-2025/documents/CTKH.pdf', 'CTKH.pdf', 'application/pdf', 1055267, 'public')
on conflict (bucket, path) do update set
  mime_type = excluded.mime_type,
  size_bytes = excluded.size_bytes,
  visibility = excluded.visibility;

update public.conference_documents
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx',
    source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/template/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx'
where file_path = '/media/2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx';

update public.conference_documents
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx',
    source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/template/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx'
where file_path = '/media/2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx';

update public.conference_documents
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/templates/template-poster-9x16.pptx',
    source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/template/template-poster-9x16.pptx'
where file_path = '/media/2026/templates/template-poster-9x16.pptx';

update public.conference_documents
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/invitations/thu-moi-dien-tu-vsot-2026.pdf',
    source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/thu-moi/thu-moi-dien-tu-vsot-2026.pdf'
where file_path = '/media/2026/invitations/thu-moi-dien-tu-vsot-2026.pdf';

update public.conference_documents
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/invitations/thu-moi-galadinner.jpg',
    source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/thu-moi/thu-moi-galadinner.jpg'
where file_path = '/media/2026/invitations/thu-moi-galadinner.jpg';

update public.conference_documents
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/abstracts/abs-tong-hop.pdf',
    source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/abs-tong-hop.pdf'
where file_path = '/media/2026/documents/abs-tong-hop.pdf';

update public.news_attachments
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/abstracts/abs-tong-hop.pdf',
    source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/abs-tong-hop.pdf'
where file_path = '/media/2026/documents/abs-tong-hop.pdf';

update public.news_attachments
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf',
    source_url = 'https://vsot.com.vn/pictures/VSOT2026_CTKH%20khung%20ver26722Duy1784826578.pdf'
where file_path = '/media/2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf';

update public.news_attachments
set storage_bucket = 'media-public',
    storage_path = 'conference-2026/news/thong-bao-ho-so-record-vn.pdf',
    source_url = 'https://vsot.com.vn/THONG%20BAO%20LAM%20HO%20SO%20CHO%20RECORD%20VN%20.pdf'
where file_path = '/media/2026/news/thong-bao-ho-so-record-vn.pdf';
