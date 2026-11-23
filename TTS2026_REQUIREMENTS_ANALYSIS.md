# TTS2026 REQUIREMENTS ANALYSIS

Nguồn: `PrototypeClone/docs/TTS2026_PROGRAMME_REFERENCE.txt` (1.516 dòng, đọc toàn bộ ngày 2026-11-23).
Quy ước tài liệu gốc: `[VERIFIED]`, `[INFERRED]`, `[UNKNOWN]`.

## 1. Tổng quan

Website mẫu TTS 2026 là ứng dụng server-rendered (CakePHP + UIkit 3.5.4 + jQuery) cho chương trình
hội nghị 4 ngày, ~23 phòng, 1.286 faculty. Mục tiêu VSOT: tái hiện mô hình thông tin và UX, không
sao chép thương hiệu/nội dung; quy mô nhỏ hơn nhiều (5 ngày, 6 phòng).

## 2. Mục tiêu

- Khu vực Programme hiện đại: List / Grid / Table / At a glance dùng chung dữ liệu và `date`.
- Faculty directory theo chữ cái, badge vai trò C/I/P, lọc đa tiêu chí.
- Tìm kiếm inline (không bắt buộc trang Search riêng).
- Trang chi tiết phiên/diễn giả canonical để chia sẻ và SEO.
- Responsive mobile-first; không dashboard gamification.

## 3. Sitemap mục tiêu

```
/[locale]
/[locale]/hoi-nghi
/[locale]/hoi-nghi/[year]
/[locale]/hoi-nghi/[year]/chuong-trinh            (?date&view&q&room&type)
/[locale]/hoi-nghi/[year]/chuong-trinh/tong-quan
/[locale]/hoi-nghi/[year]/phien/[id]
/[locale]/hoi-nghi/[year]/dien-gia                (?q&role)
/[locale]/hoi-nghi/[year]/dien-gia/[slug]
/[locale]/tin-tuc, /[locale]/tin-tuc/[slug]
/[locale]/lien-he
/[locale]/[slug]                                   (trang CMS)
/admin/**                                           (CMS, RBAC)
/sitemap.xml, /robots.txt
```

## 4. Module và chức năng

| Module | Chức năng bắt buộc | Trạng thái triển khai |
|---|---|---|
| App shell | Header/nav/footer, mobile dock, locale VI/EN, skip link | Có |
| Programme List | Ngày → phiên (details/summary) → chairs → báo cáo; mở chi tiết | Có |
| Programme Grid | Nhóm theo giờ bắt đầu, card phòng/loại/tiêu đề/track/số báo cáo | Có |
| Programme Table | Ma trận giờ × phòng, sticky header/cột giờ, cuộn ngang, a11y region | Có |
| At a glance | Tổng quan theo ngày, phòng × giờ, link phiên | Có (bảng tổng quan từng ngày) |
| Filter/search | `q`, phòng, loại phiên; giữ `date`; URL state; empty state | Có (client-side, dữ liệu nhỏ) |
| Faculty directory | Nhóm chữ cái, ảnh tùy chọn, badge C/D/P, tìm + lọc vai trò | Có |
| Faculty profile | Role summary, phân công theo ngày/giờ/phòng/phiên/báo cáo | Có |
| Session detail | Canonical URL, chairs, presentations, JSON-LD | Có |
| Contact | Thông tin liên hệ + form lưu DB, honeypot, rate limit | Có |
| CMS | Programme builder, pages, news, media, contacts, users | Có (kế thừa v1, đã rà soát route/quyền) |
| Login | Supabase Auth, không public signup | Có |

Không triển khai (đúng phạm vi): My Agenda, video hub, delegate directory, award winners,
dashboard 25+ tile, postcard/share image, PWA install prompt.

## 5. Cấu trúc dữ liệu (suy ra từ tài liệu, đã kiểm chứng qua dữ liệu 2026)

