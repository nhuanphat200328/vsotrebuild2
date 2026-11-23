# INTERACTION TEST REPORT

## 1. Kiểm tra tự động

| Hạng mục | Kết quả |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| Abstract mapping 105 | PASS |
| Upload abstract HTML/PDF lên Storage | PASS (105 file) |
| `docs/ABSTRACT_MAPPING_REPORT.md` | Có 105 dòng mapping, 17 poster, 0 thiếu |

## 2. HTTP

| URL | Kết quả |
|---|---|
| `/vi` | 200; KV trước intro, không overlay; 5 tin; logo thật |
| `/vi/hoi-nghi/2026/bao-cao/<id>/abstract` | 200; iframe local HTML, sandbox |
| `/media/2026/abstracts/2026-10-16-10-1.html` | 200 `text/html; charset=UTF-8` |
| `/vi/hoi-nghi/2026/phien/<id>` | 200; có link Abstract |
| `/legacy/2025/index.html` | 200; chrome mới, không header cũ |
| `/legacy/2023/index.html` | 200; chỉ PDF, chrome mới |
| `/legacy/2018/index.html` | 200; chrome mới, nội dung còn |

## 3. Tương tác

- Hover nav/link/button: đổi màu/underline; ảnh archive zoom 1.01.
- Reveal section: CSS `animation-timeline: view()` có `@supports` + reduced-motion.
- CountUp: SSR hiển thị số cuối; vào viewport reset 0 và chạy; chỉ một lần.
- Abstract: iframe + mở tab mới + tải; không hiển thị nếu không có file.
- Mobile: nav archive wrap/scroll; main mobile dock giữ nguyên.

## 4. Chưa kiểm

- Trình duyệt thật Chrome/Edge/Safari, DevTools console/network.
- Thiết bị thật 360/390/768/1024/1440.
- PDF iframe trên iOS/Safari.
- Toàn bộ 105 nút Abstract bằng tay; mới kiểm mẫu + DB count.

## 5. Abstract trên programme

- Trang chương trình ngày 2026-10-16: 23 link Abstract / 23 bài có abstract trong ngày.
- Tổng DB: 105 presentation có abstract; 17 poster chưa map.
- Bài không có abstract trả 404 khi mở route abstract.
- Iframe HTML dùng local `/media/2026/abstracts/...` (Storage trả text/plain cho HTML),
  có `sandbox`; PDF dùng Storage URL.
