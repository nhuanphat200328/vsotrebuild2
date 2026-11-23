# HOMEPAGE LAYOUT

## 1. Thứ tự và lý do

| # | Section | Mục đích | Dữ liệu |
|---|---|---|---|
| 1 | Hero KV + logo | Nhận diện hội nghị ngay, CTA | KV local, DB conference |
| 2 | Stats 5/6/245/255 | Quy mô hội nghị, CountUp | DB thật |
| 3 | Giới thiệu + ngày hội nghị | Bối cảnh Hội/hội nghị, điều hướng nhanh | dictionary, conference translations, dates |
| 4 | Tin tức mới nhất | Thông báo/abstract/tài liệu | 5 tin DB, editorial |
| 5 | Chương trình ngày đầu | Dẫn vào khoa học | 4 phiên DB |
| 6 | Tài liệu báo cáo viên | Template PPTX tải được | conference_documents |
| 7 | Thư mời | PDF + ảnh Gala | conference_documents |
| 8 | Hội nghị các năm | Archive 2025–2018 | legacy_sites |
| 9 | CTA chương trình | Điểm kết | route programme |

## 2. Thiết kế

- Hero: KV thật + overlay navy trái, logo trắng, tiêu đề lớn, CTA gold.
- Stats: dải số, viền mảnh, không card; CountUp chỉ chạy lần đầu.
- Giới thiệu: 2 cột bất đối xứng; danh sách ngày dạng dòng kẻ.
- Tin tức: 1 tin nổi bật lớn + danh sách 2 tin; nhãn chuyên mục, tệp.
- Chương trình: bảng dòng, không card.
- Tài liệu/thư mời: 2 cột, danh sách hàng, icon định dạng, nút tải.
- Archive: dải năm lớn, góc vuông, hover nhẹ.
- Không dùng radius lớn/shadow dày/gradient trang trí ngoài hero overlay.

## 3. Responsive

- <640: 1 cột tài liệu, stats 2 cột, archive 2 cột, hero text 30px.
- 640–1023: stats 2 cột, archive 3 cột.
- ≥1024: stats 4 cột, tài liệu 2 cột.
- ≥1280: nav đầy đủ + 2 dropdown; dock ẩn.
- Mobile dock 5 mục; footer padding đáy tránh dock.
