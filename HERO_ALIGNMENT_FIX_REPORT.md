# HERO ALIGNMENT FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Nguyên nhân

- Desktop Chromium dành ~15px bên phải cho scrollbar dọc. Vùng layout vì vậy hẹp hơn
  viewport; `mx-auto` chỉ căn giữa trong vùng layout đó, khiến container Hero/KV lệch
  trái ~7,5px so với tâm viewport thật.
- Các lần trước đã bù bằng `left: calc(...)`; đó là dịch chuyển thủ công, không phải
  căn giữa gốc. Đã bỏ hoàn toàn cách này.

## 2. Cách sửa

- Trên desktop, khi trang có `.home-intro-wide`:
  ```css
  html:has(.home-intro-wide) {
    scrollbar-gutter: stable both-edges;
  }
  ```
- Trình duyệt dành gutter **bằng nhau ở hai bên**; `mx-auto` của container giờ căn đúng
  tâm viewport.
- `.home-intro-wide` vẫn `max-width: min(1440px, calc(100vw - 96px))` để đủ chỗ cho
  dòng slogan tiếng Anh.
- Không dùng `translateX`, `left`, margin âm hoặc margin bù.
- Grid `1.15fr / 0.85fr`, gap, divider, nội dung, font, hiệu ứng giữ nguyên.

## 3. Kết quả đo (Chrome CDP)

| Viewport | Container | Tâm container | Tâm KV | Lề trái/phải |
|---|---:|---:|---:|---:|
| 1366 | 1240px @ x=63 | 683 | 683 | 63 / 63 |
| 1440 | 1314px @ x=63 | 720 | 720 | 63 / 63 |
| 1920 | 1440px @ x=240 | 960 | 960 | 240 / 240 |

- `/vi` và `/en` giống nhau.
- `scrollbar-gutter: stable both-edges`; `scrollWidth - innerWidth = -30` (không tràn).
- Divider giữ nguyên trong cột phải; khoảng cách chữ cuối slogan Anh:
  1366 **96px**, 1440 **104px**, 1920 **121px**.
- Mobile 768/390: gutter `auto`, container/KV vẫn tâm 384/195, không tràn.

## 4. File đã sửa

| File | Thay đổi |
|---|---|
| `app/globals.css` | Bỏ shift thủ công; thêm `scrollbar-gutter` desktop cho homepage |
| `app/[locale]/page.tsx` | Bỏ class `.kv-hero-shift` không còn dùng |
| `HERO_ALIGNMENT_FIX_REPORT.md` | Báo cáo |

## 5. Ngoài phạm vi

- Không đổi nội dung, font, màu, KV, divider, Typewriter, CountUp, Header/Footer.
- Tablet/mobile giữ nguyên.
- Chưa test Safari/Firefox/screen reader; kiểm bằng Chrome CDP.
