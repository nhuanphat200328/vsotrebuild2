-- 0021: align the abstract news excerpt with the verified 2026 source.
-- The supplied draft mentioned "lần X, TP. Hồ Chí Minh" while the source
-- programme is the 11th congress in Da Nang. Keep the excerpt neutral rather
-- than publishing unverified edition/location details.

update public.news_translations nt
set excerpt = 'Toàn bộ tóm tắt báo cáo khoa học tại Hội nghị khoa học thường niên VSOT 2026.'
from public.news n
where nt.news_id = n.id
  and n.slug = 'tong-hop-abstract-vsot-2026'
  and nt.locale = 'vi';
