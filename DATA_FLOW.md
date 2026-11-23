# DATA FLOW — VSOT Demo Ver 2

## 1. Public read

```mermaid
flowchart LR
  B[Browser] -->|GET| N[Next.js RSC]
  N -->|createSupabasePublicClient| DB[(Supabase Postgres)]
  DB -->|RLS: status=published| N
  N -->|HTML + JSON-LD| B
  B -->|client filter q/room/type| B
```

- Không gửi cookie người dùng khi đọc public → không thấy draft, cache an toàn.
- Truy vấn programme gom 1 lần: conference, dates, rooms, types, sessions kèm
  translations/people/presentations.
- Faculty lấy toàn bộ người của conference (quy mô nhỏ), lọc client-side.

## 2. Programme filtering

```mermaid
sequenceDiagram
  participant B as Browser
  participant P as chuong-trinh page
  participant C as ProgrammeResults (client)
  B->>P: ?date=2026-10-13&view=grid&q=ghép&room=&type=
  P->>P: SSR sessions theo date
  P->>C: sessions + filters ban đầu
  C->>C: filter q/room/type trong useMemo
  C->>B: history.replaceState cập nhật URL
  Note over C: date/view do server xử lý; filter giữ khi đổi view/ngày
```

## 3. Contact form

```mermaid
sequenceDiagram
  participant U as User
  participant F as /vi/lien-he
  participant A as submitContact (server action)
  participant DB as Supabase
  U->>F: submit form
  F->>A: FormData
  A->>A: honeypot + Zod validate
  A->>DB: service role đếm request/IP 10 phút
  alt >= 5
    A-->>U: ?error=rate
  else hợp lệ
    A->>DB: INSERT contact_requests (RLS public insert)
    A-->>U: ?sent=1
  end
```

## 4. Admin mutation

```mermaid
flowchart TD
  R[Request admin action] --> AUTH{getUser?}
  AUTH -->|no| LOGIN[Redirect đăng nhập]
  AUTH -->|yes| PERM{has permission?}
  PERM -->|no| DENY[403/không quyền]
  PERM -->|yes| VAL[Zod validate]
  VAL --> WRITE[(INSERT/UPDATE)]
  WRITE --> AUDIT[(audit_logs)]
  WRITE --> REV[revalidatePath]
```

## 5. Import/migration flow

```mermaid
flowchart LR
  S[seed/programme.json] --> I[import_2026.py]
  M[migrations 0001..0017] --> A[apply_migrations.py]
  A -->|dry-run rollback| DB[(Postgres)]
  A -->|--apply commit| DB
  I -->|upsert legacy_sid/legacy_pid| DB
  DB --> W[Public site]
```

## 6. SEO flow

- `app/sitemap.ts` đọc conference published từ public client, sinh URL VI/EN.
- `app/robots.ts` chặn admin/api/login, trỏ sitemap.
- JSON-LD chèn ở layout (Organization), landing hội nghị/phiên (Event), profile (Person).
- Metadata canonical/hreflang/OG sinh theo `params` từng trang.