```
Person(id, slug, full_name, display_name, title, institution, country, photo, status)
Conference(id, slug, year, start_date, end_date, city, status)
ConferenceDate(id, conference_id, date, label, kind, sort)
Room(id, conference_id, code, name, sort)
SessionType(id, code, name, is_break)
Session(id, conference_id, date_id, room_id, type_id, start, end, program_number, is_separator)
SessionTranslation(session_id, locale, title, short_title, status)
Presentation(id, session_id, start, end, sort, type, legacy_pid)
PresentationTranslation(presentation_id, locale, title, abstract, status)
SessionPeople(session_id, person_id, role)         -- chair/co_chair/discussant/moderator
PresentationPeople(presentation_id, person_id, role) -- presenter/invited_speaker
```

Quy tắc:
- Một người nhiều vai trò: role là thuộc tính assignment, không phải cột trên person.
- Role summary = DISTINCT role theo person + conference.
- Xung đột phòng cùng giờ: cảnh báo khi publish, không tự sửa dữ liệu.

## 6. Luồng người dùng chính

1. Trang chủ → CTA chương trình → chọn ngày → xem List/Grid/Table → mở phiên → mở hồ sơ diễn giả.
2. Trang chủ → Diễn giả → lọc theo tên/vai trò → hồ sơ → phiên tham gia.
3. Bất kỳ trang chương trình → ô tìm kiếm inline → lọc tức thời theo phiên/báo cáo/diễn giả/phòng.
4. Liên hệ → form → lưu `contact_requests` → admin xử lý trong `/admin/contacts`.

## 7. Giao diện / design system

Kế thừa tinh thần TTS, đổi nhận diện VSOT:
- Primary navy `#282D7D` (scale 50–900), accent gold `#F5B53D`.
- Text `#2b3a4b`, muted `#66758a`, line `#dfe5eb`, surface `#f6f9fc`.
- Role: Chair `#c93535`, Invited `#0b4f84`, Presenter `#318d49`; discussant dùng gold.
- Typography Be Vietnam Pro (hỗ trợ dấu tiếng Việt), weight 400–800.
- Radius 4/8/12/16/999; shadow nhẹ; session card viền trái 4px.
- Component: button primary/secondary/quiet, badge role, card, date tab, filter panel, empty state,
  mobile dock 5 mục.

## 8. Responsive

Breakpoints dùng: sm 640, md 768, lg 1024, xl 1280.
- <1280: ẩn desktop nav, hiện menu + bottom dock; footer có padding tránh dock.
- Table cuộn ngang có khung, sticky cột giờ/header; Faculty chuyển 1 cột ở mobile.
- Date tabs cuộn ngang; filter search xếp dọc.
- Kiểm thử mục tiêu: 360/390/768/1024/1440.

## 9. SEO

- Metadata theo trang: title template, description, canonical, hreflang vi/en, Open Graph.
- JSON-LD: Organization (site-wide), Event (hội nghị, phiên), Person (diễn giả).
- `sitemap.xml` sinh từ DB + route tĩnh; `robots.txt` chặn `/admin`, `/api`, trang đăng nhập.
- Semantic heading: 1 H1/trang; link nội bộ tuyệt đối; ảnh có alt khi bổ sung media.
- Không index dữ liệu quản trị.

## 10. Tích hợp ngoài

- Supabase: Postgres + Auth + Storage (bắt buộc).
- GitHub/Vercel: repo và Preview khi được duyệt; không cấu hình Production.
- Không dùng API bên thứ ba khác; Google Maps của template không dùng.

## 11. Yêu cầu chưa rõ / quyết định

| Vấn đề | Quyết định trong bản này |
|---|---|
| Có cần tài khoản đại biểu/My Agenda | Không; chỉ admin CMS |
| Song ngữ đầy đủ | VI là nguồn; EN fallback kèm banner khi thiếu bản dịch |
| Grid/Table có cần | Có, dữ liệu nhỏ nên giữ cả 3 chế độ |
| Abstract/toàn văn | Chưa hiển thị; schema có trường `abstract` |
| Vai trò ngoài C/D/P | Schema hỗ trợ moderator/co_chair/invited; UI legend 3 nhóm chính |
| Import dữ liệu | JSON chuẩn hoá từ nguồn VSOT 2026, không tạo dữ liệu giả |
