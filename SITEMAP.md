# SITEMAP — VSOT Demo Ver 2

Locale: `vi` (mặc định), `en`. URL: `/{locale}/...`. `/` → `/vi`.

## Public

```
/                                     redirect /vi
/vi
/en
/vi/hoi-nghi                          danh sách hội nghị published
/vi/hoi-nghi/2026                     landing hội nghị + JSON-LD Event
/vi/hoi-nghi/2026/chuong-trinh        ?date=YYYY-MM-DD&view=list|grid|table&q=&room=&type=
/vi/hoi-nghi/2026/chuong-trinh/tong-quan
/vi/hoi-nghi/2026/phien/[id]          canonical chi tiết phiên
/vi/hoi-nghi/2026/dien-gia            ?q=&role=chair|discussant|presenter
/vi/hoi-nghi/2026/dien-gia/[slug]     hồ sơ diễn giả
/vi/tin-tuc
/vi/tin-tuc/[slug]
/vi/lien-he                           form liên hệ
/vi/[slug]                            trang CMS đã publish
/en/...                               bản EN (fallback VI khi thiếu bản dịch)
/404                                  not-found
/sitemap.xml
/robots.txt
```

Bản `/en` của mọi route công khai dùng cùng component; banner fallback khi bản dịch thiếu.

## Admin (yêu cầu đăng nhập, RBAC)

```
/admin                                -> /admin/dashboard
/admin/dashboard
/admin/conferences
/admin/conferences/[id]/programme
/admin/conferences/[id]/programme/new
/admin/conferences/[id]/programme/[sessionId]
/admin/pages, /admin/pages/new, /admin/pages/[id]
/admin/news, /admin/news/new, /admin/news/[id], /admin/news/categories
/admin/media
/admin/contacts
/admin/users
```

## API

```
GET  /api/health                      trạng thái cấu hình (không lộ giá trị)
POST /api/auth/signout                đăng xuất
```

## Navigation

Header: Trang chủ · Hội nghị (dropdown: Chương trình, Tổng quan, Diễn giả, Hội nghị 2026) ·
Chương trình · Diễn giả · Tin tức · Liên hệ · VI/EN · nút Liên hệ.
Mobile: menu đầy đủ + bottom dock 5 mục (Trang chủ, Chương trình, Diễn giả, Tìm kiếm, Liên hệ).
Footer: Về VSOT · Hội nghị · Liên hệ + copyright.

## Quy tắc URL

- Slug tiếng Việt không dấu, lowercase, hyphen; không đổi slug đã publish nếu chưa có redirect 301.
- `sessionId`/`presentationId` UUID; `person.slug` unique.
- `date` ISO `YYYY-MM-DD`; đổi view/ngày giữ filter hiện tại (cải thiện so với TTS).
- Link tĩnh/PDF/ngoài dùng `<a>`; link nội bộ dùng `next/link`.

## Noindex / không public

`/admin/**`, `/api/**`, `/vi/dang-nhap`, `/en/dang-nhap` bị chặn trong `robots.txt` và
không có trong sitemap.

## PHASE 2 additions

```
/[locale]/hoi-nghi/cac-nam-truoc       Kho lưu trữ hội nghị 2018–2025
/[locale]/tin-tuc/[slug]               Tin + tệp đính kèm (PDF)
/legacy/<year>/...                      Site archive tĩnh từng năm (link header đã trỏ site mới)
```

Tin tức có `news_attachments`; tài liệu hội nghị/template/thư mời có metadata trong DB.
