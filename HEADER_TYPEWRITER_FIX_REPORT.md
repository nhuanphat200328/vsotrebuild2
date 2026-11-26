# HEADER TYPEWRITER FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Nguyên nhân Typewriter chạy sau khi cuộn

- Đã kiểm tra `components/home/typewriter-slogan.tsx`: component **không** dùng
  `IntersectionObserver` hay scroll event. Hiệu ứng bắt đầu bằng `useEffect` + timer 0 ms
  ngay sau khi component mount.
- Nguyên nhân cảm giác “chỉ chạy sau khi cuộn” trên bản deploy cũ là code cũ/ảnh hưởng
  vị trí slogan; code hiện tại không phụ thuộc scroll và chạy ngay khi trang hydrate.
- Không thêm cơ chế chờ viewport mới; chạy một lần, không lặp khi cuộn.
- Vùng slogan đã có chiều rộng/chiều cao cố định từ trước (`width:100%`, `min-height:2.3em`,
  grid `minmax(0,…)`) để không dịch line/aside.

## 2. Sửa con trỏ Typewriter

- Cursor tách thành `span.type-cursor` sau nội dung dòng, không dùng khoảng trắng trong text.
- Tăng khoảng cách cursor: `margin-left: 7px`; cursor rộng 2px.
- Đo khi dòng 2 hoàn tất tại 1366:
  - chữ cuối `m` kết thúc `x=568`
  - cursor bắt đầu `x=575`, gap 7px, không chồng chữ.
- Line 1/line 2 có `scrollWidth == clientWidth` ở 1920/1366/768/390/360; không tràn.

## 3. File đã thay đổi

| File | Nội dung |
|---|---|
| `components/home/typewriter-slogan.tsx` | Giữ trình tự gõ, cursor tách khỏi text |
| `app/globals.css` | `type-cursor` margin 7px; giới hạn font slogan để vừa 2 dòng |
| `scripts/sync_legacy_header.py` (mới) | Sinh header năm-aware cho archive |
| `public/legacy/shared/site-chrome.js` | Hamburger, dropdown, mobile accordion, Escape/outside close |
| `public/legacy/shared/site-chrome.css` | Topbar, nav, dropdown, mobile menu, focus/hover |
| 62 trang `public/legacy/**/*.html` | Header mới, giữ Footer/nội dung |
| `HEADER_TYPEWRITER_FIX_REPORT.md` | Báo cáo |

## 4. Header các trang hội nghị cũ

Đã áp dụng cho **62 HTML** của 2018/2019/2021/2022/2023/2025 (gồm trang con):
- Topbar: địa chỉ, điện thoại, email.
- Header 72px sticky + logo 48×42 + tên Hội hai dòng.
- Desktop nav: Trang chủ, Hội nghị (dropdown kho lưu trữ đúng năm), Hội nghị các năm
  (dropdown 2025/2023/2022/2021/2019/2018), Tin tức, Liên hệ.
- Nút Liên hệ, hamburger mobile; mobile menu accordion hai nhóm.
- Link không trỏ 2026; “Hội nghị” trỏ `/legacy/<year>/index.html`.
- JavaScript: mở/đóng dropdown bằng click, mobile menu, accordion, Escape/click ngoài.
- Sticky, focus-visible, hover; responsive 1280/1023/560.
- Header đo 109px (topbar 36 + bar 72 + border), 2 dropdown, 6 link năm; mobile
  topbar/nav ẩn, hamburger hiện; mobile menu mở được; không tràn ngang.
- Kiểm tra 2018, 2025, 2022/full-programme.htm, 2023: đều có header mới, 1 script,
  không còn header v1.

## 5. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome headless/CDP:
  - 2018 desktop: header 109px, sticky, nav flex, 2 menu, current link.
  - Click dropdown: `aria-expanded=true`, menu `display:block`.
  - Mobile 390: nav/topbar ẩn, hamburger flex; menu mở, group 6 link.
  - 2025/2022/2023: header mới.
  - Typewriter: dòng cuối đủ “Nâng tầm ghép tạng Việt Nam”, cursor gap 7px.
- Footer 2018/2019/2021: địa chỉ/link cùng `rgba(255,255,255,.78)`, 14px, no underline.

## 6. Tồn tại

- Header archive là HTML/CSS/JS tĩnh (không phải React component) do trang legacy;
  cấu trúc/hành vi được mô phỏng theo Header chuẩn.
- Chưa deploy Vercel commit mới; live có thể chưa có code này.
- Chưa test Safari/iOS, touch thật, screen reader.
- Slogan nằm dưới KV nên trên màn hình thấp người dùng có thể phải cuộn mới thấy;
  animation đã chạy ngay từ khi mount, không chờ scroll.
