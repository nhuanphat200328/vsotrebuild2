# SKILLS USAGE REPORT

Ngày: 2026-11-23. 8 skill global đã được đọc đầy đủ `SKILL.md` và áp dụng theo phạm vi dưới đây.
`customize-opencode` được nạp trước khi có yêu cầu không dùng, **không áp dụng** cho dự án này.

| # | Skill | Đã đọc | Giai đoạn áp dụng | File/module ảnh hưởng | Quyết định kỹ thuật |
|---|---|---|---|---|---|
| 1 | Frontend Design | Có | Phase 1, 3 | `app/globals.css`, `components/layout/*`, `app/[locale]/page.tsx`, programme/faculty pages | Mobile-first; 1 H1/trang; skip link; focus-visible; role màu có nhãn; bottom dock + safe-area; reduced-motion |
| 2 | Code Review | Có | Phase 5 | Toàn bộ diff, `eslint.config.mjs`, `lib/supabase/public.ts`, middleware, admin links | Review theo pass intent/correctness/security/perf; phát hiện & sửa 4 vấn đề (xem dưới) |
| 3 | SEO Optimization | Có | Phase 3, 5 | metadata các page, `lib/utils/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, JSON-LD | Canonical + hreflang VI/EN; OG; Event/Person/Organization schema; noindex admin/api/login; semantic headings |
| 4 | .NET Core | Có | Phase 2 (đánh giá) | Không có source .NET | Kiến trúc chọn Next.js + Supabase, không chuyển sang .NET. Đã đối chiếu checklist DI/middleware/auth/EF Core để xác nhận không áp dụng; giữ ghi chú cho API .NET tương lai |
| 5 | Architecture Diagrams | Có | Phase 2, 6 | `docs/architecture-diagram.html`, `SYSTEM_ARCHITECTURE.md` | HTML self-contained, SVG + CSS animation, nút chọn luồng, static fallback, không secret/hostname nội bộ |
| 6 | Mermaid Diagrams | Có | Phase 2, 6 | `SYSTEM_ARCHITECTURE.md`, `DATA_FLOW.md` | Sơ đồ container, sequence render/filter/contact, flowchart auth, ERD; chia nhỏ theo chủ đề |
| 7 | Flutter Patterns | Có | Phase 2 (đánh giá) | Không có source Flutter | Dự án thuần web; không tạo app Flutter. Nguyên tắc widget nhỏ/const/state cục bộ được tham chiếu khi tách component React |
| 8 | Tailwind CSS | Có | Phase 1, 3 | `app/globals.css`, toàn bộ component | Tailwind 4 CSS-first `@theme`; token navy/gold; variant `sm/md/lg/xl`; không build class động; template novena dùng Bootstrap nên không trộn |

## Bằng chứng áp dụng Frontend Design

- `app/globals.css`: token màu, focus ring 2px, `prefers-reduced-motion`, font Be Vietnam Pro
  hỗ trợ dấu tiếng Việt.
- Header: nav semantic, `aria-expanded`/`aria-controls`, dropdown bàn phím được, mobile dock 5 mục.
- Layout: skip link, `main#main-content`, footer padding tránh dock.
- Programme: `<details>/<summary>` native, table có `role=region`, `tabIndex=0`, sticky header.

## Bằng chứng áp dụng Code Review

Các vấn đề phát hiện và đã sửa:

1. **blocker:** public pages dùng server client có cookie → admin đăng nhập có thể thấy draft.
   Sửa: `lib/supabase/public.ts` cookie-less; thay ở programme/faculty/news/pages.
2. **blocker:** link `/legacy/2026/*` và route `/hoi-nghi/cac-nam-truoc` không còn tồn tại → 404.
   Sửa: xoá route legacy, viết lại header/footer/admin link.
3. **suggestion:** ESLint quét `template/` (861 lỗi minified) → thêm `globalIgnores`.
4. **suggestion:** endpoint bootstrap super-admin còn tồn tại → xoá route để giảm bề mặt tấn công.
5. **nit:** role badge dùng `bg-red-700` lệch design token → chuyển `bg-role-*` theo TTS.

## Bằng chứng áp dụng SEO

- `generateMetadata` cho layout, hội nghị, programme, faculty list/profile, phiên.
- `sitemap.xml` 13 URL (kiểm bằng HTTP), `robots.txt` chặn `/admin`.
- JSON-LD có mặt trong HTML render (kiểm bằng HTTP: `application/ld+json`).

## Không áp dụng trực tiếp

- **.NET Core:** không có backend .NET trong kiến trúc; thêm .NET sẽ tăng chi phí vận hành
  và không tương thích template/stack đã chọn. Không tạo project .NET rỗng.
- **Flutter Patterns:** không có yêu cầu ứng dụng di động; website responsive đáp ứng phạm vi.
- **customize-opencode:** bị loại trừ theo yêu cầu dự án.
