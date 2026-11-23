# TESTING REPORT — VSOT Demo Ver 2

- Ngày: 2026-11-23
- Môi trường: Windows 11, Node 24.17.0, npm 11.13.0, Next 16.4.6, Supabase Postgres 17
- DB: project `yrvhrsztcxfhlxsxbzhv` (mới), migrations 0001..0017, dữ liệu 2026 đã import

## 1. Build & static checks

| Lệnh | Kết quả |
|---|---|
| `npm install` | PASS — 373 packages |
| `npm run typecheck` (`tsc --noEmit`) | PASS |
| `npm run lint` (`eslint .`) | PASS — 0 error, 0 warning sau khi ignore template |
| `npm run build` | PASS — 30+ route, sitemap/robots/icon prerender; chạy lại sau thay đổi UI cuối |
| `git push -u origin main` | PASS — repo `nhuanphat200328/vsotrebuild2` |
| `python scripts\apply_migrations.py` (dry-run) | PASS — rollback |
| `apply_migrations.py --apply` | PASS — committed |
| `python -u scripts\import_2026.py` | PASS — 65 sessions, 255 presentations, 245 people, 348 assignments |

## 2. Smoke test HTTP (server production `next start -p 3101`)

| Route | Status | Ghi chú |
|---|---|---|
| `/` | 307 | → `/vi` |
| `/vi` | 200 | 63.311 bytes; chứa 245 diễn giả, 255 báo cáo, 6 hội trường |
| `/en` | 200 | fallback EN |
| `/vi/hoi-nghi` | 200 | danh sách hội nghị |
| `/vi/hoi-nghi/2026` | 200 | landing + JSON-LD Event |
| `.../chuong-trinh` | 200 | List |
| `.../chuong-trinh?view=grid` | 200 | Grid |
| `.../chuong-trinh?view=table` | 200 | Table |
| `.../chuong-trinh?q=ghép&date=2026-10-13` | 200 | search inline |
| `.../chuong-trinh/tong-quan` | 200 | At a glance |
| `.../dien-gia` | 200 | directory |
| `.../dien-gia/chau-quy-thuan` | 200 | profile + JSON-LD Person |
| `.../phien/a7ed343b-…` | 200 | session + JSON-LD Event |
| `/vi/lien-he` | 200 | form |
| `/vi/tin-tuc` | 200 | empty state (0 bài published) |
| `/vi/khong-ton-tai` | 404 | not-found |
| `/api/health` | 200 | chỉ trả boolean cấu hình |
| `/admin` | 307 | → `/vi/dang-nhap?next=/admin` |
| `/sitemap.xml` | 200 | 13 URL, có `hoi-nghi/2026` |
| `/robots.txt` | 200 | `Disallow: /admin` |

Kiểm tra CSS build: file `25j2o95fbopa_.css` có `--color-brand-700`, `.bg-role-chair`.

## 3. Security tests (anon key)

| Test | Kết quả mong đợi | Kết quả |
|---|---|---|
| `GET conferences?status=eq.draft` | `[]` | `[]` |
| `GET contact_requests` | `[]` | `[]` |
| `GET profiles` | `[]` | `[]` |
| `GET audit_logs` | `[]` | `[]` |
| `GET conferences?status=eq.published` | `2026` | `[{"slug":"2026"}]` |
| Rà secret trong source/bundle | không có | PASS (không thấy service key trong client chunk) |

## 4. Chưa kiểm / giới hạn

- **Chưa kiểm bằng trình duyệt thật** (Chrome/Edge/Safari), chưa chụp screenshot: môi trường
  CLI không có trình duyệt. Đã kiểm HTML/CSS/HTTP, chưa kiểm layout trực quan.
- **Chưa kiểm thiết bị thật** 360/390/768/1024/1440; breakpoint dựa trên Tailwind + review code.
- **Chưa submit form liên hệ thật** để tránh tạo dữ liệu rác; đã review Zod/honeypot/rate-limit/RLS.
- **Chưa test thao tác admin** (cần tài khoản super admin). Middleware chặn anon đã kiểm.
- **Chưa có tài khoản admin** trên DB mới: cần tạo qua Supabase Auth (dashboard) hoặc invite user;
  endpoint bootstrap đã bị xoá.
- **Chưa deploy Vercel**: máy không có Vercel CLI và chưa đăng nhập; không tuyên bố Preview đã chạy.
- **Chưa kiểm Lighthouse/axe**; SEO/JSON-LD mới kiểm ở mức HTML.

## 5. Kết luận

Code, build, dữ liệu, route public và RLS public đạt yêu cầu kỹ thuật. Các phần cần môi trường
bên ngoài (trình duyệt thật, tài khoản admin, Vercel) được ghi rõ là chưa kiểm, không đánh dấu PASS.

## PHASE 2 — Nội dung 2026, tài liệu và archive (2026-11-23)

- Trang chủ mới: hero KV thật, CountUp thống kê, tin tức editorial, template báo cáo viên,
  thư mời, archive.
- Tin tức: 3 tin thật (`news`), 3 tệp đính kèm (`news_attachments`), 3 chuyên mục.
- Tài liệu: 6 `conference_documents` (3 template, 2 thư mời, 1 abstract).
- Archive: 6 năm 2018–2025 trong `public/legacy` + metadata `legacy_sites`.
- Migrations 0018–0021; DB hiện 36 bảng, 96 policy.
- Chi tiết: `docs/` (SOURCE_CONTENT_AUDIT, HOMEPAGE_CONTENT_PLAN, NEWS_CONTENT_AUDIT,
  CONFERENCE_ARCHIVE_PLAN, ASSET_MIGRATION_PLAN, DATABASE_UPDATE_PLAN, UI_UX_DESIGN_PLAN,
  IMPLEMENTATION_REPORT, TESTING_REPORT, ASSET_MIGRATION_REPORT, SKILLS_USAGE_REPORT).
