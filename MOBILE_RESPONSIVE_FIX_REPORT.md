# MOBILE RESPONSIVE FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File | Thay đổi |
|---|---|
| `components/programme/programme-list.tsx` | Mobile: Abstract dòng riêng, báo cáo viên dòng dưới; desktop giữ 1 hàng |
| `app/[locale]/hoi-nghi/[year]/phien/[id]/page.tsx` | Cùng cấu trúc Abstract/báo cáo viên cho trang phiên |
| `components/faculty/faculty-directory.tsx` | Mobile: tên → badge vai trò → nút Hồ sơ; desktop giữ hàng ngang |
| `app/[locale]/hoi-nghi/[year]/dien-gia/[slug]/page.tsx` | Header hồ sơ padding mobile + class tên |
| `app/globals.css` | `.profile-name` một dòng trên mobile |
| `MOBILE_RESPONSIVE_FIX_REPORT.md` | Báo cáo |

## 2. Chương trình khoa học — Abstract / Báo cáo viên

- Wrapper mới: `flex flex-col gap-1 sm:flex-row sm:flex-wrap`.
- Abstract là link riêng, `w-fit`; nhóm “Báo cáo viên: tên + giờ” nằm trong div riêng
  phía dưới trên mobile, cùng hàng trên `sm` trở lên.
- Đo mobile 390: Abstract y=1328, nhóm báo cáo viên y=1348 (dòng dưới).
- Đo desktop 1366: cả hai y=960 (cùng hàng), bố cục desktop không đổi.
- Không đổi dữ liệu/thứ tự/thời gian/phòng.

## 3. Danh sách diễn giả — nút Hồ sơ

- Mobile: thứ tự name/affiliation (`order-1`), badge vai trò (`order-2`), action + nút Hồ sơ
  (`order-2` cấp li, full width) nằm dưới.
- Desktop: `sm:order-none`, role bên trái tên, nút bên phải như cũ.
- Đo mobile 390: name y=482, role y=532, action y=564.
- Desktop 1366: name/role cùng hàng, action x=1133 bên phải.
- Link/nút vẫn cùng href hồ sơ, không đổi route.

## 4. Hồ sơ diễn giả — tên một dòng

- Header mobile giảm padding `p-3 sm:p-8`; H1 thêm `.profile-name`.
- Mobile CSS: `font-size: clamp(0.625rem, 2.8vw, 1.4rem)`, `white-space: nowrap`,
  letter-spacing nhẹ; desktop giữ `text-3xl`.
- Test tên dài nhất thực tế:
  `PGS.TS. Dương Đức Hùng – PGS.TS. Phùng Duy Hồng Sơn` (51 ký tự)
  - 360: font 10.08px, scrollWidth = clientWidth = 294, page overflow 0.
  - 390: font 10.92px, width 324 = client 324, overflow 0.
  - Desktop 1366: font 30px, một dòng, không ảnh hưởng.
- Không ellipsis, không cắt; tên dài buộc font nhỏ trên mobile.

## 5. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome headless/CDP 390/360/1366:
  - Programme mobile 2 dòng; desktop 1 hàng.
  - Faculty mobile name→role→button; desktop hàng ngang.
  - Profile dài nhất một dòng, không tràn ngang.
  - `document.documentElement.scrollWidth - innerWidth = 0` ở 360/390.
- Không thay đổi nội dung/dữ liệu/URL.

## 6. Tồn tại

- Live Vercel chưa có commit mới; cần deploy.
- Chưa test Safari/iOS/touch thật, screen reader; chưa kiểm toàn bộ tên dài ngoài mẫu dài nhất.
- Tên 51 ký tự phải dùng font ~10px để giữ một dòng; đây là đánh đổi bắt buộc của yêu cầu.
