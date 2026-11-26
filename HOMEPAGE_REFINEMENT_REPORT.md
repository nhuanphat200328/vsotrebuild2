# HOMEPAGE REFINEMENT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã chỉnh sửa

| File | Thay đổi |
|---|---|
| `app/[locale]/page.tsx` | Hero KV, giới thiệu, bố cục tin tức trái, reveal, thứ tự tin |
| `components/layout/site-header.tsx` | Logo chính thức thay badge chữ VSOT |
| `components/programme/programme-list.tsx` | Abstract trước báo cáo viên, heading tách khỏi nội dung đánh số |
| `app/[locale]/hoi-nghi/[year]/phien/[id]/page.tsx` | Abstract trước presenter, render tiêu đề nhiều dòng/đánh số |
| `components/programme/programme-grid.tsx`, `programme-table.tsx` | Dùng heading 1 dòng, không dồn nội dung dài vào card |
| `components/programme/programme-text.tsx` (mới) | Parser text nhiều dòng → `p`, `ol`, `ul` |
| `lib/programme/model.ts`, `lib/utils/text.ts` | Helper heading/body |
| `app/globals.css` | `.kv-hero-image`, reveal scroll-driven |
| `supabase/migrations/0027_news_order_thong_bao_1.sql` | `sort_order`, tiêu đề TB1, tệp TB1 |
| `public/media/2026/news/thong-bao-1.pdf` | Tệp gốc TB1 |
| `docs/*`, `HOMEPAGE_REFINEMENT_REPORT.md` | Báo cáo |

## 2. Tin tức/thông báo

- Bổ sung/xác lập **Thông báo số 1**: đổi tiêu đề bản ghi `tuan-le-hien-ghep-mo-tang-2026` thành
  “Thông báo số 1: Tuần lễ Hiến và Ghép mô tạng Việt Nam 2026”.
- Thêm tệp gốc `materials/thong-bao-1.pdf` vào tin; vẫn giữ PDF chương trình khung.
- Thứ tự DB: TB1 (10) → TB2 (20) → abstract (30) → Record VN (40) → thư mời tài trợ (50).
- Bố cục: chuyển danh sách tin/thông báo vào **cột trái**, ngay dưới phần “Về Hội Ghép tạng
  Việt Nam”; cột phải giữ ngày hội nghị + liên kết chương trình/diễn giả. Bỏ section tin tức
  full-width riêng để không lặp và tận dụng khoảng trống.
- Mobile: grid tự về 1 cột, tin xếp dọc, không tràn ngang.

## 3. KV

- KV 1921×1081 hiển thị đủ, không dùng `background-size` cắt ảnh.
- `.kv-hero-image`: `width:auto; max-width:100%; height:auto; margin-inline:auto;
  max-height:calc(100svh - 112px)` desktop (trừ header + top bar), `calc(100svh - 76px)` mobile.
- Giữ tỷ lệ; phần dư hai bên dùng nền navy, không crop chủ thể.

## 4. Logo header

- Nguồn: `PrototypeClone/public_html/hoinghi2026/asset/logo1507104171.gif`
  (bản sao `public/media/2026/logo.gif`).
- Header thay `<span>VSOT</span>` bằng `<Image src="/media/2026/logo.gif" width=48 height=42
  className="h-11 w-auto">`, giữ tên Hội và tên tiếng Anh bên cạnh.
- Footer/hero dùng cùng logo; không kéo giãn (`w-auto`).

## 5. Abstract

- `ProgrammeList` và trang phiên hiển thị `[Abstract]` trước `Báo cáo viên: Tên`.
- Chỉ render khi `hasAbstract(presentation)` (105 bài đã map); bài không có file không có nút.
- Link giữ nguyên route `/vi/hoi-nghi/2026/bao-cao/<id>/abstract`.
- Kiểm mẫu HTML: `...</svg>Abstract</a><span>Báo cáo viên:</span><a>...`.

## 6. Nội dung đánh số

- `ProgrammeText` tách dòng, nhận `1.`, `2.`… thành `<ol><li>`, bullet thành `<ul>`, dòng
  thường thành `<p>`. Danh sách tiếng Việt/tiếng Anh bắt đầu lại `1` sẽ thành hai `<ol>` riêng.
- Áp dụng: tiêu đề phiên nhiều dòng (KHAI MẠC/OPENING…), nội dung mở rộng trong list,
  tiêu đề presentation dạng info, trang chi tiết phiên.
- Grid/Table chỉ dùng heading 1 dòng để không phá timeline; nội dung đầy đủ ở trang phiên.

## 7. Hiệu ứng

- KV không overlay; reveal section bằng CSS `animation-timeline: view()` trong `@supports`,
  bỏ qua khi `prefers-reduced-motion: reduce`.
- Áp dụng cho giới thiệu/tin tức, stats, chương trình, tài liệu, archive, CTA.
- Hover nav/link/button/ảnh archive; CountUp giữ nguyên.

## 8. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- `/vi`: TB1 trước TB2; 5 tin; logo `/media/2026/logo.gif`; KV class mới; reveal class có mặt.
- Trang KHAI MẠC: có `<ol>`, đủ mục 5, có danh sách tiếng Anh.
- Trang chương trình ngày 16/10: Abstract đứng trước “Báo cáo viên”.
- 2023/archive không đổi trong lần này.

## 9. Chưa xử lý

- Chưa QA bằng trình duyệt thật/DevTools; chưa đo FPS animation, chưa xác nhận KV trên
  Safari iOS.
- 17 poster abstract chưa có nút vì chưa có presentation trong DB.
- Tin không có ngày đăng nguồn → `published_at = NULL`.
- Các trang archive dùng chrome tĩnh, không phải React header.
