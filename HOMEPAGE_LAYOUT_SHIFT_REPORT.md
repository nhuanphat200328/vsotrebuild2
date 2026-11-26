# HOMEPAGE LAYOUT SHIFT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Nguyên nhân

- KV trước đây để chiều cao do ảnh quyết định (`width/height` + `max-height`), trong khi
  layout phía dưới phụ thuộc chiều cao thực tế của ảnh; khi ảnh/asset/CSS tải xong,
  section KV đổi chiều cao và đẩy CountUp/slogan vào viewport tạm thời.
- `IntersectionObserver` của CountUp/Typewriter được đăng ký ngay khi mount, nên có thể
  bắt trạng thái layout tạm trong lúc ảnh/font chưa ổn định.
- Điều hướng từ trang con về `/vi` là client-side navigation: component mount lại,
  observer có thể chạy khi trang chưa hoàn tất bố cục.

## 2. Cách xử lý

### KV

- Thêm khung cố định `.kv-hero-frame`:
  - `width:100%`, `aspect-ratio:1921/1081`, `max-height:calc(100svh - 160px)` desktop,
    `calc(100svh - 76px)` mobile, `overflow:hidden`.
  - Ảnh chính dùng `fill` + `object-contain` trong khung; ảnh nền blur vẫn `absolute`,
    không tham gia tính chiều cao.
- Khung giữ chỗ trước khi ảnh tải xong; ảnh không còn quyết định chiều cao section.
- Giữ nguyên tỷ lệ/focal point, kích thước hiển thị tối đa như trước.

### Ổn định trước khi quan sát

- Thêm `lib/utils/animation.ts` → `afterLayoutStable()`: chờ 2 animation frame +
  `document.fonts.ready` + 80ms.
- CountUp và Typewriter chỉ tạo `IntersectionObserver` sau bước này.
- Cả hai dùng `threshold: 0.3`, `rootMargin: "0px 0px -10% 0px"`.
- Mỗi animation chỉ chạy một lần (`started`); reduced-motion giữ hành vi cũ.
- Không đổi tốc độ, số liệu, nội dung, vị trí, routing.

## 3. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome CDP desktop 1366:
  - Trang chủ tải bình thường: frame KV **1311×608**, top 134; slogan top 907,
    stats top 1119 — ổn định tại 0.2/0.5/1/2s.
  - Chặn request `_next/image`: frame vẫn **608px** tại 1.2s và 3.0s; stats/slogan
    không đổi vị trí.
  - Đầu trang: Typewriter lines rỗng, CountUp giữ giá trị SSR **246** (không tự chạy).
  - Cuộn tới CountUp: bắt đầu (62 → 246), rồi nhấn mạnh màu/scale như cũ.
  - Cuộn tới slogan: Typewriter chạy 2 dòng; layout/aside không đổi.
- Layout-shift observer trong điều kiện CSS bị throttle rất chậm chỉ ghi shift nhỏ ở
  header (CSS chưa tải), không phải dịch chuyển do ảnh KV; ở tải bình thường khung KV
  giữ nguyên từ đầu.
- Mobile 390/360: khung aspect-ratio giữ nguyên; không đổi thiết kế.

## 4. File đã sửa

| File | Thay đổi |
|---|---|
| `app/[locale]/page.tsx` | Khung `.kv-hero-frame` + ảnh `fill/object-contain` |
| `app/globals.css` | CSS khung KV aspect-ratio/max-height |
| `lib/utils/animation.ts` (mới) | Gate sau layout + fonts |
| `components/ui/count-up.tsx` | Observer sau gate, rootMargin/threshold |
| `components/home/typewriter-slogan.tsx` | Observer sau gate, rootMargin/threshold |
| `HOMEPAGE_LAYOUT_SHIFT_REPORT.md` | Báo cáo |

## 5. Tồn tại

- Nếu CSS của toàn site bị chặn rất lâu, trình duyệt vẫn hiển thị trang chưa style trước
  khi CSS tải; đây là layout shift do stylesheet, không phải do ảnh KV. Khung KV đã cố
  định khi CSS có mặt.
- Chưa test Safari/Firefox, thiết bị thật, screen reader.
- Live Vercel chưa deploy thay đổi này.
