# FINAL UI REFINEMENT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File | Thay đổi |
|---|---|
| `app/[locale]/page.tsx` | Grid `minmax(0,…)`, `min-w-0`, vị trí slogan/aside |
| `app/globals.css` | Slogan width/min-height, timeline card & hover |
| `components/home/conference-timeline.tsx` | Card năm + dot |
| `public/legacy/shared/site-chrome.css` | `--vsot-footer-text` áp cho địa chỉ/liên kết |
| `FINAL_UI_REFINEMENT_REPORT.md` | Báo cáo này |

## 2. Footer 2018 / 2019 / 2021 — màu địa chỉ

- Thêm token `--vsot-footer-text: rgba(255, 255, 255, 0.78)`.
- Áp cho `.vsot-archive-footer`, `p`, `li` và link trong grid.
- DevTools cả 2018/2019/2021:
  - địa chỉ `p`: `rgba(255, 255, 255, 0.78)`
  - link liên hệ: `rgba(255, 255, 255, 0.78)`
  - font 14px, `text-decoration: none`.
- Không đổi nội dung, vị trí, khoảng cách.

## 3. Typewriter layout shift

**Nguyên nhân:** cột grid dùng `1.15fr / 0.85fr` với auto min-content; H1 co theo nội dung
đã gõ, làm track trái thay đổi và đẩy aside/đường kẻ.

**Sửa:**
- Grid: `lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]`.
- Thêm `min-w-0` cho cột trái và aside.
- `.hero-slogan { width:100%; min-height:2.3em; }`.
- `.type-line { width:100%; min-height:1.15em; }`.

**Đo 1366 (4 trạng thái: trước gõ, dòng 1, dòng 2, xong):**
- H1 width = 589px, cột trái = 589px, aside X = 784px, aside width = 435px — không đổi.
- Nội dung lần lượt: “Kết nối tri” → “Kết nối tri thức / Nâng tầm…” → đủ 2 dòng.
- Không còn dịch chuyển line dọc/khối thông tin hội nghị.

## 4. Timeline card năm

- Mỗi năm nằm trong `.timeline-card` (viền, radius 6px, nền trắng), vẫn là link.
- Giữ nguyên thứ tự tăng dần và rail/arrow hiện có.
- Hover overlay `::before`: `transform: scaleY(0→1)`, `transform-origin: top center`,
  transition 0.35s; nội dung năm `z-index: 1`.
- Màu overlay dùng token dot: `var(--color-gold-500)` = **#F5B53D**, pha 32% trong suốt
  (`color-mix`); hover dot/border cũng `#F5B53D`.
- Chỉ hover trên `(hover:hover)`; focus-visible có overlay/border/outline.
- DevTools desktop: card 60×35; overlay `scaleY` 0→1; border và dot chuyển
  `rgb(245,181,61)`; chữ năm giữ `rgb(35,39,102)`.
- Mobile 360: card 46×30, 6 card, không tràn ngang.

## 5. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome headless/CDP desktop 1366 + mobile 360.
- Footer 2018/2019/2021 đo màu địa chỉ/link; timeline hover/card; slogan 4 trạng thái.
- Không thay đổi dữ liệu/route/nội dung hội nghị.

## 6. Tồn tại

- Chưa deploy Vercel commit mới; live có thể chưa có code này.
- Chưa test Safari/iOS, touch thật, screen reader và reduced-motion bằng mắt;
  logic CSS `prefers-reduced-motion` giữ nguyên từ trước.
- Timeline card dùng `color-mix`, cần trình duyệt hiện đại (Chrome/Edge/Safari mới).
- 2020/2024 vẫn không có dữ liệu nguồn.
