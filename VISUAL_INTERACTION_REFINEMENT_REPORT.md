# VISUAL INTERACTION REFINEMENT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File/khu vực | Thay đổi |
|---|---|
| `app/[locale]/page.tsx` | Nền KV, slogan, tin/thông báo, hover-slide, bỏ “Ưu tiên” |
| `app/globals.css` | `.hero-slogan`, `.hover-slide`, giới hạn KV theo `svh` |
| `components/ui/count-up.tsx` | CountUp 1,8s + nhấn mạnh 1,5s |
| `components/layout/site-header.tsx` | Logo chính thức thay badge chữ |
| `supabase/migrations/0028_news_categories.sql` | TB1 + TB2 → chuyên mục `thong-bao` |
| `public/legacy/shared/site-chrome.css` | Footer logo, font/color isolation |
| 62 trang `public/legacy/**/*.html` | Thêm logo footer; giữ nội dung |
| `scripts/sync_legacy_chrome.py` | Chrome/footer logo cho lần tạo sau |
| `public/media/2026/news/thong-bao-1.pdf` | Tệp TB1 |
| `scripts/upload_media.py` | Upload TB1 |
| `docs/*`, báo cáo này | Cập nhật tài liệu |

## 2. Nền KV và slogan

- KV nằm trong section nền `linear-gradient(#EEF1FA → #FFF → #F6F9FC)` + 2 blob
  `brand-100/gold-100` `blur-3xl`, không phủ lên ảnh.
- KV hiển thị đủ tỷ lệ; giới hạn `max-height: calc(100svh - 160px)` desktop,
  `calc(100svh - 76px)` mobile; căn giữa.
- Đo bằng Chrome DevTools: KV bottom 742/768 (1366), 874/900 (1440),
  1012/1080 (1920); mobile 295/844.
- Slogan `.hero-slogan`: `max-width:26ch`, `text-align:justify`, font
  `clamp(1.5rem,3.2vw,3rem)`, mobile `clamp(1.4rem,6vw,1.9rem)`, line-height 1.15.
- Đo: 2 dòng tại 1920/1440/1366/768/390/375/360; không tràn ngang.

## 3. Thông báo

- Migration 0028 đổi `tuan-le-hien-ghep-mo-tang-2026` và `thong-bao-so-2-vsot-2026`
  sang chuyên mục `thong-bao`.
- Trang chủ bỏ nhãn “Ưu tiên”; mọi tin cùng `text-base`, mô tả/nút/tệp cùng format.
- TB1 vẫn đứng trước TB2 bằng `sort_order` 10/20; không dùng style riêng.
- TB1 có thêm PDF gốc `thong-bao-1.pdf`; không đổi tài liệu cũ.

## 4. CountUp

- Tổng count: 1.800 ms; easing `1-(1-p)^3`.
- Khi đạt đích: set scale 1.08 + màu `#d9480f` (cam đỏ), transition 700 ms;
  sau 800 ms trả scale 1 và màu gốc, transition 700 ms → tổng nhấn mạnh ~1,5 s.
- Không đổi font-size/layout; `transform-origin: center`.
- Một lần/scroll; `prefers-reduced-motion` hiển thị số cuối.
- DevTools: tại 1,9 s transform `matrix(1.02342…)`, màu chuyển; kết thúc
  `matrix(1)` + màu `rgb(35,39,102)`.

## 5. Footer các năm

- Tất cả 62 trang archive có `vsot-archive-footer-logo` (`/media/2026/logo.gif`,
  56×49) trong cột giới thiệu Hội.
- 2018/2019/2021: font `Be Vietnam Pro`, 13px, màu `rgba(255,255,255,.78)`,
  `text-decoration:none`; hover trắng + underline.
- Nguyên nhân lỗi cũ: stylesheet legacy `a:link`/`BODY`/`div` (Tahoma, #222)
  có specificity/order đè footer; đã cách ly bằng selector
  `.vsot-archive-footer .vsot-archive-footer-grid ...` và font/color rõ ràng,
  không dùng override tạm cho toàn trang.

## 6. Hover overlay

- `.hover-slide` dùng `::before` absolute, `scaleX(0)`, `transform-origin:left`,
  `transition .35s`; nội dung `z-index:1`.
- Màu `rgba(100,116,139,.09)`; không opacity container, chữ giữ màu.
- Áp dụng: ngày hội nghị, Chương trình/Diễn giả/Tổng quan, tin tức (home + list).
- Chỉ hover khi `(hover:hover)`; `:focus-visible` hiện overlay; reduced-motion tắt transition.
- DevTools: trước `matrix(0,…)`, sau hover `matrix(1,…)`, text color không đổi.

## 7. Logo

- Nguồn: `PrototypeClone/public_html/hoinghi2026/asset/logo1507104171.gif`
  → `public/media/2026/logo.gif`.
- Header, hero, footer React và footer archive dùng cùng file; giữ tỷ lệ.

## 8. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome headless + DevTools Protocol: 1920/1440/1366/768/390/375/360; slogan 2 dòng,
  không overflow; KV nằm trong viewport desktop.
- Footer 2018/2019/2021: font/màu/decoration đúng chuẩn; logo hiện.
- Hover overlay scaleX 0→1, chữ không đổi màu; CountUp có scale/màu cuối rồi trả về.
- Granularity: chưa test Safari/iOS thật, chưa test touch device; Vercel chưa deploy code mới.

## 9. Tồn tại

- Live Vercel hiện chưa có code mới (cần deploy commit sau).
- 17 poster abstract chưa có nút vì DB chưa có presentation poster.
- 5 tin không có ngày đăng nguồn → `published_at = NULL`.
- Footer archive vẫn là chrome tĩnh, không phải React header.
