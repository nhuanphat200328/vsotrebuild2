# GLOBAL HEADER/FOOTER AUDIT

## 1. Trước khi sửa

- Trang chủ/năm 2026: React `SiteHeader`/`SiteFooter`.
- 62 trang archive 2018–2025: header/footer v1 chèn sẵn, font Roboto/League Spartan,
  link `/legacy/2026/*` (không tồn tại trong bản mới), logo cũ.
- 2023: trang HTML cũ mô tả như website đầy đủ dù chỉ còn PDF.
- Không có cơ chế shared chrome cho file tĩnh.

## 2. Sau khi sửa

- Trang React giữ `SiteHeader`/`SiteFooter`: 2 dropdown, mobile dock, VI/EN.
- Archive: script `sync_legacy_chrome.py` bỏ header/footer v1 và chèn chrome tĩnh
  `vsot-archive-header` / `vsot-archive-footer` + `site-chrome.css`.
- Chrome tĩnh dùng Be Vietnam Pro, navy `#282D7D`, gold `#F5B53D`, cùng cấu trúc nav 5 mục,
  footer 4 cột, logo `/media/2026/logo.gif`.
- Link archive trỏ `/vi`, `/vi/hoi-nghi`, `/vi/hoi-nghi/cac-nam-truoc`, `/vi/tin-tuc`, `/vi/lien-he`.
- 2023 thay toàn bộ bằng trang lưu trữ đơn giản: tiêu đề + mô tả + nút/iframe PDF + chrome chung.
- Đã cập nhật 62 file HTML; 2018/2019/2021/2022/2023/2025; 2024/2020 không có nguồn.

## 3. Kiểm tra

- 2025: `vsot-archive-header` có, `full-containter full-header` không; gallery còn.
- 2018: chrome mới, nội dung "VSOT 2018" còn.
- 2023: không còn section "Diễn giả"; có `chuong-trinh-vsot-2023.pdf`.
- Không đổi nội dung chuyên môn/bài viết trong archive.

## 4. Hạn chế

- Chrome archive là HTML tĩnh, không phải React; không có dropdown hover như trang chủ,
  nhưng cùng hệ thống màu/font/nav/link và dùng được trên mobile (nav wrap/scroll).
- Không có logo riêng từng năm; dùng logo VSOT chung.
- Chưa kiểm console trên trình duyệt thật cho các trang archive cũ.
