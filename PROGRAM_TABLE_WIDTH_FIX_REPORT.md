# PROGRAM TABLE WIDTH FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File | Thay đổi |
|---|---|
| `app/[locale]/hoi-nghi/[year]/chuong-trinh/page.tsx` | Chỉ ở `view=table`: thêm class `programme-wide-table` cho Container nội dung |
| `app/globals.css` | Desktop ≥1280: `.programme-wide-table { max-width: min(1600px, calc(100vw - 24px)); }` |
| `PROGRAM_TABLE_WIDTH_FIX_REPORT.md` | Báo cáo |

Không sửa `ProgrammeTable`, dữ liệu cột, thứ tự phòng, List/Grid, mobile/tablet.

## 2. Cách xử lý

- Container chung vẫn `max-w-6xl` (1152px).
- Riêng trang chương trình ở Table trên desktop dùng container rộng hơn:
  tối đa 1600px, luôn chừa 24px viewport (12px mỗi bên).
- Container vẫn `mx-auto` → bảng mở rộng cân đối hai bên.
- Không đổi kích thước cột: thời gian `w-20`, mỗi phòng `w-44`; bảng `table-fixed`.
- Không dùng `overflow-x: hidden`; wrapper vẫn `overflow-x-auto` làm fallback.

## 3. Kiểm thử desktop

| Viewport | Container | Table wrapper | Table width | Rooms | scrollWidth / clientWidth | Page overflow |
|---|---:|---:|---:|---:|---|---:|
| 1920 | 1600 | 1534 | 1534 | 6 | 1534 / 1534 | 0 / không tràn |
| 1440 | 1416 | 1350 | 1350 | 6 | 1350 / 1350 | 0 |
| 1366 | 1342 | 1276 | 1276 | 6 | 1276 / 1276 | 0 |

- Cả 6 cột phòng hiển thị; cột cuối kết thúc trong viewport:
  1366 → right 1314; 1440 → 1388; 1920 → 1720.
- Không có thanh cuộn ngang ở bảng desktop (`scrollWidth == clientWidth`).
- Chữ/kích thước cột/chiều cao hàng giữ nguyên.

## 4. Mobile / tablet / chế độ khác

- CSS chỉ áp dụng `@media (min-width:1280px)`; mobile 390 không đổi:
  table 1136px trong wrapper 348px, vẫn cuộn ngang nội bộ như trước.
- `view=list` không có `.programme-wide-table`; container giữ chuẩn.
- Grid/List không đổi.
- Không phát sinh tràn ngang toàn trang (`pageOverflow=0`).

## 5. Tồn tại

- Với viewport hẹp hơn 1280 (tablet), bảng vẫn cuộn ngang như thiết kế cũ; yêu cầu chỉ PC.
- Live Vercel chưa deploy commit mới.
- Chưa test Safari/Firefox; kiểm bằng Chrome CDP 1920/1440/1366/390.
