# VSOT Demo Ver 2

Website Há»™i GhÃ©p táº¡ng Viá»‡t Nam (VSOT) â€” báº£n dá»±ng láº¡i Ä‘á»™c láº­p trong workspace
`demo ver2`, tham chiáº¿u tÃ i liá»‡u TTS 2026 vÃ  kinh nghiá»‡m tá»« VSOT v1.

- Stack: Next.js 16 (App Router) Â· React 19 Â· TypeScript strict Â· Tailwind CSS 4 Â· Supabase (Postgres, Auth, Storage)
- Dá»¯ liá»‡u tháº­t: há»™i nghá»‹ VSOT 2026 (5 ngÃ y, 6 há»™i trÆ°á»ng, 65 phiÃªn, 255 bÃ¡o cÃ¡o, 245 ngÆ°á»i)
- NgÃ´n ngá»¯: tiáº¿ng Viá»‡t máº·c Ä‘á»‹nh, tiáº¿ng Anh cÃ³ fallback tiáº¿ng Viá»‡t
- Repo Ä‘Ã­ch: `nhuanphat200328/vsotrebuild2`
- Supabase project ref: `yrvhrsztcxfhlxsxbzhv` (khÃ´ng ghi key trong repo)

## YÃªu cáº§u

- Node.js >= 20.9 (Ä‘Ã£ kiá»ƒm vá»›i 24.17.0)
- npm 11+
- Python 3.12 + `psycopg[binary]` (chá»‰ cho migration/import)

## CÃ i Ä‘áº·t

```powershell
npm install
```

Táº¡o `.env.local` tá»« `.env.example` vÃ  Ä‘iá»n:

| Biáº¿n | Pháº¡m vi | Ghi chÃº |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | anon/publishable key, RLS báº¯t buá»™c |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client | tÃ¹y chá»n, tÆ°Æ¡ng Ä‘Æ°Æ¡ng anon |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | khÃ´ng bao giá» dÃ¹ng á»Ÿ client |
| `DIRECT_URL` | server only | Postgres non-pooling cho migration |
| `NEXT_PUBLIC_SITE_URL` | build/runtime | canonical, sitemap, Open Graph |

KhÃ´ng commit `.env.local`, khÃ´ng Ä‘Æ°a key vÃ o tÃ i liá»‡u, log hoáº·c frontend bundle.

## Cháº¡y local

```powershell
npm run dev
```

Má»Ÿ http://localhost:3000 â€” tá»± chuyá»ƒn tá»›i `/vi`.

## Kiá»ƒm tra

```powershell
npm run typecheck
npm run lint
npm run build
npm run start -- -p 3100
```

## Database

- Migrations: `supabase/migrations/0001..0017`, Ä‘Ã£ Ã¡p dá»¥ng vÃ o project má»›i.
- Ãp dá»¥ng láº¡i (idempotent, cÃ³ dry-run máº·c Ä‘á»‹nh):

```powershell
python scripts\apply_migrations.py          # dry-run + rollback
python scripts\apply_migrations.py --apply  # ghi tháº­t
```

- Import dá»¯ liá»‡u 2026 (idempotent theo `legacy_sid`/`legacy_pid`):

```powershell
python -u scripts\import_2026.py
```

Nguá»“n: `supabase/seed/2026/programme.json` (dá»¯ liá»‡u chÆ°Æ¡ng trÃ¬nh tháº­t cá»§a VSOT 2026).
Import ghi Ä‘Ã¨ giá»/phÃ²ng/tiÃªu Ä‘á» náº¿u cháº¡y láº¡i trÃªn DB Ä‘Ã£ chá»‰nh qua CMS.

## Routes chÃ­nh

