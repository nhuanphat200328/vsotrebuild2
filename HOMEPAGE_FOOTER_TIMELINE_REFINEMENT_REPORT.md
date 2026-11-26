# HOMEPAGE FOOTER TIMELINE REFINEMENT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. File đã sửa

| File | Nội dung |
|---|---|
| `components/layout/site-footer.tsx` | Bỏ 4 link hội nghị cũ; giữ cấu trúc Footer chuẩn |
| `app/[locale]/layout.tsx` | Bỏ prop archiveSites không còn dùng ở Footer |
| `components/home/typewriter-slogan.tsx` | Slogan 2 dòng + Typewriter |
| `components/home/conference-timeline.tsx` | Timeline ngang có animation |
| `app/[locale]/page.tsx` | Dùng 2 component mới; thêm ảnh KV nền mờ |
| `app/globals.css` | Slogan, cursor, timeline CSS |
| `scripts/sync_legacy_chrome.py` | Footer HTML mới cho archive |
| `public/legacy/shared/site-chrome.css` | Footer brand ngang, font/màu, responsive |
| 62 trang `public/legacy/**/*.html` | Thay footer cũ bằng Footer chuẩn |
| `HOMEPAGE_FOOTER_TIMELINE_REFINEMENT_REPORT.md` | Báo cáo này |

## 2. Footer trang chủ

Đã bỏ khỏi cột “Hội nghị”:
- Hội nghị 2025
- Hội nghị 2023
- Hội nghị 2022
- Hội nghị 2021

Giữ “Kho lưu trữ hội nghị”; Header vẫn giữ dropdown đầy đủ. Không xóa route/trang/tài nguyên.

## 3. Footer archive

- 62 trang HTML archive (2018, 2019, 2021, 2022, 2023, 2025) được thay footer bằng
  `sync_legacy_chrome.py`.
- Dùng chrome tĩnh namespace `vsot-archive-*`; không phụ thuộc CSS legacy.
- Cấu trúc: brand (logo 44×38 bên trái + 2 dòng text bên phải) + giới thiệu Hội;
  2 cột link; cột liên hệ; copyright.
- CSS cô lập `.vsot-archive-footer ...` để không bị `BODY`, `a:link`, `div` của
  2018/2019/2021 đè font/màu/underline.
- Footer desktop 4 cột; tablet 2 cột; mobile 1 cột. Brand ngang ở mọi kích thước;
  nội dung giới thiệu Hội giữ nguyên.

Đo DevTools 2018 mobile 360:
- brand width 320, height 41; logo 44×39; text 264×41; gap 12px.
- font `Be Vietnam Pro`, 14px, color `rgba(255,255,255,.78)`, decoration none,
  background `#1B1F4F`; không còn link năm cũ.

## 4. Slogan Typewriter

- Chia cứng theo dấu phẩy: dòng 1 “Kết nối tri thức”, dòng 2
  “Nâng tầm ghép tạng Việt Nam” (capitalize chữ đầu).
- Server render đầy đủ 2 dòng trong DOM/`aria-label`; JS chỉ thay đổi nội dung hiển thị.
- Gõ dòng 1 trước, rồi dòng 2; tốc độ 55 ms/ký tự; cursor nhấp nháy; dừng sau 900 ms.
- `min-height:1.15em` cho từng dòng; `white-space:nowrap`; không layout shift.
- Reduced motion: giữ nguyên 2 dòng đầy đủ, không cursor/animation.
- DevTools: sớm `Kết nối t` → giữa `Kết nối tri thức` + `Nâng tầm ghép` → cuối
  đủ 2 dòng, cursor biến mất.
- Đo 1920/1440/1366/768/390/375/360: 2 dòng, `scrollWidth == clientWidth`, không tràn.

## 5. KV

- Thêm lớp `Image` cùng `/media/2026/kv.png` phía sau: `fill`, `object-cover`,
  `scale-110`, `blur-xl`, `opacity-40`; overlay `brand-50/35`.
- Ảnh chính vẫn `kv-hero-image` nét, giới hạn chiều cao viewport.
- DevTools: KV bottom 742/768 (1366), 874/900 (1440), 1012/1080 (1920);
  mobile 295/844. Background image tồn tại, phủ kín section, không lộ nền trơn.

## 6. Timeline Hội nghị các năm

- Dữ liệu `legacy_sites` (không hardcode), sort tăng dần:
  2018 → 2019 → 2021 → 2022 → 2023 → 2025.
- Component client `ConferenceTimeline`: mốc fade/translate lần lượt (delay 150ms),
  đường line `scaleX(0→1)` 1.6s, arrow hiện sau 1.9s.
- Chạy một lần khi section vào viewport; không lặp; reduced-motion hiển thị tĩnh.
- Mỗi mốc là link thật, focus outline; mobile 6 cột, font 12px, không tràn ngang.
- DevTools: trước armed line width 0/arrow opacity 0; sau scroll line width 1080,
  transform matrix(1), arrow opacity 1; thứ tự đúng.

## 7. Kiểm thử

- `typecheck`, `lint`, `build` PASS.
- Chrome headless/CDP: 1920, 1440, 1366, 768, 390, 375, 360.
- Footer React: không còn text “Hội nghị 2025/2023/2022/2021”, còn “Kho lưu trữ”.
- Footer 2018/2019/2021/2023/2025: logo, font, màu, decoration, brand ngang đúng.
- Timeline/slogan/KV đo như mục 4–6.

## 8. Tồn tại

- Chưa deploy Vercel commit mới; live có thể chưa có code này.
- Chưa test Safari/iOS, touch thật, screen reader; chưa chụp ảnh so sánh.
- Timeline dùng JS để arm animation; nếu JS lỗi vẫn hiển thị đầy đủ nhưng không animate.
- Footer archive là HTML/CSS riêng (namespace) thay vì React component, do file legacy tĩnh;
  đã khớp cấu trúc/hình thức Footer chuẩn.
- 2020/2024 không có dữ liệu nguồn nên không xuất hiện.
