# LEGACY CONFERENCES AUDIT

Nguồn: `2027 demo/public/legacy` (chỉ đọc).

| Năm | File | Dung lượng | Nội dung chính | Trạng thái |
|---|---:|---:|---|---|
| 2025 | 317 | 29,4 MB | `index.html`, `CTKH.pdf`, 300+ ảnh trang chương trình | Đã chuyển, dropdown |
| 2024 | 0 | — | Không có thư mục | Không hiển thị |
| 2023 | 1 | <0,1 MB | `index.html`; PDF chương trình ở `public/archive/2023` (đã copy) | Đã chuyển |
| 2022 | 14 | 9,5 MB | `full-programme.htm`, `full-summary.htm`, files | Đã chuyển |
| 2021 | 2 | <0,1 MB | `index.html`, `css.css` | Đã chuyển (mỏng) |
| 2020 | 0 | — | Không có thư mục | Không hiển thị |
| 2019 | 28 | 0,4 MB | `index.html` + 26 trang text | Đã chuyển |
| 2018 | 28 | 0,3 MB | `index.html` + 26 trang text | Đã chuyển |

## 1. Cấu trúc từng năm

- 2018/2019: trang HTML tĩnh cùng cấp, CSS chung; không ảnh. Liên kết nội bộ giữ nguyên.
- 2021: chỉ trang chủ + CSS.
- 2022: trang chủ mới + 2 file `.htm` lớn (chương trình/tóm tắt) + thư mục file đính kèm.
- 2023: trang chủ + PDF chương trình.
- 2025: trang ảnh chương trình dạng page, PDF CTKH, gallery.

## 2. Xử lý chuyển

- Copy nguyên cây năm sang `public/legacy/<year>/`, giữ nội dung gốc.
- Header/footer do v1 chèn sẵn trỏ `/legacy/2026/*` (không copy) → thay 2.538 link
  trong 60 file sang route mới; logo trỏ `/media/2026/logo.gif`.
- Copy `legacy/shared/` CSS/JS để archive hiển thị đúng.
- Không sửa nội dung chuyên môn, không đổi năm, không trộn dữ liệu.

## 3. Metadata

6 dòng `legacy_sites` published: 2025, 2023, 2022, 2021, 2019, 2018.
`entry_path = /legacy/<year>/index.html`; sort year desc; dropdown DB-driven.

## 4. Thiếu dữ liệu

- 2020, 2024: không có trong v1 → không tạo trang/link giả.
- 2021/2023 rất mỏng; hiển thị đúng những gì có.
- Không kiểm nội dung từng trang text 2018/2019; chỉ kiểm trang chủ và cấu trúc.