| Route | Ná»™i dung |
|---|---|
| `/` | redirect `/vi` |
| `/vi`, `/en` | Trang chá»§, sá»‘ liá»‡u tháº­t tá»« DB |
| `/[locale]/hoi-nghi` | Danh sÃ¡ch há»™i nghá»‹ Ä‘Ã£ publish |
| `/[locale]/hoi-nghi/2026` | Landing há»™i nghá»‹ + JSON-LD Event |
| `.../chuong-trinh?date=&view=list|grid|table&q=&room=&type=` | Programme List/Grid/Table + tÃ¬m kiáº¿m/lá»c inline |
| `.../chuong-trinh/tong-quan` | Tá»•ng quan phÃ²ng Ã— giá» |
| `.../phien/[id]` | Chi tiáº¿t phiÃªn, canonical/share |
| `.../dien-gia?q=&role=` | Directory diá»…n giáº£ (C/D/P), lá»c client-side |
| `.../dien-gia/[slug]` | Há»“ sÆ¡ diá»…n giáº£ + cÃ¡c phÃ¢n cÃ´ng theo ngÃ y |
| `/[locale]/tin-tuc`, `/[slug]` | Tin tá»©c tá»« CMS + tá»‡p Ä‘Ã­nh kÃ¨m |
| `/[locale]/hoi-nghi/cac-nam-truoc` | Kho lÆ°u trá»¯ há»™i nghá»‹ 2018â€“2025 |
| `/legacy/<year>/...` | Website há»™i nghá»‹ cÃ¡c nÄƒm (báº£n báº£o toÃ n, link Ä‘Ã£ trá» vá» site má»›i) |
| `/[locale]/lien-he` | Form liÃªn há»‡ lÆ°u DB, honeypot + rate limit |
| `/admin/**` | CMS: dashboard, conferences/programme, pages, news, media, contacts, users |
| `/api/health` | Health check |
| `/sitemap.xml`, `/robots.txt` | SEO |

Admin yÃªu cáº§u Ä‘Äƒng nháº­p Supabase vÃ  quyá»n RBAC; kiá»ƒm quyá»n á»Ÿ page + server action.

## Deploy Vercel (khi Ä‘Æ°á»£c duyá»‡t)

1. Import repo `nhuanphat200328/vsotrebuild2`.
2. Framework preset: Next.js. Build: `npm run build`.
3. ThÃªm Environment Variables cho Preview/Production (khÃ´ng dÃ¹ng chung service key vá»›i local).
4. Äáº·t `NEXT_PUBLIC_SITE_URL` = URL Preview tÆ°Æ¡ng á»©ng.
5. KhÃ´ng cháº¡y migration tá»± Ä‘á»™ng tá»« Vercel; Ã¡p dá»¥ng thá»§ cÃ´ng cÃ³ kiá»ƒm soÃ¡t.

## TÃ i liá»‡u

`TTS2026_REQUIREMENTS_ANALYSIS.md`, `TEMPLATE_CATALOG.md`, `V1_REUSE_ANALYSIS.md`,
`IMPLEMENTATION_PLAN.md`, `SYSTEM_ARCHITECTURE.md`, `DATABASE_DESIGN.md`, `SITEMAP.md`,
`DATA_FLOW.md`, `SKILLS_USAGE_REPORT.md`, `TESTING_REPORT.md`, `SECURITY_CHECKLIST.md`,
`docs/architecture-diagram.html`, cÃ¹ng bá»™ tÃ i liá»‡u audit/plan/report trong `docs/`:
`SOURCE_CONTENT_AUDIT.md`, `HOMEPAGE_CONTENT_PLAN.md`, `NEWS_CONTENT_AUDIT.md`,
`CONFERENCE_ARCHIVE_PLAN.md`, `ASSET_MIGRATION_PLAN.md`, `DATABASE_UPDATE_PLAN.md`,
`UI_UX_DESIGN_PLAN.md`, `IMPLEMENTATION_REPORT.md`, `TESTING_REPORT.md`,
`ASSET_MIGRATION_REPORT.md`, `SKILLS_USAGE_REPORT.md`, `CONTENT_AUDIT_2026.md`,\n`LEGACY_CONFERENCES_AUDIT.md`, `NOVENA_DESIGN_ANALYSIS.md`, `ASSET_CATALOG.md`,\n`DATA_MIGRATION_PLAN.md`, `HOMEPAGE_LAYOUT.md`, `FINAL_IMPLEMENTATION_REPORT.md`.

## TÃ i nguyÃªn tÄ©nh

- `public/media/2026/`: KV, logo, template PPTX, thÆ° má»i, abstract, tá»‡p tin.
- `public/legacy/<year>/`: 6 ká»³ há»™i nghá»‹ 2018â€“2025 (39,6 MB), báº£o toÃ n ná»™i dung gá»‘c;
  header/footer cá»§a báº£n copy Ä‘Ã£ Ä‘Æ°á»£c trá» vá» route má»›i Ä‘á»ƒ khÃ´ng 404.
