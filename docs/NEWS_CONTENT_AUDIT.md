# NEWS CONTENT AUDIT

## 1. Tin đã xác minh và đưa vào DB

### Tin 1 — Hội nghị VSOT 2026: Tổng hợp abstract
- Nguồn: `hoinghi2026/index.html`, `tin-tuc.html` → `materials/abs-tong-hop.pdf`.
- File: `public/media/2026/documents/abs-tong-hop.pdf` (6,37 MB, MIME `application/pdf`).
- Nhãn: Hội nghị (`hoi-nghi`).
- Ngày đăng: không có trong nguồn → `published_at = NULL`.
- Ghi chú: mô tả yêu cầu ghi "lần X, TP. Hồ Chí Minh" **mâu thuẫn nguồn**
  (chương trình 2026 là lần XI tại Đà Nẵng). Đã dùng mô tả trung tính:
  "Toàn bộ tóm tắt báo cáo khoa học tại Hội nghị khoa học thường niên VSOT 2026."
  Migration `0021_fix_abstract_excerpt.sql` áp dụng điều chỉnh này.

### Tin 2 — Tuần lễ Hiến và Ghép mô tạng Việt Nam 2026
- Nguồn: `tin-tuc.html` (thông báo), `index.html` link ngoài
  `https://vsot.com.vn/pictures/VSOT2026_CTKH%20khung...pdf` (HTTP 200 khi kiểm).
- File nguồn nội bộ: `pictures/VSOT2026_CTKH khung ...pdf` (142 KB).
- File public: `public/media/2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf`.
- Nhãn: Sự kiện (`su-kien`). Ngày đăng: không có → NULL.

### Tin 3 — Thông báo làm hồ sơ cho Record VN
- Nguồn: `index.html` link `https://vsot.com.vn/THONG BAO LAM HO SO CHO RECORD VN .pdf`
  (HTTP 200); file gốc `public_html/THONG BAO LAM HO SO CHO RECORD VN .pdf` (734 KB).
- File public: `public/media/2026/news/thong-bao-ho-so-record-vn.pdf`.
- Nhãn: Thông báo (`thong-bao`). Ngày đăng: không có → NULL.

## 2. Nội dung liên quan chưa thành tin

| Nguồn | Lý do chưa đưa |
|---|---|
| `thong-bao-2.html` + `materials/thong-bao-2.pdf` | Không có mô tả/ngày độc lập đã xác minh; có thể lặp nội dung thông báo 1 |
| `thu-moi-tai-tro.html` + `materials/thu-moi-tai-tro.pdf` | Tài liệu mời tài trợ; chưa xác nhận có nên public |
| `thong-bao-hop-ban-chap-hanh.html` + PDF/DOCX | Nội dung nội bộ BCH, không phù hợp trang tin công khai |
| `tom-tat-bao-cao.html`, `tai-lieu.html` | Trang tổng hợp; nội dung đã nằm trong tài liệu abstract/chương trình |
| `File tham khao/**/*.docx` | 333 file cá nhân, PII, trùng abstract tổng hợp |

## 3. Lưu trữ dữ liệu

- Schema dùng `news`, `news_translations`, `news_categories`,
  `news_category_translations`, bảng mới `news_attachments`.
- Tệp nằm trong `public/media/2026/...` (nhóm A), metadata trong DB (nhóm B).
- `news_attachments` có RLS: public chỉ đọc tệp của tin đã publish; ghi cần `news.write`.

## 4. Hiển thị

- Trang chủ: 1 tin nổi bật + 2 tin danh sách, nhãn chuyên mục, mô tả, link chi tiết và tệp.
- `/tin-tuc`: danh sách editorial, đường phân cách; không card bo lớn.
- `/tin-tuc/[slug]`: tiêu đề, chuyên mục, mô tả, nội dung, khối "Tệp đính kèm" có nút tải.
- Tin chưa có bản dịch EN hiển thị fallback VI + ghi chú "EN translation pending".

## 5. Việc cần chủ dự án xác nhận

1. Có bổ sung thông báo 2 / thư mời tài trợ / thông báo BCH vào tin công khai không?
2. Có cần ngày đăng chính xác cho 3 tin hiện tại không (nguồn không nêu)?
3. Có cần public từng abstract cá nhân thay vì chỉ PDF tổng hợp không (liên quan PII)?
