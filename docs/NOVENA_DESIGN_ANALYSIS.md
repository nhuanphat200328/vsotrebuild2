# NOVENA DESIGN ANALYSIS

Nguồn: `template/novena` (chỉ đọc). Đã khảo sát 13 trang, Bootstrap 4.3.1 + jQuery,
SCSS, ảnh y tế. Không sửa/copy asset gốc.

## 1. Thành phần đáng tham khảo

| Thành phần | Quan sát | Áp dụng VSOT |
|---|---|---|
| Hero ảnh lớn | Ảnh nền + nội dung đè, CTA rõ | Hero KV VSOT, overlay navy, CTA chương trình |
| Section title | Tiêu đề + mô tả ngắn, khoảng thở rộng | Heading có eyebrow + rule mảnh |
| Nhịp section | Xen kẽ nền trắng/xám nhạt | Tin tức nền `surface`, tài liệu nền trắng |
| Danh sách dịch vụ/bác sĩ | Cột rộng, ảnh tỷ lệ | Tin tức dạng editorial, không card đều |
| Footer 4 cột | Nhóm nội dung rõ | Footer VSOT 4 cột + archive |
| CTA band | Dải màu đậm cuối trang | CTA khám phá chương trình |

## 2. Không áp dụng

- Bootstrap grid/component, jQuery, Slick, CounterUp, Shuffle, IcoFont.
- Card bo góc lớn + shadow; slider tự chạy; icon lấp chỗ.
- Font Exo/Roboto (dùng Be Vietnam Pro hỗ trợ tiếng Việt).
- Asset/ảnh IcoFont/template gốc (giấy phép + không liên quan VSOT).

## 3. Bản sắc VSOT

- Navy `#282D7D` + gold `#F5B53D`, trắng, đường kẻ `#dfe5eb`.
- Typography 400–800, tiêu đề lớn, body 14–16px.
- Ảnh KV/logo thật; không minh hoạ AI.
- Góc vuông cho khối dữ liệu; radius 4px chỉ cho nút/ô nhập.
- Animation duy nhất: CountUp thống kê; tôn trọng reduced motion.
