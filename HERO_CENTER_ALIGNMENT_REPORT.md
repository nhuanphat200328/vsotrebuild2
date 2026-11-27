# HERO CENTER ALIGNMENT REPORT

Ngày: 2026-11-27. Workspace: `D:\Philao\code project\VSOT\demo ver2`.
Ảnh tham chiếu: `canh.png` (1920 × 575, không sửa ảnh).

## 1. Phân tích ảnh `canh.png`

Đo pixel trực tiếp:

| Mốc | Toạ độ X |
|---|---:|
| Đường tâm dọc màu đỏ | 958–964 (tâm 960) |
| Mép trái khối đỏ | 118 |
| Mép phải khối đỏ | 1597 |
| Tâm khối đỏ | 857,5 |
| Lệch so với đường tâm | **102,5 px, lệch trái** |

Ảnh cho thấy container không phải lỗi duy nhất: **tâm hình học của phần nội dung
nhìn thấy** (từ logo đến mép phải nội dung ngày/VSOT 2026) nằm trái tâm trang.
Đo DOM trước khi sửa tại 1920 cho tâm khối nhìn thấy `860,3` — khớp với tâm khối
đỏ trong ảnh (sai lệch do ảnh được chụp ở thời điểm viewport khác).

## 2. Nguyên nhân thực tế

- `.home-intro-wide` đã được căn giữa container (`mx-auto`), tâm container = tâm trang.
- Nhưng nội dung nhìn thấy bên phải kết thúc sớm hơn mép phải cột thông tin:
  dòng ngày là phần tử xa nhất bên phải, còn khoảng trống bên phải cột lớn.
- Vì vậy tâm `(logo.left + ngày.right) / 2` bị lệch trái dù container cân.
- Đã kiểm tra wrapper cha: section full-width, Container chỉ có `mx-auto`,
  `max-w-6xl`, padding; không có offset/overflow ẩn.

## 3. Cách sửa

Chỉ desktop PC (`min-width: 1280px`), dịch **toàn bộ container** sang phải bằng
`margin-left` tính từ phần dư đã đo. Không dùng `translateX`, không đổi:
grid `1.15fr / 0.85fr`, `gap`, divider, logo, font, màu, Typewriter, CountUp, KV,
thống kê, Header, Footer.

- `--hero-half-width: min(720px, calc(50vw - 48px))`
- `--hero-visual-shift`: hiệu chỉnh theo viewport cho `/vi` và `/en`
  (tiếng Anh có chuỗi ngày rộng hơn nên dịch ít hơn khoảng 8,4 px).
- `section:has(> .home-intro-wide) { overflow-x: clip; }` để phần đệm container
  vượt viewport không tạo scrollbar ngang; nội dung vẫn nằm trong trang.

## 4. Số đo trước / sau

### `/vi`

| Viewport | Trước: mép trái–phải | Tâm trước | Lệch | Sau: mép trái–phải | Tâm sau | Lệch |
|---:|---:|---:|---:|---:|---:|---:|
| 1366 | 95 – 1156,6 | 625,8 | −57,2 | 152,2 – 1213,8 | 683 | **0** |
| 1440 | 95 – 1199,1 | 647,1 | −72,9 | 167,9 – 1272,0 | 720 | **0** |
| 1920 | 272 – 1448,6 | 860,3 | −99,7 | 371,7 – 1548,3 | 960 | **0** |

### `/en`

| Viewport | Trước: mép trái–phải | Tâm trước | Lệch | Sau: mép trái–phải | Tâm sau | Lệch |
|---:|---:|---:|---:|---:|---:|---:|
| 1366 | 95 – 1173,4 | 634,2 | −48,8 | 143,8 – 1222,2 | 683 | **0** |
| 1440 | 95 – 1216,0 | 655,5 | −64,5 | 159,5 – 1280,5 | 720 | **0** |
| 1920 | 272 – 1465,4 | 868,7 | −91,3 | 363,3 – 1556,7 | 960 | **0** |

- Đo bằng Chrome CDP, deviceScaleFactor=1, `innerWidth` đúng 1366/1440/1920.
- Sau sửa: tâm khối nhìn thấy = tâm trang tại cả 6 trường hợp.
- `scrollWidth == clientWidth`, không tràn ngang; `overflowX: false`.

## 5. Responsive / phạm vi

- `1280px+`: áp dụng dịch khối; đúng cả `/vi` và `/en`.
- `1024px`, `1200px`: giữ nguyên hoàn toàn (tablet).
- Mobile: không đổi.
- Không sửa TSX/DOM; chỉ CSS + báo cáo này.
- KV, stats, Header, Footer, trang con: không đổi.

## 6. File đã sửa

- `app/globals.css`
- `HERO_CENTER_ALIGNMENT_REPORT.md`

## 7. Kiểm tra

- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS
