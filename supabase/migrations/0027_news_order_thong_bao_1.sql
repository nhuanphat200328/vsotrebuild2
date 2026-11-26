-- 0027: explicit news order and complete "Thông báo số 1" metadata.

alter table public.news add column if not exists sort_order integer not null default 100;

update public.news_translations nt
set title = 'Thông báo số 1: Tuần lễ Hiến và Ghép mô tạng Việt Nam 2026'
from public.news n
where nt.news_id = n.id
  and n.slug = 'tuan-le-hien-ghep-mo-tang-2026'
  and nt.locale = 'vi';

update public.news set sort_order = 10 where slug = 'tuan-le-hien-ghep-mo-tang-2026';
update public.news set sort_order = 20 where slug = 'thong-bao-so-2-vsot-2026';
update public.news set sort_order = 30 where slug = 'tong-hop-abstract-vsot-2026';
update public.news set sort_order = 40 where slug = 'thong-bao-ho-so-record-vn';
update public.news set sort_order = 50 where slug = 'thu-moi-tai-tro-vsot-2026';

insert into public.news_attachments
  (news_id, title_vi, file_path, file_format, sort, storage_bucket, storage_path)
select id, 'Thông báo số 1 (PDF)', '/media/2026/news/thong-bao-1.pdf', 'PDF', 5,
  'media-public', 'conference-2026/news/thong-bao-1.pdf'
from public.news where slug = 'tuan-le-hien-ghep-mo-tang-2026'
and not exists (
  select 1 from public.news_attachments a
  where a.news_id = public.news.id and a.file_path = '/media/2026/news/thong-bao-1.pdf'
);

create index if not exists news_sort_order_idx on public.news (sort_order, published_at desc);
