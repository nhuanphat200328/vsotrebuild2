# IMPLEMENTATION PLAN

Ngày lập: 2026-11-23. Trạng thái cập nhật cuối: xem `[x]`.

## Phase 0 — Khảo sát

- [x] Đọc toàn bộ `TTS2026_PROGRAMME_REFERENCE.txt` (1.516 dòng).
- [x] Khảo sát template `novena`, ghi `TEMPLATE_CATALOG.md`.
- [x] Đọc kiến trúc/DB/sitemap v1, ghi `V1_REUSE_ANALYSIS.md`.
- [x] Kiểm tra key file: xác định Supabase project mới, repo GitHub mới (không in giá trị key).
- [x] Kiểm tra môi trường: Node 24.17, npm 11.13, Python 3.12, git 2.55; thiếu Vercel/gh/supabase CLI.

## Phase 1 — Nền tảng

- [x] Tạo workspace `demo ver2` (không có git trước đó).
- [x] Scaffold Next.js 16 + TypeScript + Tailwind 4 + Supabase.
- [x] Design tokens navy/gold, font Be Vietnam Pro, focus ring, reduced motion.
- [x] `.env.local` từ key file (không log giá trị); `.env.example` placeholder.
- [x] `.gitignore` chặn `.env*`, key file, `template/`.

## Phase 2 — Database

- [x] Dry-run 17 migrations.
- [x] Apply migrations vào project `yrvhrsztcxfhlxsxbzhv`.
- [x] Import dữ liệu 2026: 5 ngày, 6 phòng, 65 phiên, 255 báo cáo, 245 người, 348 phân công.
- [x] Kiểm RLS bằng anon key: draft/contact/profile/audit không trả dữ liệu.

## Phase 3 — Public site

- [x] App shell: header, nav dropdown hội nghị, footer, mobile dock, skip link, VI/EN switch.
- [x] Trang chủ với số liệu thật + liên kết nhanh + điểm nhấn ngày đầu.
- [x] Danh sách hội nghị + landing hội nghị (JSON-LD Event).
- [x] Programme List/Grid/Table + filter/search inline + date tabs giữ filter.
- [x] Tổng quan phòng × giờ (At a glance).
- [x] Chi tiết phiên canonical + JSON-LD.
- [x] Faculty directory + lọc vai trò + profile + JSON-LD Person.
- [x] Tin tức/trang CMS (kế thừa v1, public client).
- [x] Liên hệ: form DB, honeypot, rate limit 5/10 phút/IP.
- [x] 404, sitemap, robots.

## Phase 4 — CMS

- [x] Login Supabase, chặn public signup.
- [x] Admin dashboard, conferences/programme builder, pages, news, media, contacts, users.
- [x] RBAC ở page + server action (kế thừa v1).
- [x] Xoá endpoint bootstrap super-admin.
- [x] Sửa link legacy trong admin.

## Phase 5 — Quality & security

- [x] `npm run typecheck` PASS.
- [x] `npm run lint` PASS.
- [x] `npm run build` PASS.
- [x] Smoke test các route public bằng server production.
- [x] Header bảo mật cơ bản (nosniff, frame, referrer, permissions, HSTS).
- [x] Không có secret trong source/bundle/docs (rà soát).

## Phase 6 — Bàn giao

- [x] Docs: requirements, template, v1 reuse, plan, architecture, database, sitemap, data flow.
- [x] `SKILLS_USAGE_REPORT.md`, `TESTING_REPORT.md`, `SECURITY_CHECKLIST.md`.
- [x] Sơ đồ kiến trúc tương tác `docs/architecture-diagram.html`.
- [ ] Push GitHub `nhuanphat200328/vsotrebuild2` (theo yêu cầu; xem TESTING_REPORT mục deploy).
- [ ] Vercel Preview (chưa thực hiện — cần đăng nhập CLI/quyền).

## Backlog gợi ý

1. Bổ sung bản dịch EN cho session/presentation đang `missing`.
2. CRUD đầy đủ cho conference/date/room/people (v1 mới có programme cơ bản).
3. Server-side search/tsvector khi dữ liệu tăng (> vài nghìn bản ghi).
4. Ảnh OG động cho phiên/diễn giả; media thật thay ảnh trống.
5. Rate limit phân tán (Upstash/Redis) thay truy vấn DB.
6. Playwright e2e cho programme/faculty/contact.
