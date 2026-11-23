# HEADER/FOOTER CONSISTENCY REPORT

## 1. Kết quả

- 62 trang archive HTML (2018, 2019, 2021, 2022, 2023, 2025) đã bỏ header/footer v1 và dùng
  chrome tĩnh chung `/legacy/shared/site-chrome.css` + markup `vsot-archive-header/footer`.
- 2023 có trang lưu trữ mới, không còn section giả lập.
- Trang React (2026/home/news) giữ `SiteHeader`/`SiteFooter` hiện có.

## 2. Thuộc tính đồng bộ

| Thuộc tính | Giá trị |
|---|---|
| Font | Be Vietnam Pro, fallback Segoe UI |
| Màu | Navy `#282D7D`, gold `#F5B53D`, line `#DFE5EB` |
| Header | sticky, cao ~72px desktop; mobile wrap + nav scroll |
| Footer | 4 cột, nền navy, link hover trắng/underline |
| Logo | `/media/2026/logo.gif`, kích thước cố định |
| Nav | Trang chủ, Hội nghị, Hội nghị các năm, Tin tức, Liên hệ |
| Active | Archive link có underline gold |
| Mobile | nav wrap/scroll, không vỡ layout; footer 2→1 cột |

## 3. Kiểm tra

- 2025: không còn `full-containter full-header`; gallery còn.
- 2018: chrome mới + nội dung "VSOT 2018".
- 2023: chỉ PDF, `vsot-archive-header` + `vsot-archive-footer`.
- Link logo/menu trỏ route mới.

## 4. Hạn chế

- Chrome archive là HTML tĩnh, không có dropdown hover như React header.
- Nội dung archive giữ theme gốc bên dưới chrome.
- Chưa kiểm console/browser thật.
