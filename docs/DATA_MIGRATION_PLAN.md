# DATA MIGRATION PLAN

## 1. Nguyên tắc

- File nhị phân ở Storage/local, metadata ở Postgres.
- Không DROP/ghi đè dữ liệu; migration idempotent.
- Local `public/...` giữ làm fallback; UI ưu tiên Storage public URL nếu có `storage_path`.
- Không public tài liệu nội bộ (DOCX cá nhân, XLSX, báo cáo).

## 2. Bucket

Dùng bucket sẵn có `media-public` (public). Không tạo bucket mới.

```
conference-2026/
  branding/{kv.png,logo.gif}
  abstracts/abs-tong-hop.pdf
  templates/{3 pptx}
  invitations/{pdf,jpg}
  news/{4 pdf}
conference-2023/documents/chuong-trinh-vsot-2023.pdf
conference-2025/documents/CTKH.pdf
```

## 3. Migrations

| File | Nội dung |
|---|---|
| `0018` | `conference_documents.file_path/file_format/description`; bảng `news_attachments`; RLS |
| `0019` | Seed 3 tin, 3 tệp, 6 tài liệu, 6 legacy sites |
| `0020` | Policy tin cho phép `published_at IS NULL` |
| `0021` | Sửa mô tả abstract theo nguồn |
| `0023` | Cột `storage_bucket/storage_path/source_url`; media rows; map tài liệu/tệp sang Storage |
| `0024` | Thêm 2 tin (thông báo số 2, thư mời tài trợ) + tệp |

## 4. Upload

`python -u scripts/upload_media.py` — đọc `.env.local`, upload 14 object bằng service role
(x-upsert, idempotent), không in key. Kết quả: 14/14 OK.

## 5. UI URL

`lib/utils/storage.ts` → `mediaUrl(ref)`:
- Có `storage_path` → `<SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>`.
- Không có → `file_path` local.

Áp dụng cho tài liệu landing hội nghị, tài liệu báo cáo viên, thư mời, tin tức/tệp đính kèm.

## 6. RLS

- `media-public` public read.
- Ghi Storage cần `media.upload` (authenticated).
- `news_attachments`: public read theo tin published; ghi cần `news.write`.
- `conference_documents`: đọc public `is_public`; không mở ghi công khai.

## 7. Admin

Chưa có UI quản lý tệp/tài liệu/archive; đề xuất:
- Form tin: thêm attachment (title, storage path, format, sort, public).
- Trang `conference_documents` theo loại/year.
- Trang `legacy_sites` bật/tắt, entry path.
Không tạo hệ thống mới; dùng lại RBAC hiện có.
