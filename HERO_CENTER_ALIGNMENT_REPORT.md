# HERO CENTER ALIGNMENT REPORT

Ngày: 2026-11-23. Workspace: `D:\Philao\code project\VSOT\demo ver2`.

## 1. Nguyên nhân thực tế

- Container `home-intro-wide` đã được căn giữa theo viewport (scrollbar gutter hai bên).
- Nhưng tiêu đề `VSOT 2026` là một block rộng bằng cả cột phải, chữ lại **căn trái**,
  nên mép phải thực tế của chữ `2026` không chạm mép phải vùng nội dung.
- Vì vậy trung điểm giữa **mép trái logo** và **mép phải chữ 2026** nằm lệch trái so với
  tâm ảnh KV, dù container và cột đều đúng tỷ lệ.

## 2. Cách sửa

- Thêm class `.hero-conference-name` cho H2 `VSOT 2026`.
- Desktop ≥1024: `text-align: right` cho H2 này.
- Không đổi container, grid 1.15fr/0.85fr, gap, divider, logo, KV, stats hay nội dung.
- Mobile/tablet giữ H2 căn trái như cũ.

## 3. Toạ độ trước/sau (Chrome CDP)

| Viewport | Trước: logo left | Trước: 2026 right | Trước: mid / KV | Sau: logo left | Sau: 2026 right | Sau: mid / KV | Lệch sau |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1366 | 95 | 957 | 526 / 683 | 95 | 1271 | 683 / 683 | **0** |
| 1440 | 95 | 999 | 547 / 720 | 95 | 1345 | 720 / 720 | **0** |
| 1920 | 272 | 1249 | 760 / 960 | 272 | 1648 | 960 / 960 | **0** |

- Trung điểm tính bằng `(logo.left + rightEdge(2026)) / 2`.
- `/vi` và `/en` cho cùng toạ độ.
- `scrollWidth - innerWidth = -30` (scrollbar/gutter), không tràn ngang.
- H2 right edge = mép phải vùng nội dung container; logo left = mép trái nội dung.
- Typewriter/CountUp/KV layout không đổi; không layout shift.

## 4. File đã sửa

| File | Thay đổi |
|---|---|
| `app/[locale]/page.tsx` | Thêm class `hero-conference-name` cho H2 |
| `app/globals.css` | Desktop: H2 căn phải |
| `HERO_CENTER_ALIGNMENT_REPORT.md` | Báo cáo |

## 5. Responsive

- Desktop 1366/1440/1920: boundary mid = KV center, delta 0.
- Tablet/mobile: H2 không bị căn phải; bố cục hiện tại giữ nguyên.
