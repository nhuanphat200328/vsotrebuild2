# CONTENT AUDIT 2026

Chi tiết đầy đủ ở `SOURCE_CONTENT_AUDIT.md`. Tài liệu này tóm tắt kết quả audit
`PrototypeClone/public_html/hoinghi2026` (577 file, 206,3 MB).

## 1. Nhóm nội dung

| Nhóm | Số lượng / ghi chú | Xử lý |
|---|---|---|
| Trang HTML | 152 | Đọc; không copy giao diện |
| Abstract cá nhân | 312 DOCX + 132 HTML | Không public (PII, trùng PDF tổng hợp) |
| PDF | 37 | Chọn tài liệu công khai cần thiết |
| PPTX | 6 (3 bản trùng tên) | Copy 3 template chính thức |
| Hình ảnh/branding | KV 1921×1081, logo 144×125, icon GIF | Copy KV + logo |
| Dữ liệu chương trình | `programme.json/js`, `abstracts.json` | Đã có trong DB (65 phiên/255 báo cáo) |
| Tin tức/thông báo | `tin-tuc.html`, `thong-bao-1/2.html`, `thu-moi-tai-tro.html` | 5 tin đưa vào DB |
| Tài liệu nội bộ | XLSX, CSV audit, script | Không public |

## 2. Nội dung đã chuyển

- KV, logo.
- 3 template PPTX (báo cáo 16:9, điều phối hiến tạng 16:9, poster 9:16).
- Thư mời PDF + ảnh Gala.
- Abstract tổng hợp PDF.
- Chương trình khung Tuần lễ; thông báo Record VN; thông báo số 2; thư mời tài trợ.
- 5 tin: abstract, Tuần lễ hiến ghép, Record VN, thông báo số 2, thư mời tài trợ.

## 3. Nội dung không chuyển

- 333 DOCX/abstract cá nhân (PII, trùng lặp) — chỉ dùng PDF tổng hợp.
- PDF agenda 38 MB (chương trình đã có DB).
- File XLSX/CSV/report/tools nội bộ.
- Trang admin/backup của site cũ.
- Site `legacy/2026` 151,7 MB (hội nghị hiện tại có route native).

## 4. File thiếu / cần xác nhận

- Không có ngày đăng cho 5 tin.
- Mô tả Tin 1 trong yêu cầu ghi "lần X, TP.HCM" khác nguồn (lần XI, Đà Nẵng) →
  đã dùng mô tả trung tính.
- Chưa xác định có nên public thư mời tài trợ/thông báo BCH hay không; thư mời tài trợ
  đã đưa vào tin vì nguồn công khai, BCH thì không.
- Một số link ngoài `vsot.com.vn` đã kiểm 200 tại thời điểm audit; bản sao tài liệu
  chính đã lưu nội bộ.
