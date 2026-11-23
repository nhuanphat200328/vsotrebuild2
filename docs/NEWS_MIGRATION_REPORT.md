# NEWS MIGRATION REPORT

## 1. Nguồn đã đọc

- `hoinghi2026/tin-tuc.html`
- `hoinghi2026/thong-bao-1.html`
- `hoinghi2026/thong-bao-2.html`
- `hoinghi2026/thong-bao-hop-ban-chap-hanh.html`

Không sửa file nguồn.

## 2. Tin đã chuyển (5)

| Slug | Tiêu đề | Danh mục | Tệp | Nguồn |
|---|---|---|---|---|
| `tong-hop-abstract-vsot-2026` | Hội nghị VSOT 2026: Tổng hợp abstract | Hội nghị | abs-tong-hop.pdf | vsotrebuild legacy |
| `tuan-le-hien-ghep-mo-tang-2026` | Tuần lễ Hiến và Ghép mô tạng Việt Nam 2026 | Sự kiện | PDF chương trình khung | vsot.com.vn |
| `thong-bao-ho-so-record-vn` | Thông báo làm hồ sơ cho Record VN | Thông báo | PDF Record VN | vsot.com.vn |
| `thong-bao-so-2-vsot-2026` | Thông báo số 2: Cập nhật Hội nghị VSOT 2026 | Thông báo | thong-bao-2.pdf | legacy 2026 |
| `thu-moi-tai-tro-vsot-2026` | Thư mời tài trợ VSOT 2026 | Thông báo | thu-moi-tai-tro.pdf | legacy 2026 |

## 3. Không chuyển

- `thong-bao-hop-ban-chap-hanh.html` + PDF/DOCX: nội dung nội bộ Ban Chấp hành,
  không phù hợp công khai.
- Bản DOCX abstract cá nhân: PII, chỉ dùng PDF tổng hợp.

## 4. Dữ liệu

- `news.source_url` lưu link nguồn; `news_attachments` lưu tệp + Storage path.
- `published_at = NULL` cho cả 5 tin vì nguồn không nêu ngày.
- Tin 1 dùng mô tả trung tính (nguồn ghi lần XI/Đà Nẵng, không phải lần X/TP.HCM).

## 5. Hiển thị

- Trang chủ: featured + 4 tin danh sách (5 tin).
- `/tin-tuc`: 5 tin, editorial, link nguồn/tệp.
- `/tin-tuc/[slug]`: nội dung, nguồn, tệp đính kèm.
