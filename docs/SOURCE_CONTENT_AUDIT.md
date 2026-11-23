# SOURCE CONTENT AUDIT

Ngày: 2026-11-23. Phạm vi: `PrototypeClone/public_html/hoinghi2026`, `2027 demo/public/legacy`,
`template/novena`, `PrototypeClone/docs/TTS2026_PROGRAMME_REFERENCE.txt`.

## 1. Workspace đích

`D:\Philao\code project\VSOT\demo ver2` — Next.js 16 + Tailwind 4 + Supabase. DB hiện có
35 bảng, 94 RLS policy, 3 bucket; dữ liệu 2026 đã import (5 ngày, 6 phòng, 65 phiên,
255 báo cáo, 245 người).

## 2. Tổng quan `hoinghi2026`

- 577 file, 206,3 MB.
- Theo loại: `.docx` 312, `.html` 152, `.pdf` 37, `.gif` 14, `.js` 10, `.php` 9,
  `.xlsx` 7, `.css` 6, `.pptx` 6, `.json` 5, `.png` 4, `.jpg` 3, còn lại lẻ.
- Theo thư mục: `materials` 138,61 MB; `File tham khao` 60,12 MB (333 file);
  `abstracts` 132 file/4,72 MB; `asset` 1,63 MB; `data` 0,28 MB.

Đây là site tĩnh/legacy, không phải nguồn để copy giao diện. Nội dung khai thác:

| Nhóm | File gốc | Loại | Xử lý |
|---|---|---|---|
| Trang chủ hội nghị | `hoinghi2026/index.html` | HTML | Đọc thông tin, không copy markup |
| Key Visual | `materials/KV.png` (1921×1081), `asset/kv-vsot-2026.png` | PNG | Copy → `public/media/2026/kv.png` |
| Logo | `asset/logo1507104171.gif` (144×125) | GIF | Copy → `public/media/2026/logo.gif` |
| Template báo cáo 16:9 | `materials/template/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx` | PPTX 14,8 MB | Copy → `public/media/2026/templates/` |
| Template điều phối hiến tạng | `materials/template/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx` | PPTX 9,2 MB | Copy |
| Template poster 9:16 | `materials/template/template-poster-9x16.pptx` | PPTX 1,4 MB | Copy |
| Thư mời hội nghị | `materials/thu-moi/thu-moi-dien-tu-vsot-2026.pdf` | PDF 11,6 MB | Copy → `public/media/2026/invitations/` |
| Thư mời Gala | `materials/thu-moi/thu-moi-galadinner.jpg` | JPG 0,2 MB | Copy |
| Abstract tổng hợp | `materials/abs-tong-hop.pdf` | PDF 6,4 MB | Copy → `public/media/2026/documents/` |
| Chương trình khung Tuần lễ | `pictures/VSOT2026_CTKH khung ...pdf` + link vsot.com.vn | PDF 142 KB | Copy → `public/media/2026/news/` |
| Thông báo Record VN | `public_html/THONG BAO LAM HO SO CHO RECORD VN .pdf` | PDF 734 KB | Copy → `public/media/2026/news/` |
| Chương trình khoa học | `data/programme.json`, `data/programme.js` | JSON/JS 108–142 KB | Đã chuẩn hoá trong DB (v1 seed) |
| Abstract cá nhân | `File tham khao/**` 333 `.docx`, `abstracts/**` 132 HTML | DOCX/HTML | **Không copy** — chứa tên/PII, trùng lặp; dùng PDF tổng hợp công khai |
| Agenda/PDF lớn | `materials/File chính thức.../agenda/4.1...pdf` 38 MB | PDF | Không copy; chương trình đã có trong DB |
| XLSX nội bộ | `File tham khao/VSOT2026_CTKH_*.xlsx` | XLSX | Không public |
| Báo cáo audit nội bộ | `reports/*.csv`, `tools/*.py` | CSV/PY | Không public |

## 3. Tin tức / thông báo đã xác minh

| Nội dung | Nguồn xác nhận | Tài liệu | Trạng thái |
|---|---|---|---|
| Tổng hợp abstract VSOT 2026 | `index.html`, `tin-tuc.html` → `materials/abs-tong-hop.pdf` | PDF 6,4 MB | Đã seed DB + file public |
| Tuần lễ Hiến và Ghép mô tạng 2026 (13–17/10, Đà Nẵng) | `tin-tuc.html`, `thong-bao-1.html`; link ngoài `vsot.com.vn/pictures/...khung...pdf` (HTTP 200) | PDF 142 KB bản nguồn | Đã seed DB + file public |
| Thông báo hồ sơ Record VN | `index.html` link `vsot.com.vn/THONG BAO...pdf`; file gốc ở `public_html/` | PDF 734 KB | Đã seed DB + file public |

Nội dung khác tìm thấy nhưng **chưa đưa vào tin tức** (thiếu mô tả/ngày xác minh):
`thong-bao-2.html`, `thu-moi-tai-tro.html`, `thong-bao-hop-ban-chap-hanh.html`,
`tai-lieu.html`, `tom-tat-bao-cao.html`, các file PDF thông báo 1/2.
Có thể bổ sung sau khi chủ dự án xác nhận tiêu đề/ngày.

## 4. Archive hội nghị

Nguồn: `2027 demo/public/legacy` (chỉ đọc).

| Năm | File | Dung lượng | Nội dung | Đã copy |
|---|---:|---:|---|---|
| 2025 | 317 | 29,4 MB | `index.html`, `CTKH.pdf`, gallery `pictures/` | Có |
| 2023 | 1 | <0,1 MB | `index.html` | Có |
| 2022 | 14 | 9,5 MB | `index.html`, `full-programme.htm`, `full-summary.htm`, files | Có |
| 2021 | 2 | <0,1 MB | `index.html`, `css.css` | Có |
| 2019 | 28 | 0,4 MB | `index.html` + 26 trang nội dung | Có |
| 2018 | 28 | 0,3 MB | `index.html` + 26 trang nội dung | Có |

Không có thư mục 2020 và 2024 trong nguồn → không tạo link giả. 2026 là hội nghị hiện tại,
không đưa vào dropdown archive.

## 5. Template Novena

Đã khảo sát đầy đủ trong `TEMPLATE_CATALOG.md`. Chỉ tham khảo nhịp điệu editorial, section
heading, hero ảnh lớn, khoảng trắng; **không dùng Bootstrap/jQuery/IcoFont** và không copy asset.

## 6. Nội dung chưa xác minh

- Ngày đăng chính xác của 3 tin: nguồn không nêu → để `published_at = null`, không bịa.
- Mô tả Tin 1 do yêu cầu ghi "lần X, TP. Hồ Chí Minh" mâu thuẫn nguồn (VSOT 2026 lần XI,
  Đà Nẵng) → dùng mô tả trung tính, ghi rõ trong `NEWS_CONTENT_AUDIT.md`.
- Link ngoài `vsot.com.vn` đã kiểm HTTP 200 tại thời điểm audit; bản lưu public đã có trong repo.
- Toàn bộ file `.docx` cá nhân chưa được kiểm nội dung từng bài; không public vì PII.
