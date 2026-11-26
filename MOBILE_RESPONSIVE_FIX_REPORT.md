# MOBILE RESPONSIVE FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File | Thay đổi |
|---|---|
| `components/programme/programme-list.tsx` | Abstract dòng riêng; thời gian presentation xuống dòng cuối trên mobile |
| `app/[locale]/hoi-nghi/[year]/phien/[id]/page.tsx` | Cùng layout Abstract/báo cáo viên/thời gian mobile |
| `components/faculty/faculty-directory.tsx` | Mobile: name → role badge → nút Hồ sơ → số báo cáo |
| `app/[locale]/hoi-nghi/[year]/dien-gia/[slug]/page.tsx` | Tên hồ sơ dùng font mobile theo độ dài; padding mobile |
| `app/globals.css` | `.profile-name` dùng `--profile-name-size` |
| `MOBILE_RESPONSIVE_FIX_REPORT.md` | Báo cáo |

## 2. Chương trình khoa học

- Abstract vẫn nằm dòng riêng; “Báo cáo viên: Tên + giờ” nằm dưới trên mobile.
- Thời gian presentation thêm `max-sm:basis-full` → xuống dòng cuối của khối bài báo cáo.
- Đo mobile 390: speaker y=1350, time y=1372 (time dòng cuối).
- Desktop 1366: speaker và time cùng y=960 (không đổi).
- Không đổi dữ liệu/thứ tự/thời gian/phòng.

## 3. Danh sách diễn giả

- Mobile thứ tự: tên/đơn vị → badge vai trò → nút Hồ sơ → số báo cáo.
- Nút Hồ sơ dùng `max-sm:order-1`; số báo cáo `max-sm:order-2`.
- Đo 390: role badge x=37; nút Hồ sơ x=37 (cùng lề trái); name y=482,
  role y=532, action/button y=564.
- Desktop: role/tên cùng hàng, action bên phải; không đổi.
- Nút vẫn cùng href/profile route.

## 4. Chi tiết diễn giả

- Tên lấy font theo độ dài trên mobile qua CSS variable:
  - ≤36 ký tự: **14px** (bằng dòng “Thứ bảy, 17/10/2026” — 14px);
  - 37–44 ký tự: 11.5px;
  - >44 ký tự: 10px.
- Tên dài nhất thực tế 51 ký tự: một dòng, `scrollWidth=clientWidth=294` ở 360;
  không cắt/ellipsis/tràn ngang.
- Tên thường (VD `TS.BS. Châu Quý Thuận`): 14px, bằng cỡ dòng ngày.
- Desktop vẫn `text-3xl` (30px); không đổi.

## 5. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome CDP 390/360/1366:
  - Time mobile dòng cuối; desktop cùng hàng.
  - Button Hồ sơ lề trái trùng badge (x=37), nằm dưới badge, trước số báo cáo.
  - Profile dài 51 ký tự một dòng; 390/360 không tràn ngang.
  - Không thay đổi desktop.

## 6. Tồn tại

- Live Vercel chưa có commit mới; cần deploy.
- Chưa test Safari/iOS, touch thật, screen reader.
- Tên ghép 51 ký tự buộc dùng 10px để giữ một dòng; tên thường 14px đúng yêu cầu.
