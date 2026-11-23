# TESTING REPORT (Phase 2)

- Ngày: 2026-11-23
- Môi trường: Windows, Node 24.17, Next 16.4.6, Supabase Postgres 17
- Server test: `next start` port 3103/3104/3105

## 1. Build & static checks

| Lệnh | Kết quả |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (0 error) sau khi sửa CountUp setState-in-effect |
| `npm run build` | PASS (chạy lại sau khi thêm khối tài liệu hội nghị và sửa link archive) |
| `python scripts/apply_migrations.py` dry-run | PASS |
| `--apply` | PASS 0018–0021 |

## 2. HTTP — trang và dữ liệu

| URL | Kết quả |
|---|---|
| `/vi` | 200, 100 KB; có KV, logo, 3 tin, tài liệu, thư mời, archive |
| `/vi/tin-tuc` | 200; hiển thị Tổng hợp abstract, Tuần lễ Hiến, Record VN |
| `/vi/tin-tuc/tong-hop-abstract-vsot-2026` | 200; có link tệp PDF |
| `/vi/hoi-nghi/cac-nam-truoc` | 200; có 2025…2018 |
| `/vi/hoi-nghi/2026` | 200; khối tài liệu hội nghị |
| `/sitemap.xml` | 200; 20 URL, gồm 6 URL tin tức và archive |
| `/robots.txt` | 200; chặn admin/api/login |

## 3. Tệp và archive

| File | Status | MIME/size |
|---|---|---|
| `/media/2026/kv.png` | 200 | image/png 1.622.520 |
| `/media/2026/logo.gif` | 200 | image/gif 7.995 |
| `/media/2026/templates/template-poster-9x16.pptx` | 200 | PPTX 1.455.606 |
| `/media/2026/invitations/thu-moi-galadinner.jpg` | 200 | image/jpeg 206.499 |
| `/media/2026/documents/abs-tong-hop.pdf` | 200 | application/pdf 6.524.051 |
| `/legacy/2025/index.html` | 200 | HTML 48.540 |
| `/legacy/2025/CTKH.pdf` | 200 | PDF 1.055.267 |
| `/legacy/2025/pictures/25-1.jpg` | 200 | JPEG 133.493 |
| `/legacy/2022/full-programme.htm` | 200 | HTML 275.417 |
| `/legacy/2022/full-summary.htm` | 200 | HTML 122.233 |
| `/legacy/2021/index.html` | 200 | HTML 24.724 |
| `/legacy/2019/index.html` | 200 | HTML 25.188 |
| `/legacy/2018/index.html` | 200 | HTML 25.623 |
| `/legacy/2023/index.html` | 200 | HTML 9.623 |

## 4. RLS / dữ liệu bằng anon key

| Query | Kết quả |
|---|---|
| `news?status=eq.published` | 3 dòng |
| `news_attachments` | 3 dòng |
| `conference_documents?is_public=true` | 6 dòng |
| `legacy_sites?status=published` | 6 dòng |
| `contact_requests`, `profiles`, `audit_logs` | `[]` |

## 5. CountUp

- Component dùng `IntersectionObserver` threshold 0.35, thời lượng 1.300 ms, ease-out cubic,
  dừng đúng giá trị, cờ `started` chống chạy lặp.
- `prefers-reduced-motion` → hiển thị giá trị cuối, không animate.
- SSR hiển thị `0`; `aria-label` chứa giá trị cuối cho trình đọc màn hình.
- **Chưa quan sát animation bằng trình duyệt thật** (CLI không có browser); logic và build đã kiểm.

## 6. Kiểm tra cuối (server port 3106)

- `/vi`: 100.295 bytes; có tài liệu báo cáo viên, thư mời, 3 tin, archive, số 245/255.
- `/vi/hoi-nghi/2026`: có khối "Tài liệu hội nghị" và link `abs-tong-hop.pdf`.
- `/vi/hoi-nghi/cac-nam-truoc`: có 2025…2018.
- `/legacy/2025/index.html`: không còn link `/legacy/2026/`; có link `/vi/hoi-nghi/2026`,
  logo `/media/2026/logo.gif`.
- `/legacy/shared/header-footer-2026.css` 200 (13.723 bytes).
- `/media/2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx` 200 (15,2 MB).
- `/media/2026/news/thong-bao-ho-so-record-vn.pdf` 200 (751.712 bytes).
- `/sitemap.xml` 20 URL gồm 6 URL tin tức và archive; `/robots.txt` 200.

## 7. Chưa kiểm / cần chạy lại

- Chưa kiểm giao diện 1920/1366/1024/768/390/360 bằng mắt hoặc DevTools.
- Chưa kiểm console/network errors trên trình duyệt.
- Chưa submit form liên hệ thật (tránh dữ liệu rác).
- Chưa test admin CRUD.
- Chưa deploy Vercel.

## 7. Known issues

- Sitemap/robots dùng `http://localhost:3000` khi build local vì `NEXT_PUBLIC_SITE_URL`;
  Preview/Production phải đặt đúng domain.
- Trang archive là site tĩnh cũ, không responsive theo theme mới.
- Admin chưa quản lý attachment/document/archive.

## 8. Kiểm tra link (bổ sung)

- Crawl 220 link nội bộ từ 9 trang chính: 1 lỗi duy nhất
  `/archive/2023/chuong-trinh-vsot-2023.pdf` (404).
- Đã copy PDF từ `2027 demo/public/archive/2023/` sang `public/archive/2023/`;
  kiểm lại HEAD → 200 `application/pdf`.
- Crawl sâu toàn bộ archive vượt thời gian CLI (tải ảnh lớn); các trang đại diện
  2025/2023/2022/2021/2019/2018 đã kiểm 200.
