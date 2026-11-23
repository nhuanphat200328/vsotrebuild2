# DATABASE DESIGN — VSOT Demo Ver 2

- Supabase project ref: `yrvhrsztcxfhlxsxbzhv` (Postgres 17).
- Migrations: `supabase/migrations/0001..0017` đã áp dụng.
- Trạng thái kiểm tra 2026-11-23: **35 bảng public, 94 policy RLS, 3 storage bucket,
  4 role, 31 permission**.
- Dữ liệu 2026: 1 conference, 5 ngày, 6 phòng, 11 loại phiên, 65 phiên,
  255 báo cáo, 245 người, 348 phân công.

## 1. Nguyên tắc

- UUID PK (`gen_random_uuid()`); `created_at`/`updated_at` (trigger), audit log append-only.
- RLS bật mọi bảng public; public chỉ đọc dữ liệu `published`.
- Nội dung đa ngôn ngữ tách bảng `*_translations` với `status` (`missing|draft|pending_review|published|archived`).
- Vai trò là assignment nhiều-nhiều, không lưu trực tiếp trên `people`.
- Không dùng JSON cho dữ liệu cần truy vấn; JSON chỉ cho `landing_config`, body block CMS.

## 2. Nhóm bảng (35)

| Nhóm | Bảng |
|---|---|
| Auth/RBAC | `profiles`, `roles`, `permissions`, `role_permissions`, `user_roles`, `audit_logs` |
| Media/Settings | `media`, `site_settings` |
| CMS | `pages`, `page_translations`, `news`, `news_translations`, `news_categories`, `news_category_translations`, `news_related` |
| Conference | `conferences`, `conference_translations`, `conference_dates`, `rooms`, `session_types`, `tracks` |
| Programme | `sessions`, `session_translations`, `presentations`, `presentation_translations`, `session_people`, `presentation_people` |
| People | `people`, `person_translations` |
| Tài liệu/Sponsor | `conference_documents`, `sponsors`, `conference_sponsors` |
| Contact | `contact_requests`, `contact_notes` |
| Legacy | `legacy_sites` (không dùng ở v2) |

## 3. Bảng lõi

```sql
conferences(id uuid pk, slug text unique, year int unique, status conference_status,
            start_date date, end_date date, city text, country text,
            theme_vi text, landing_config jsonb, created_at, updated_at, deleted_at)

conference_dates(id, conference_id fk, date date, label_vi, label_en, kind, sort,
                 unique(conference_id, date))

rooms(id, conference_id fk, code, name_vi, name_en, floor, capacity, sort,
      unique(conference_id, code))

sessions(id, conference_id fk, date_id fk, room_id fk, session_type_id fk,
         track_id fk null, start_time time, end_time time, program_number text,
         status content_status, sort int, legacy_sid text, is_separator bool,
         check(end_time > start_time))

presentations(id, session_id fk, start_time time, end_time time, sort int,
              presentation_type text, abstract text, keywords text[],
              status content_status, legacy_pid text)

people(id, slug text unique, full_name, display_name, title, degree, position,
       institution, department, city, country, email_public, linkedin_url,
       orcid_url, status content_status)

session_people(session_id fk, person_id fk, role assignment_role, sort,
               unique(session_id, person_id, role))
presentation_people(presentation_id fk, person_id fk, role assignment_role, sort,
                    unique(presentation_id, person_id, role))
```

`assignment_role`: `chair | co_chair | discussant | moderator | presenter | invited_speaker`.

## 4. Ràng buộc nghiệp vụ

- Presentation phải nằm trong khoảng thời gian session nếu có giờ.
- Cùng phòng + overlap thời gian: chặn publish (cảnh báo, không tự sửa).
- Separat/break dùng `is_separator` hoặc `session_types.is_break`, vẫn có giờ thật.
- `legacy_sid`/`legacy_pid` unique theo conference để import idempotent.
- Role summary = DISTINCT role theo person + conference; không giả định 1 người 1 vai trò.

## 5. Index chính

```sql
create index on sessions (conference_id, date_id, start_time);
create index on sessions (room_id, start_time);
create index on presentations (session_id, sort);
create index on session_people (person_id, role);
create index on presentation_people (person_id, role);
```

## 6. RLS (94 policy)

- Public SELECT: conference, date, room, type, track, session + translation, presentation +
  translation, session_people, presentation_people, people + translation, documents,
  sponsors, pages/news đã publish.
- Admin mutation: `has_permission('<resource>.<action>')`.
- `profiles`: self read/update giới hạn; `user_roles`: chỉ super_admin (trừ bảo vệ super_admin).
- `audit_logs`: chỉ `audit.read`; không policy UPDATE/DELETE.
- `contact_requests`: public INSERT (migration 0014), chỉ role có `contact.read/update` đọc/sửa.
- Storage: bucket public read, write theo permission.

Kiểm chứng bằng anon key (2026-11-23):
- `conferences?status=eq.draft` → `[]`
- `contact_requests`, `profiles`, `audit_logs` → `[]`
- `conferences?status=eq.published` → `[{"slug":"2026"}]`

## 7. Import dữ liệu 2026

- Nguồn: `supabase/seed/2026/programme.json` (từ chương trình VSOT 2026 thật).
- `scripts/import_2026.py` upsert theo `legacy_sid`/`legacy_pid`, gán title/institution,
  tạo assignment chair/discussant/presenter.
- Không tạo conference 2027 giả; trang/năm chưa có dữ liệu hiển thị "đang cập nhật".

## 8. Quy tắc thay đổi schema

1. Tạo migration mới `0018_...sql`, idempotent (`if not exists`, `drop policy if exists`).
2. Dry-run `python scripts/apply_migrations.py`, chỉ `--apply` khi được duyệt.
3. Không sửa migration đã áp dụng; không DROP dữ liệu hiện có.
4. Cập nhật tài liệu này + `SYSTEM_ARCHITECTURE.md` khi schema đổi.

## 15. PHASE 2 — Bổ sung nội dung 2026 & archive

- `news_attachments`: tệp đính kèm tin tức (RLS public theo tin published, write cần `news.write`).
- `conference_documents`: thêm `file_path`, `file_format`, `description_vi/en`.
- `legacy_sites`: 6 dòng archive 2018–2025 (2020/2024 không có nguồn).
- Migrations `0018`–`0021`; DB 36 bảng, 96 policy, 3 tin, 3 tệp, 6 tài liệu, 6 archive.
- Tin không có ngày publish dùng `published_at = NULL`; policy cho phép đọc (0020).
