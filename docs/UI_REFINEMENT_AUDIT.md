# UI REFINEMENT AUDIT

## 1. Hiện trạng trước khi sửa

- Hero cũ dùng KV làm `background` với overlay navy + toàn bộ tiêu đề/CTA đè lên ảnh:
  làm che KV và trùng thông tin nếu KV đã có chữ.
- Section "Về Hội" nằm ngay sau stats, nội dung giới thiệu bị tách khỏi hero.
- Trang chủ chỉ hiển thị 3 tin; 2 tin mới (thông báo số 2, thư mời tài trợ) không lên trang chủ.
- Archive 2018–2025 dùng header/footer v1 chèn sẵn, khác font/màu/kích thước với site mới.
- 2023 là trang HTML cũ có nhiều khối giới thiệu, dù chỉ còn PDF.
- Chưa có hiệu ứng reveal; hover chủ yếu đổi màu.
- Chưa có nút Abstract theo từng bài báo cáo.

## 2. Phạm vi sửa

| Thành phần | File |
|---|---|
| Hero/KV + intro | `app/[locale]/page.tsx` |
| Tin tức | homepage, `/[locale]/tin-tuc`, news data |
| Archive chrome | `scripts/sync_legacy_chrome.py`, `public/legacy/shared/site-chrome.css` |
| 2023 | generator trong script, `public/legacy/2023/index.html` |
| Abstract | `lib/programme/*`, `components/programme/programme-list.tsx`, session page, route abstract |
| Effects | `app/globals.css`, `site-chrome.css` |

## 3. Rủi ro

- Sửa 62 file archive có thể mất header/footer gốc → chỉ thay chrome, giữ nội dung; đã kiểm 2018/2025.
- KV có tỷ lệ 1921×1081; dùng `width/height` + `h-auto` để không crop.
- Abstract HTML từ nguồn: dùng iframe local + `sandbox`; không chèn HTML trực tiếp.
- 17 poster có abstract nhưng không có presentation trong DB → không gắn nút.
