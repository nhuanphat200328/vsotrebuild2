-- 0026: keep the original source URL for migrated news items.

alter table public.news add column if not exists source_url text;

update public.news set source_url = 'https://vsotrebuild.vercel.app/legacy/2026/materials/abs-tong-hop.pdf'
where slug = 'tong-hop-abstract-vsot-2026';

update public.news set source_url = 'https://vsot.com.vn/pictures/VSOT2026_CTKH%20khung%20ver26722Duy1784826578.pdf'
where slug = 'tuan-le-hien-ghep-mo-tang-2026';

update public.news set source_url = 'https://vsot.com.vn/THONG%20BAO%20LAM%20HO%20SO%20CHO%20RECORD%20VN%20.pdf'
where slug = 'thong-bao-ho-so-record-vn';

update public.news set source_url = 'https://vsotrebuild.vercel.app/legacy/2026/thong-bao-2.html'
where slug = 'thong-bao-so-2-vsot-2026';

update public.news set source_url = 'https://vsotrebuild.vercel.app/legacy/2026/thu-moi-tai-tro.html'
where slug = 'thu-moi-tai-tro-vsot-2026';
