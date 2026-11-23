# ASSET MIGRATION REPORT

Ngày: 2026-11-23. Nguồn chỉ đọc; đích trong `demo ver2/public`.

## 1. Tài nguyên 2026

| Đích | Nguồn | Bytes |
|---|---|---:|
| `media/2026/kv.png` | `hoinghi2026/materials/KV.png` | 1.622.520 |
| `media/2026/logo.gif` | `hoinghi2026/asset/logo1507104171.gif` | 7.995 |
| `media/2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx` | `materials/template/...` | 15.203.567 |
| `media/2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx` | `materials/template/...` | 9.421.234 |
| `media/2026/templates/template-poster-9x16.pptx` | `materials/template/...` | 1.455.606 |
| `media/2026/invitations/thu-moi-dien-tu-vsot-2026.pdf` | `materials/thu-moi/...` | 11.876.924 |
| `media/2026/invitations/thu-moi-galadinner.jpg` | `materials/thu-moi/...` | 206.499 |
| `media/2026/documents/abs-tong-hop.pdf` | `materials/abs-tong-hop.pdf` | 6.524.051 |
| `media/2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf` | `public_html/pictures/VSOT2026_CTKH khung ...` | 145.527 |
| `media/2026/news/thong-bao-ho-so-record-vn.pdf` | `public_html/THONG BAO LAM HO SO CHO RECORD VN .pdf` | 751.712 |

Tổng `media`: ~45,0 MB, 10 file. Tên đích đã chuyển ASCII, không khoảng trắng/dấu.

## 2. Archive

| Đích | Nguồn | File | Dung lượng |
|---|---|---:|---:|
| `legacy/2025` | `2027 demo/public/legacy/2025` | 317 | 29,4 MB |
| `legacy/2023` | `.../2023` | 1 | <0,1 MB |
| `legacy/2022` | `.../2022` | 14 | 9,5 MB |
| `legacy/2021` | `.../2021` | 2 | <0,1 MB |
| `legacy/2019` | `.../2019` | 28 | 0,4 MB |
| `legacy/2018` | `.../2018` | 28 | 0,3 MB |

Tổng archive: 39,6 MB, 390 file. Nội dung gốc giữ nguyên; chỉ thay link header/footer
`/legacy/2026/*` → route mới (2538 thay thế trong 60 file) và logo → `/media/2026/logo.gif`
để tránh 404 khi không copy 151,7 MB site 2026 legacy. Copy thêm `legacy/shared/` (CSS/JS
header-footer) để bản archive hiển thị đúng.

## 3. Không copy

- 333 DOCX abstract cá nhân (~60 MB) và 132 HTML abstract.
- 7 XLSX nội bộ, CSV báo cáo, script tools.
- PDF agenda 38 MB; 2026 legacy 151,7 MB.
- Admin/backup/`.vscode`.
- Asset Novena (Bootstrap/IcoFont/ảnh) — template chỉ tham khảo, không phân phối lại.

## 4. Kiểm chứng

- Tất cả file public kiểm HTTP 200 với MIME đúng (xem `TESTING_REPORT.md`).
- Logo/KV mở được; template PPTX tải được; PDF hiển thị inline; JPG hiển thị.
- Không có ký tự lạ trong URL; file Unicode gốc đã đổi sang ASCII.
- Không có secret/PII trong thư mục public mới.

## 5. Dung lượng repo

- Tổng asset mới: ~84,6 MB.
- Chưa vượt giới hạn file đơn của GitHub (file lớn nhất 15,2 MB PPTX).
- Nếu cần giảm, chuyển media lớn sang Supabase Storage và chỉ giữ metadata.
