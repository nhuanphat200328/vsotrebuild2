# HERO ALIGNMENT FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Nguyên nhân thực tế

- Desktop Chromium dùng scrollbar dọc cổ điển (~15px). Layout area là **viewport - 15px**
  (ví dụ 1905px ở màn 1920), trong khi `mx-auto` chỉ căn giữa trong layout area đó.
- Vì vậy container Hero và KV đều lệch trái **~7,5px** so với tâm viewport thực tế;
  ở 1920 lề trái 233px / lề phải 247px, tạo cảm giác cả khối 2 cột bị đẩy trái.
- `max-width:1440px` trước đó chỉ giải quyết chữ `Vietnam` chạm divider, không bù
  scrollbar nên vẫn còn lệch.

## 2. Cách sửa

- `.home-intro-wide`: giữ `max-width: min(1440px, calc(100vw - 96px))`.
- Thêm bù scrollbar cho đúng tâm viewport, không dùng margin âm:
  - `.home-intro-wide` và wrapper KV `.kv-hero-shift`:
    `position: relative; left: calc((100vw - 100%) / 2);`
  - `100vw - 100%` chính là bề rộng scrollbar; chỉ áp dụng `@media (min-width:1024px)`.
- KV frame vẫn giữ `position:relative` riêng; không còn bị cộng dồn offset.
- Không đổi grid 2 cột, divider, typography, KV ratio, hiệu ứng.

## 3. Kết quả đo (Chrome CDP)

| Viewport | Container | Tâm container | Tâm KV | Lề trái/phải |
|---|---:|---:|---:|---:|
| 1366 | 1270px @ x=48 | 683 | 683 | 48 / 48 |
| 1440 | 1344px @ x=48 | 720 | 720 | 48 / 48 |
| 1920 | 1440px @ x=240 | 960 | 960 | 240 / 240 |

- `/vi` và `/en` cho cùng kết quả.
- Divider vẫn nằm trong cột phải; khoảng cách chữ cuối slogan Anh:
  1366 **100px**, 1440 **107px**, 1920 **121px**.
- Không tràn ngang; `scrollWidth - innerWidth = 0` (scrollbar 15px của layout).
- Mobile 768/390: không áp dụng shift, container/KV vẫn tâm 384/195, không tràn.

## 4. File đã sửa

| File | Thay đổi |
|---|---|
| `app/[locale]/page.tsx` | Wrapper KV thêm class `.kv-hero-shift` |
| `app/globals.css` | Bù scrollbar cho intro + KV wrapper; max-width intro |
| `HERO_ALIGNMENT_FIX_REPORT.md` | Báo cáo |

## 5. Ngoài phạm vi

- Không sửa Header/Footer/statistics/trang con.
- Không đổi nội dung, font, màu, Typewriter, CountUp, divider, KV.
- Chưa test Safari/Firefox/screen reader; kiểm bằng Chrome CDP.
