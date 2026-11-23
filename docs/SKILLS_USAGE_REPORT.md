# SKILLS USAGE REPORT (Phase 2)

Ngày: 2026-11-23. Đã đọc lại `SKILL.md` của 8 skill global. Không dùng `customize-opencode`.

| Skill | Áp dụng trong phase này | File/bằng chứng |
|---|---|---|
| Frontend Design | Thiết kế lại trang chủ theo editorial, hero KV, dải stats, tin tức dạng danh sách, tài liệu/thư mời, archive; bỏ card bo lớn | `app/[locale]/page.tsx`, `components/layout/*`, `globals.css` |
| Code Review | Rà diff: RLS tin không ngày, sitemap static thiếu tin, CountUp setState-in-effect, link archive, dữ liệu mâu thuẫn | migrations 0020/0021, `components/ui/count-up.tsx`, `app/sitemap.ts` |
| SEO Optimization | Metadata tin/archive, sitemap động gồm tin tức, canonical, JSON-LD giữ nguyên | `app/sitemap.ts`, các `generateMetadata`, `lib/utils/seo.ts` |
| .NET Core | Không áp dụng: không có thành phần .NET; không tạo backend .NET | Ghi nhận trong báo cáo |
| Architecture Diagrams | Đã có sơ đồ HTML; kiến trúc bổ sung luồng archive/tài liệu | `docs/architecture-diagram.html`, `SYSTEM_ARCHITECTURE.md` |
| Mermaid Diagrams | Luồng archive, asset migration, publish tin không ngày | `docs/CONFERENCE_ARCHIVE_PLAN.md`, `docs/ASSET_MIGRATION_PLAN.md`, `docs/DATABASE_UPDATE_PLAN.md` |
| Flutter Patterns | Không áp dụng: dự án web; không tạo app Flutter | Ghi nhận trong báo cáo |
| Tailwind CSS | Tailwind 4 CSS-first, token navy/gold, responsive 2/3/6 cột, không class động | `app/globals.css`, homepage, header/footer |

## Quyết định kỹ thuật đáng chú ý

1. **Tin không ngày**: sửa RLS cho `published_at IS NULL` thay vì bịa ngày (0020).
2. **Mô tả mâu thuẫn**: dùng mô tả trung tính, không đăng "lần X/TP.HCM" (0021).
3. **Sitemap**: chuyển sang `force-dynamic` để phản ánh tin mới; đã kiểm 20 URL.
4. **CountUp**: sửa lint bằng `requestAnimationFrame` cho nhánh reduced-motion; vẫn tôn trọng
   `prefers-reduced-motion`.
5. **Archive**: DB-driven + file tĩnh local; không phụ thuộc domain cũ.
6. **Novena**: chỉ dùng cảm hứng bố cục; không trộn Bootstrap với Tailwind.

## Skill không áp dụng trực tiếp

- **.NET Core** và **Flutter Patterns**: kiến trúc hiện tại là Next.js + Supabase; thêm
  backend/mobile riêng sẽ tăng chi phí và không có yêu cầu. Đã đọc skill và đánh giá phạm vi.

## Hạn chế

- Skill Frontend Design chưa thể kiểm bằng mắt trên trình duyệt; cần QA thủ công.
- Chưa có Playwright/Lighthouse trong môi trường này.

## Phase 3 — Storage & extra news

Đã áp dụng lại 8 skill; bổ sung: Storage metadata (`mediaUrl`), mở rộng query tài liệu/tin,
tin mới, logo hero, CountUp SSR. Code Review phát hiện lỗi escape import/JSX và đã sửa.
.NET Core/Flutter không áp dụng. Xem `SKILLS_USAGE_REPORT.md` gốc và các báo cáo trong `docs/`.
