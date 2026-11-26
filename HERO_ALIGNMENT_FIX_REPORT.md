# HERO ALIGNMENT FIX REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Nguyên nhân lệch

- Container nội dung Hero từng đặt `max-width: 1440px` cố định.
- Ở 1366/1440, `1440px` lớn hơn vùng nội dung hiện dụng, nên container phủ sát hai mép
  và chỉ còn padding trong; mép trái nội dung gần như sát mép KV/không cân với mép phải,
  tạo cảm giác khối slogan/info bị đẩy trái.
- Đường phân cách dọc trước đó cũng đã được đặt trong padding của cột phải để tránh cắt
  chữ `Vietnam`; cần giữ vị trí này.

## 2. Cách xử lý

- `.home-intro-wide` (Container Hero) đổi:
  `max-width: min(1440px, calc(100vw - 96px));`
- Container vẫn dùng `mx-auto`; tạo lề ngoài **48px mỗi bên** ở desktop hẹp và vẫn
  tối đa 1440px ở màn hình lớn.
- Không dùng `translateX`, margin bù, hay căn giữa từng dòng.
- Giữ nguyên grid 2 cột, slogan/description/info/CTA, KV frame và divider pseudo.
- Mobile/tablet dưới 1024 giữ nguyên container cũ.

## 3. Kết quả đo (Chrome CDP)

| Viewport | Container | Container center | KV center | Lề trái/phải trong KV |
|---|---:|---:|---:|---:|
| 1366 | 1270px @ x=41 | 676 | 676 | 21 / 20 px |
| 1440 | 1344px @ x=41 | 713 | 713 | 21 / 20 px |
| 1920 | 1440px @ x=233 | 953 | 953 | 60 / 60 px |

- Container Hero và KV cùng tâm ở cả 3 độ phân giải.
- `/vi` và `/en` cùng kích thước/vị trí container.
- Khoảng cách chữ cuối slogan Anh → divider:
  - 1366: 100px; 1440: 108px; 1920: 121px.
- Không tràn ngang: `scrollWidth - innerWidth = 0` (trừ scrollbar 15px của layout).
- Mobile 768/390: container full width như cũ, không đổi bố cục.

## 4. File đã sửa

| File | Thay đổi |
|---|---|
| `app/globals.css` | `max-width: min(1440px, calc(100vw - 96px))` cho `.home-intro-wide` |
| `HERO_ALIGNMENT_FIX_REPORT.md` | Báo cáo |

## 5. Tồn tại

- Chưa test Safari/Firefox, screen reader; kiểm bằng Chrome CDP.
- Vercel sẽ cập nhật sau khi deploy commit này.
