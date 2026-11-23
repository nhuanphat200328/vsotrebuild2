# HOMEPAGE CONTENT PLAN

## 1. Mục tiêu

Trang chủ là website của hội chuyên ngành: trang trọng, nhiều khoảng trắng, nhịp editorial,
dùng ảnh/KV thật, hạn chế card bo góc và gradient trang trí.

## 2. Thứ tự khu vực

| # | Khu vực | Nội dung | Nguồn |
|---|---|---|---|
| 1 | Header | Logo chữ VSOT, nav Hội nghị / Hội nghị các năm / Tin tức / Liên hệ, VI–EN, mobile dock | Thiết kế mới + DB archive |
| 2 | Hero | KV hội nghị làm nền, tên hội nghị, ngày 13–17/10/2026, Đà Nẵng, CTA chương trình/diễn giả | `KV.png`, DB conference 2026 |
| 3 | Stats | 5 ngày · 6 hội trường · 245 diễn giả · 255 báo cáo, CountUp khi vào viewport | DB thật; khớp số liệu yêu cầu |
| 4 | Giới thiệu | Mô tả VSOT + intro hội nghị + danh sách ngày có số phiên | `dictionary`, `conference_translations`, DB dates |
| 5 | Tin tức mới nhất | 1 tin nổi bật + 2 tin dạng danh sách có đường phân cách, nhãn Hội nghị/Sự kiện/Thông báo, nút tải tệp | DB `news`, `news_attachments` |
| 6 | Chương trình ngày đầu | 4 phiên đầu tiên: giờ, tên, phòng, loại, số báo cáo, link chi tiết | DB sessions |
| 7 | Tài liệu báo cáo viên | 3 template PPTX, mô tả + nút tải, dòng hướng dẫn cuối | `conference_documents.doc_type='template'` |
| 8 | Thư mời | PDF thư mời + ảnh Gala, nút Xem/Tải | `conference_documents.doc_type='invitation'` |
| 9 | Hội nghị các năm | Dải năm 2025, 2023, 2022, 2021, 2019, 2018 + link kho lưu trữ | `legacy_sites` + `public/legacy` |
| 10 | CTA cuối | Chương trình + diễn giả | DB |
| 11 | Footer | Thông tin Hội, liên hệ, archive, bản quyền | Config + DB |

## 3. Quyết định thiết kế

- Hero dùng ảnh KV thật với overlay navy, không dùng minh hoạ AI.
- Stats là dải số trên nền trắng, viền mảnh; CountUp chạy một lần, easing, tôn trọng
  `prefers-reduced-motion`.
- Tin tức dùng layout editorial: đường kẻ trên/dưới, chữ là chính, không ảnh placeholder.
- Tài liệu/thư mời dùng danh sách hàng có icon định dạng, không đóng từng mục trong card.
- Archive dùng dải số năm lớn, góc vuông, hover nhẹ.
- Bo góc chỉ dùng cho ô tìm kiếm/nút nhỏ; không áp radius lớn toàn site.

## 4. Dữ liệu hiển thị

- Không hardcode số liệu: tính từ `getProgrammeData("2026")`.
- Không hardcode danh sách năm: đọc `legacy_sites` published, sort `year desc`.
- Không hardcode tài liệu: đọc `conference_documents` theo `file_path` và `sort`.
- Không tạo ngày đăng giả: tin không có ngày sẽ không hiện ngày.

## 5. Responsive

| Breakpoint | Thay đổi |
|---|---|
| <640px | Hero text 30px, stats 2 cột, tài liệu/thư mời 1 cột, archive 2 cột |
| 640–1023px | Stats 2 cột, news 1 cột, archive 3 cột |
| 1024–1279px | News 2 cột, stats 4 cột, ẩn desktop nav (dùng menu) |
| ≥1280px | Nav đầy đủ + dropdown, hero rộng, news 2 cột, archive 6 cột |

Mobile dock 5 mục luôn hiển thị dưới 1280px; footer có padding đáy tránh dock.
