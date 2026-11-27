# HERO CENTER ALIGNMENT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Kết luận kiểm tra

Ba trục giữa đang **trùng nhau** trên PC ở cả `/vi` và `/en`:

1. Tâm container `home-intro-wide`.
2. Tâm ảnh KV (`.kv-hero-frame`).
3. Đường phân cách dọc giữa ô **6 hội trường** và **246 diễn giả**
   (`border-left` của ô thứ 3 trong `dl` thống kê).

Không phát hiện lệch trái trong mã hiện tại; không cần dịch chuyển container.

## 2. Số đo thực tế

Đo bằng Chrome CDP, viewport layout thật:

| Viewport | Tâm intro | Tâm KV | Divider thống kê | Lề intro trái/phải |
|---|---:|---:|---:|---:|
| 1366 | 683 | 683 | 683 | 63 / 63 |
| 1440 | 720 | 720 | 720 | 63 / 63 |
| 1920 | 960 | 960 | 960 | 240 / 240 |

- `html` có `scrollbar-gutter: stable both-edges` trên homepage desktop.
- `scrollWidth - innerWidth = -30`: hai gutter bằng nhau, không tràn.
- Container KV: x=35,w=1296 (1366); x=35,w=1370 (1440); x=180,w=1560 (1920).
- Stats `dl` center = intro center; border giữa halls/faculty = center.
- `/vi` và `/en` cùng số đo.

## 3. Nguyên nhân cảm giác lệch trước đây

- Scrollbar dọc desktop từng làm `mx-auto` căn trong vùng layout hẹp hơn viewport
  (~7,5px trái). Lần sửa trước đã thêm `scrollbar-gutter: stable both-edges`
  cho homepage desktop; hiện tại Vercel đã có thay đổi này.
- Nếu vẫn thấy lệch trên trình duyệt, cần hard refresh (cache CSS cũ) hoặc kiểm tra
  screenshot có bị cắt/DevTools/sidebar làm thay đổi viewport hay không.

## 4. File đã sửa lần này

- Không sửa CSS/TSX; chỉ thêm báo cáo này.
- CSS hiện tại liên quan:
  - `app/globals.css`: `.home-intro-wide { max-width: min(1440px, calc(100vw - 96px)); }`
  - `app/globals.css`: `html:has(.home-intro-wide) { scrollbar-gutter: stable both-edges; }`
  - `app/[locale]/page.tsx`: wrapper KV không còn `left` thủ công.

## 5. Xác nhận phạm vi

- Không đổi grid 1.15fr/0.85fr, gap, divider, KV size, stats, font, hiệu ứng.
- Tablet/mobile không có gutter, giữ bố cục hiện tại.
- Không có layout shift mới; CountUp/Typewriter không đổi.
