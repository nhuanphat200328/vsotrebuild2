# MOBILE MENU FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File | Thay đổi |
|---|---|
| `components/layout/site-header.tsx` | Bỏ link Hội nghị trùng; đổi button Hội nghị 2025 → Hội nghị; đóng khi chạm ngoài; ref header; menu mobile có trạng thái animation |
| `app/globals.css` | `.mobile-menu-panel` scale/fade, `:active` scale, reduced-motion |
| `MOBILE_MENU_FIX_REPORT.md` | Báo cáo |

Không thay đổi desktop nav, logo, màu, font, Header page 2026.

## 2. Cấu trúc menu mobile

Trước: `Trang chủ` → link `Hội nghị` → button `Hội nghị 2025` (submenu) →
button `Hội nghị các năm` → `Tin tức` → `Liên hệ`.

Sau:
- `Trang chủ`
- `Hội nghị` (button accordion, chứa các link con:
  Chương trình, Tổng quan, Diễn giả, Hội nghị 2026)
- `Hội nghị các năm` (button accordion, chứa 2025/2023/2022/2021/2019/2018)
- `Tin tức`, `Liên hệ`, chuyển ngôn ngữ.

Không còn mục cha `Hội nghị 2025` riêng; không còn link `Hội nghị` trùng.
Cấu trúc phân cấp tương ứng PC (Hội nghị hiện tại + Hội nghị các năm).

## 3. Đóng menu khi chạm ngoài

- Thêm `headerRef`; `pointerdown` trên document khi menu mở.
- Nếu target ngoài `<header>`: đóng menu + đóng submenu.
- Target bên trong menu/submenu: không đóng.
- Hamburger và link trong menu xử lý click hiện tại; link điều hướng vẫn đóng menu.
- Không tạo backdrop/overlay; menu đóng thì `visibility:hidden`, `pointer-events` không chặn.

## 4. Hiệu ứng

CSS `.mobile-menu-panel`:
- Đóng: `max-height:0`, `opacity:0`, `transform:scale(.97)`, `visibility:hidden`,
  transition 0.2–0.22s.
- Mở: `max-height:calc(100svh - 72px)`, `opacity:1`, `transform:scale(1)`,
  `visibility:visible`, scroll nếu dài.
- Mục menu trên thiết bị `hover:none`: `:active { transform: scale(.97) }`,
  transition 0.18s; nhả tay trở lại scale 1.
- `prefers-reduced-motion`: tắt transition/scale.
- Chỉ áp dụng trong `.mobile-menu-panel`; desktop không bị ảnh hưởng.

## 5. Kiểm thử (Chrome CDP, mobile 390)

- Đóng ban đầu: `visibility:hidden`, `opacity:0`, `scale(.97)`, max-height 0.
- Mở: `is-open`, opacity 1, scale 1, max-height 772px; item top-level:
  `Trang chủ, Hội nghị, Hội nghị các năm, Tin tức, Liên hệ, English`.
- Bấm Hội nghị: submenu 4 link gồm Chương trình/Tổng quan/Diễn giả/Hội nghị 2026.
- Bấm Hội nghị các năm: 6 link năm đúng thứ tự.
- `pointerdown` ngoài header: menu đóng (`aria-hidden=true`, `visibility:hidden`).
- `pointerdown` trong menu: menu vẫn mở.
- Desktop 1366: `#mobile-menu` display none, desktop nav display flex, không overflow.
- Không có mục `Hội nghị 2025` ở top-level mobile.

## 6. Tồn tại

- Menu mobile vẫn là panel trong flow (mở rộng header), không phải overlay; phù hợp hiện tại.
- Chưa test Safari/iOS, touch thật và screen reader; `:active` scale được kiểm qua CSS,
  chưa đo trực tiếp trên thiết bị.
- Live Vercel chưa có commit mới; cần deploy.
