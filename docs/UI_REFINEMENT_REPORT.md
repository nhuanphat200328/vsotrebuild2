# UI REFINEMENT REPORT

## 1. Hero & giới thiệu

- Bỏ overlay/khối chữ đè lên KV; KV hiển thị toàn bộ theo tỷ lệ 1921×1081, `w-full h-auto`.
- Intro mới nằm dưới KV, 2 cột: nhận diện VSOT + tagline/description bên trái;
  VSOT 2026 + ngày + Đà Nẵng + CTA chương trình/diễn giả bên phải.
- Logo VSOT thật dùng ở hero và footer; không méo (width/height cố định, h-auto).
- Section "Về Hội Ghép tạng Việt Nam" giữ nội dung giới thiệu + CTA "Tổng quan hội nghị".

## 2. Tin tức

- Trang chủ lấy 5 tin; featured + 4 tin danh sách, nhãn chuyên mục/tệp đính kèm.
- Thêm 2 tin nguồn: thông báo số 2, thư mời tài trợ.
- Trang danh sách/chi tiết giữ cấu trúc editorial, thêm link "Nguồn" (`news.source_url`).
- Không tạo ngày đăng giả.

## 3. Archive & 2023

- 62 trang archive dùng chrome chung mới; bỏ header/footer v1.
- 2023 thay bằng trang đơn giản: tiêu đề, mô tả, nút PDF, iframe PDF, chrome chung.
- Không tạo section giả cho 2023.

## 4. Abstract

- 105 presentation có abstract được map từ `data/abstracts.json`; nút "Abstract" trong
  danh sách programme và trang phiên.
- Route `/vi/hoi-nghi/2026/bao-cao/<id>/abstract` hiển thị iframe + mở tab mới/tải.
- 17 poster có abstract nhưng chưa có presentation trong DB → không gắn nút.
- File HTML dùng local (Storage trả `text/plain`); PDF dùng Storage.

## 5. Effects

- Hover nav/link/button/archive ảnh; reveal section bằng CSS scroll-driven có fallback.
- CountUp giữ nguyên, SSR hiển thị giá trị cuối; reduced-motion tắt animation.
- Không thêm thư viện animation.

## 6. Kiểm thử

- typecheck/lint/build PASS (xem INTERACTION_TEST_REPORT).
- Chưa QA bằng mắt trên trình duyệt thật/thiết bị.
