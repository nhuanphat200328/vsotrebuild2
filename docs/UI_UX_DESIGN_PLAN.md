# UI/UX DESIGN PLAN

## 1. Định hướng

Professional · Medical/Scientific · Academic Conference · Modern Institutional · Editorial.
Bản sắc VSOT: navy `#282D7D`, gold `#F5B53D`, giấy trắng, đường kẻ mảnh, ảnh hội nghị thật.

## 2. Tham khảo Novena

| Thành phần Novena | Giữ | Bỏ |
|---|---|---|
| Hero ảnh lớn, chữ đè | Nhịp hero, ảnh nền | Overlay tối + slider tự chạy |
| Section title + mô tả | Cấu trúc heading | Icon trang trí, gạch chân màu mè |
| Lưới dịch vụ/bác sĩ | Khoảng trắng, nhịp 3 cột | Card bo 16px + shadow |
| Footer nhiều cột | 4 nhóm nội dung | Nền gradient |
| Bootstrap 4/jQuery/IcoFont | — | Không dùng |

Ghi nhận: nội dung/asset Novena không dùng; chỉ học bố cục.

## 3. Hệ thống thiết kế

- Typography: Be Vietnam Pro 400–800; H1 30–48px, H2 24–30px, body 14–16px, meta 11–12px.
- Spacing: 4/8/12/16/24/32/56; container 1280px.
- Radius: 0 cho khối editorial, 4px cho nút/ô nhập, 999px chỉ cho pill ngày.
- Shadow: gần như không dùng; 1 lớp rất nhẹ cho dropdown.
- Màu role: Chair `#c93535`, Invited `#0b4f84`, Presenter `#318d49`, discussant gold.
- Focus ring 2px brand; skip link; reduced motion.

## 4. Trang chủ

Chi tiết tại `HOMEPAGE_CONTENT_PLAN.md`. Điểm khác biệt so với bản trước:

- Hero dùng KV thật thay gradient thuần.
- Stats dải số + CountUp, không card.
- Tin tức editorial, không grid card đều nhau.
- Tài liệu/thư mời dạng danh sách hàng, icon định dạng file, nút tải rõ.
- Archive dải năm lớn, góc vuông.

## 5. Header/Footer

- Desktop: nav 5 mục, 2 dropdown (hội nghị hiện tại, hội nghị các năm), VI/EN, nút Liên hệ.
- Mobile (<1280px): menu hamburger + accordion dropdown + dock 5 mục.
- Footer: logo VSOT thật (GIF nguồn), 4 cột, archive, copyright.

## 6. Responsive

Kiểm tra theo code/CSS ở 1920, 1366, 1024, 768, 390, 360. Quy tắc:
- Không thu nhỏ desktop; hero chuyển text 30px, CTA wrap.
- Stats 2 cột mobile, 4 cột ≥1024.
- Tài liệu/thư mời 1 cột mobile.
- Archive 2/3/6 cột.
- Không overflow ngang; bảng programme vẫn cuộn trong khung.

## 7. Accessibility

- Link "Bỏ qua điều hướng"; landmark header/main/footer.
- Dropdown dùng button + `aria-expanded`; menu mobile đóng được.
- CountUp có `aria-label` giá trị cuối; tôn trọng reduced motion.
- Link tải tệp có nhãn định dạng; PDF mở tab mới có `rel=noreferrer`.

## 8. Tránh

Card bo góc đồng loạt, nhiều gradient, glow, icon lấp chỗ, section lặp cấu trúc,
dashboard SaaS, slider tự động, animation quá mức.
