# V1 REUSE ANALYSIS

Nguồn tham khảo: `D:\Philao\code project\VSOT\2027 demo` (chỉ đọc, không sửa).
Nguyên tắc: tái sử dụng thành phần đã chứng minh, không copy nguyên trạng.

## 1. Đã tái sử dụng (có chọn lọc)

| Thành phần v1 | Dùng ở v2 | Thay đổi |
|---|---|---|
| `lib/supabase/{server,client,admin}.ts` | Toàn bộ data/auth | Giữ; thêm `public.ts` cookie-less |
| `lib/programme/{data,model,conference}.ts` | Programme + landing | Đổi sang public client; thêm `getLatestConferenceYear` |
| `lib/faculty/data.ts` | Faculty directory/profile | Đổi sang public client |
| `lib/news/data.ts`, `lib/pages/data.ts` | Tin tức/trang CMS | Đổi sang public client |
| `supabase/migrations/0001..0017` | DB mới `yrvhrsztcxfhlxsxbzhv` | Chạy nguyên thứ tự, không sửa file đã áp dụng |
| `supabase/seed/2026/programme.json` + `scripts/import_2026.py` | Dữ liệu 2026 thật | Import vào DB mới |
| `components/programme/*` | List/Grid/Table/Search/RoleBadge | Đổi màu role sang token; thêm id search |
| `components/faculty/faculty-directory.tsx` | Directory lọc client | Giữ logic, đổi theme |
| `components/admin/*`, `app/admin/**` | CMS | Giữ RBAC/server actions; sửa link legacy |
| `lib/auth/*`, `lib/utils/*` | Auth, ngày, search | Giữ |
| Config Next/Tailwind/ESLint | Build | Đổi palette, ignore template, headers |

## 2. Đã viết mới

- Design tokens navy/gold, header/footer, mobile dock, skip link, language switcher.
- Trang chủ `/[locale]` (v1 đã xoá) dùng số liệu thật từ DB.
- SEO: metadata theo trang, JSON-LD Organization/Event/Person, sitemap, robots, 404.
- Bỏ toàn bộ route legacy/archive (`/legacy/**`, `/hoi-nghi/cac-nam-truoc`) vì v2 không
  mang bản tĩnh cũ; link legacy trong header/footer/admin đã thay bằng route mới.
- `lib/supabase/public.ts` để tránh admin đang đăng nhập thấy draft ở trang public.

## 3. Giải pháp v1 đã hoạt động tốt

- Server Components + Server Actions, không API trung gian cho CMS.
- RBAC `resource.action` + `requirePermission`; RLS cho public read.
- Migration SQL tuần tự + script dry-run; import idempotent theo legacy id.
- Tách dữ liệu programme theo conference/date; lọc URL state.
- Format ngày date-only bằng UTC để tránh lệch múi giờ.

## 4. Lỗi v1 cần tránh (đã xử lý)

| Lỗi v1 | Xử lý v2 |
|---|---|
| `/vi` 404 vì trang chủ bị xoá | Tạo trang chủ thật; `/` redirect `/vi` |
| Public đọc bằng client có cookie → thấy draft | Thêm cookie-less public client cho mọi public read |
| Link `/legacy/2026/...` còn sót gây 404 | Xoá route legacy, thay link header/footer/admin |
| `template/` bị ESLint quét (861 lỗi) | `globalIgnores` template/scripts/supabase/public |
| Bootstrap/nav cũ | Không dùng novena; Tailwind thuần |
| Thiếu sitemap/robots/JSON-LD | Đã bổ sung |
| Endpoint bootstrap super-admin tồn tại | Đã xoá route |
| Hardcode năm trong nav | Nav lấy `latestYear` từ DB |

## 5. Không tái sử dụng

- `public/legacy/**` và `app/hoi-nghi/cac-nam-truoc`: ngoài phạm vi v2, nặng và phụ thuộc bản tĩnh.
- `lib/archive/conferences.ts`: dữ liệu legacy không có trong v2.
- Toàn bộ tài liệu audit/history v1: chỉ đọc tham khảo, không copy sang v2.
- Template `novena`: không dùng vì là Bootstrap 4/jQuery tĩnh, khác stack và không đáp ứng
  programme/faculty/CMS.
