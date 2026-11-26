# HEADER DROPDOWN ANIMATION REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File | Thay đổi |
|---|---|
| `components/layout/site-header.tsx` | Dropdown Hội nghị/Hội nghị các năm dùng `.header-dropdown`; thêm mutual close, focus/blur; link con dùng `.hover-slide` |
| `app/globals.css` | Transition dropdown slide-down + fade 300ms; reduced-motion |
| `HEADER_DROPDOWN_ANIMATION_REPORT.md` | Báo cáo |

Không đổi cấu trúc menu, URL, nội dung, Header mobile.

## 2. Dropdown PC

- `.header-dropdown`:
  - đóng: `visibility:hidden; opacity:0; transform:translateY(-6px); pointer-events:none`.
  - mở: `visibility:visible; opacity:1; transform:translateY(0); pointer-events:auto`.
  - transition `opacity/transform/visibility` **0.3s**, easing `cubic-bezier(0.22,1,0.36,1)`.
- Áp dụng cho cả `desktop-conference-menu` và `desktop-archive-menu`.
- Vùng hover liên tục: dropdown là con của wrapper chứa trigger, nên rê từ trigger xuống
  dropdown không kích hoạt mouse-leave.
- Mutual exclusive: mở Hội nghị đóng Hội nghị các năm và ngược lại.
- Keyboard: `onFocus` mở; `onBlur` chỉ đóng khi focus rời khỏi wrapper/dropdown.
- `prefers-reduced-motion`: bỏ transition.

## 3. Hover mục con

- Tái sử dụng đúng `.hover-slide` của Tin tức trang chủ:
  - overlay `rgba(100,116,139,0.09)`;
  - `::before` `scaleX(0→1)`, origin left, 0.35s;
  - nội dung direct child có `z-index:1`.
- Áp dụng cho link con Hội nghị, từng năm archive, và “Tất cả hội nghị”.
- Đã bỏ `hover:bg-brand-50` trên các link dropdown để không chồng hai kiểu hover.

## 4. Kiểm thử Chrome CDP (1366 desktop)

| Trạng thái | Kết quả |
|---|---|
| Đóng | visibility hidden, opacity 0, translateY(-6px), pointer-events none |
| Hover Hội nghị | visibility visible, opacity 1, translateY(0), pointer-events auto |
| Hover link con | overlay ::before `matrix(1,0,0,1,0,0)`, chữ vẫn đọc được |
| Rời ngoài | dropdown về hidden/opacity 0/translateY(-6px) |
| Hover Hội nghị các năm | archive mở; conference đóng |
| Focus bàn phím | dropdown mở, focus nằm đúng trigger |

## 5. Mobile

- Không sửa menu mobile; vẫn dùng cơ chế hamburger/accordion hiện có.
- Hiệu ứng mới chỉ áp dụng cho dropdown desktop trong `nav[aria-label="Main"]`.

## 6. Tồn tại

- Chưa test Safari/Firefox, screen reader; kiểm bằng Chrome CDP.
- Live Vercel chưa deploy thay đổi này.
