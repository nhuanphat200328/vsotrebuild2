# DESIGN SYSTEM REVIEW

## 1. Token hiện có

| Nhóm | Giá trị |
|---|---|
| Primary navy | `#282D7D` (700), scale 50–900 |
| Accent gold | `#F5B53D` (500), `#F8D488`, `#D99A24` |
| Ink | `#1A2233` / `#2B3A4B` / `#66758A` |
| Line / surface | `#DFE5EB` / `#F6F9FC` |
| Role | Chair `#C93535`, Invited `#0B4F84`, Presenter `#318D49` |
| Font | Be Vietnam Pro 400–800 |
| Container | 1280px, padding 20px |
| Radius | 0 cho khối editorial; 4px nút/ô; 999px chỉ pill ngày |
| Motion | 180–350ms ease; reduced-motion tắt |

## 2. Quy tắc

- Hero/KV không overlay chữ; intro nằm dưới, 2 cột.
- Section dùng đường kẻ/typography, không card bo lớn.
- Tin tức: featured + danh sách, không grid card đồng nhất.
- Tài liệu: danh sách hàng + icon định dạng + nút tải.
- Archive: chrome tĩnh dùng lại token; không dựng theme riêng.
- Hover: đổi màu/underline/border, zoom ảnh archive 1.01; không glow/shadow.
- Reveal section nhẹ bằng CSS scroll-driven, có `@supports` + reduced-motion.

## 3. Chưa chuẩn hóa

- Trang admin dùng radius lớn hơn trang public (giữ nguyên để không phá CMS).
- Archive content gốc có CSS riêng (chỉ chrome được đồng bộ).
- Chưa có component Button/Link dùng chung cho toàn site; các class Tailwind lặp lại có chủ đích.
