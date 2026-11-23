# VSOT Demo Ver 2

Website Hội Ghép tạng Việt Nam (VSOT) — bản dựng lại độc lập trong workspace
`demo ver2`, tham chiếu tài liệu TTS 2026 và kinh nghiệm từ VSOT v1.

- Stack: Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage)
- Dữ liệu thật: hội nghị VSOT 2026 (5 ngày, 6 hội trường, 65 phiên, 255 báo cáo, 245 người)
- Ngôn ngữ: tiếng Việt mặc định, tiếng Anh có fallback tiếng Việt
- Repo đích: `nhuanphat200328/vsotrebuild2`
- Supabase project ref: `yrvhrsztcxfhlxsxbzhv` (không ghi key trong repo)

## Yêu cầu

- Node.js >= 20.9 (đã kiểm với 24.17.0)
- npm 11+
- Python 3.12 + `psycopg[binary]` (chỉ cho migration/import)

## Cài đặt

```powershell
npm install
```

Tạo `.env.local` từ `.env.example` và điền:

| Biến | Phạm vi | Ghi chú |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | anon/publishable key, RLS bắt buộc |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client | tùy chọn, tương đương anon |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | không bao giờ dùng ở client |
| `DIRECT_URL` | server only | Postgres non-pooling cho migration |
| `NEXT_PUBLIC_SITE_URL` | build/runtime | canonical, sitemap, Open Graph |

Không commit `.env.local`, không đưa key vào tài liệu, log hoặc frontend bundle.

## Chạy local

```powershell
npm run dev
```

Mở http://localhost:3000 — tự chuyển tới `/vi`.

## Kiểm tra

```powershell
npm run typecheck
npm run lint
npm run build
npm run start -- -p 3100
```

## Database

- Migrations: `supabase/migrations/0001..0017`, đã áp dụng vào project mới.
- Áp dụng lại (idempotent, có dry-run mặc định):

```powershell
python scripts\apply_migrations.py          # dry-run + rollback
python scripts\apply_migrations.py --apply  # ghi thật
```

- Import dữ liệu 2026 (idempotent theo `legacy_sid`/`legacy_pid`):

```powershell
python -u scripts\import_2026.py
```

Nguồn: `supabase/seed/2026/programme.json` (dữ liệu chương trình thật của VSOT 2026).
Import ghi đè giờ/phòng/tiêu đề nếu chạy lại trên DB đã chỉnh qua CMS.

## Routes chính

| Route | Nội dung |
|---|---|
| `/` | redirect `/vi` |
| `/vi`, `/en` | Trang chủ, số liệu thật từ DB |
| `/[locale]/hoi-nghi` | Danh sách hội nghị đã publish |
| `/[locale]/hoi-nghi/2026` | Landing hội nghị + JSON-LD Event |
| `.../chuong-trinh?date=&view=list|grid|table&q=&room=&type=` | Programme List/Grid/Table + tìm kiếm/lọc inline |
| `.../chuong-trinh/tong-quan` | Tổng quan phòng × giờ |
| `.../phien/[id]` | Chi tiết phiên, canonical/share |
| `.../dien-gia?q=&role=` | Directory diễn giả (C/D/P), lọc client-side |
| `.../dien-gia/[slug]` | Hồ sơ diễn giả + các phân công theo ngày |
| `/[locale]/tin-tuc`, `/[slug]` | Tin tức từ CMS + tệp đính kèm |
| `/[locale]/hoi-nghi/cac-nam-truoc` | Kho lưu trữ hội nghị 2018–2025 |
| `/legacy/<year>/...` | Website hội nghị các năm (bản bảo toàn, link đã trỏ về site mới) |
| `/[locale]/lien-he` | Form liên hệ lưu DB, honeypot + rate limit |
| `/admin/**` | CMS: dashboard, conferences/programme, pages, news, media, contacts, users |
| `/api/health` | Health check |
| `/sitemap.xml`, `/robots.txt` | SEO |

Admin yêu cầu đăng nhập Supabase và quyền RBAC; kiểm quyền ở page + server action.

## Deploy Vercel (khi được duyệt)

1. Import repo `nhuanphat200328/vsotrebuild2`.
2. Framework preset: Next.js. Build: `npm run build`.
3. Thêm Environment Variables cho Preview/Production (không dùng chung service key với local).
4. Đặt `NEXT_PUBLIC_SITE_URL` = URL Preview tương ứng.
5. Không chạy migration tự động từ Vercel; áp dụng thủ công có kiểm soát.

## Tài liệu

`TTS2026_REQUIREMENTS_ANALYSIS.md`, `TEMPLATE_CATALOG.md`, `V1_REUSE_ANALYSIS.md`,
`IMPLEMENTATION_PLAN.md`, `SYSTEM_ARCHITECTURE.md`, `DATABASE_DESIGN.md`, `SITEMAP.md`,
`DATA_FLOW.md`, `SKILLS_USAGE_REPORT.md`, `TESTING_REPORT.md`, `SECURITY_CHECKLIST.md`,
`docs/architecture-diagram.html`, cùng bộ tài liệu audit/plan/report trong `docs/`:
`SOURCE_CONTENT_AUDIT.md`, `HOMEPAGE_CONTENT_PLAN.md`, `NEWS_CONTENT_AUDIT.md`,
`CONFERENCE_ARCHIVE_PLAN.md`, `ASSET_MIGRATION_PLAN.md`, `DATABASE_UPDATE_PLAN.md`,
`UI_UX_DESIGN_PLAN.md`, `IMPLEMENTATION_REPORT.md`, `TESTING_REPORT.md`,
`ASSET_MIGRATION_REPORT.md`, `SKILLS_USAGE_REPORT.md`.

## Tài nguyên tĩnh

- `public/media/2026/`: KV, logo, template PPTX, thư mời, abstract, tệp tin.
- `public/legacy/<year>/`: 6 kỳ hội nghị 2018–2025 (39,6 MB), bảo toàn nội dung gốc;
  header/footer của bản copy đã được trỏ về route mới để không 404.
