-- 0028: ensure both 2026 notices are classified as announcements.
update public.news n
set category_id = (select id from public.news_categories where slug = 'thong-bao')
where n.slug in ('tuan-le-hien-ghep-mo-tang-2026', 'thong-bao-so-2-vsot-2026');
