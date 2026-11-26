# HEADER TYPEWRITER FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Typewriter kích hoạt theo viewport

- Đã chuyển sang `IntersectionObserver`, cùng cơ chế CountUp:
  - threshold `0.35`;
  - chỉ bắt đầu khi H1 slogan vào viewport;
  - chạy một lần, `observer.disconnect()`;
  - không chạy lại khi cuộn lên/xuống.
- SSR giữ đầy đủ 2 dòng trong DOM/`aria-label`; sau hydrate vùng gõ được reserve trước.
- Tốc độ: **75 ms/ký tự**; nghỉ giữa hai dòng **320 ms**; giữ cursor nhấp nháy;
  ẩn cursor **1000 ms** sau ký tự cuối.
- Thứ tự: `Kết nối tri thức` → `Nâng tầm ghép tạng Việt Nam`.
- Reduced-motion / không có IntersectionObserver: giữ nguyên slogan đầy đủ, không animate.

Đo 1366:
- Trước khi cuộn: H1 y=907 (ngoài viewport), hai dòng rỗng, aside X=784.
- Cuộn vào H1: bắt đầu “Kết nối” → “Kết nối tri thức”, sau đó “Nân” → đầy đủ.
- Sau khi xong: đủ 2 dòng, cursor còn hiện; aside X vẫn 784.
- Cursor: chữ cuối `x=568`, cursor bắt đầu `x=575` → gap 7 px, không che `m`.

## 2. Footer 2018/2019/2021

- Địa chỉ và link Liên hệ cùng token `--vsot-footer-text: rgba(255,255,255,.78)`.
- Đo cả 3 năm: cùng màu, 14px, không underline; logo Footer vẫn có.

## 3. Khôi phục Header các năm cũ

- Xác định commit header sync: `e2da2b2` (`git show --stat e2da2b2`).
- Khôi phục có chọn lọc trạng thái trước sync:
  - `git restore --source=e2da2b2^ --worktree -- public/legacy` cho 62 HTML.
  - Xóa `public/legacy/shared/site-chrome.js` (file mới của lần sync).
  - Xóa `scripts/sync_legacy_header.py` (script mới của lần sync).
  - `site-chrome.css` trở về bản trước header sync; Footer giữ nguyên.
- Không dùng reset/revert toàn dự án; không đụng Header React 2026.
- Header archive trở lại trạng thái trước: logo + nav 5 mục đơn giản, **không** topbar,
  **không** dropdown toggle, **không** hamburger, **không** script header mới.
- Kiểm tra 2018/2019/2021/2022/2023/2025: `topbar=False`, `toggle=False`, `script=0`,
  Footer logo còn; 2018 header cao ~107px, 5 nav link.

## 4. File đã thay đổi lần này

| File | Thay đổi |
|---|---|
| `components/home/typewriter-slogan.tsx` | IntersectionObserver, tốc độ 75ms, pause 320ms |
| `public/legacy/**/*.html` (62 file) | Khôi phục Header trước sync |
| `public/legacy/shared/site-chrome.css` | Khôi phục CSS trước header sync |
| `public/legacy/shared/site-chrome.js` | Xóa file header sync |
| `scripts/sync_legacy_header.py` | Xóa script header sync |
| `HEADER_TYPEWRITER_FIX_REPORT.md` | Cập nhật báo cáo |

`app/globals.css` giữ cursor margin 7px và font slogan đã tinh chỉnh; không đổi CountUp.

## 5. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome headless/CDP:
  - Typewriter không chạy ở đầu trang (y 907 ngoài viewport); bắt đầu khi cuộn tới.
  - Chạy một lần; cursor gap 7px; aside X không đổi 784.
  - Header 2018/2019/2021/2022/2023/2025 đã về trạng thái đơn giản trước sync.
  - Footer 2018/2019/2021 vẫn đúng màu.
- Không đổi CountUp.

## 6. Tồn tại

- Vercel live chưa có commit mới; cần deploy commit này.
- Chưa test Safari/iOS, touch thật, screen reader.
- Header archive khôi phục là header tĩnh cũ (đúng trạng thái trước sync), không có
  dropdown/hamburger mới.
