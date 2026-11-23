# VSOT Demo Ver 2

Website HÃ¡Â»â„¢i GhÃƒÂ©p tÃ¡ÂºÂ¡ng ViÃ¡Â»â€¡t Nam (VSOT) Ã¢â‚¬â€ bÃ¡ÂºÂ£n dÃ¡Â»Â±ng lÃ¡ÂºÂ¡i Ã„â€˜Ã¡Â»â„¢c lÃ¡ÂºÂ­p trong workspace
`demo ver2`, tham chiÃ¡ÂºÂ¿u tÃƒÂ i liÃ¡Â»â€¡u TTS 2026 vÃƒÂ  kinh nghiÃ¡Â»â€¡m tÃ¡Â»Â« VSOT v1.

- Stack: Next.js 16 (App Router) Ã‚Â· React 19 Ã‚Â· TypeScript strict Ã‚Â· Tailwind CSS 4 Ã‚Â· Supabase (Postgres, Auth, Storage)
- DÃ¡Â»Â¯ liÃ¡Â»â€¡u thÃ¡ÂºÂ­t: hÃ¡Â»â„¢i nghÃ¡Â»â€¹ VSOT 2026 (5 ngÃƒÂ y, 6 hÃ¡Â»â„¢i trÃ†Â°Ã¡Â»Âng, 65 phiÃƒÂªn, 255 bÃƒÂ¡o cÃƒÂ¡o, 245 ngÃ†Â°Ã¡Â»Âi)
- NgÃƒÂ´n ngÃ¡Â»Â¯: tiÃ¡ÂºÂ¿ng ViÃ¡Â»â€¡t mÃ¡ÂºÂ·c Ã„â€˜Ã¡Â»â€¹nh, tiÃ¡ÂºÂ¿ng Anh cÃƒÂ³ fallback tiÃ¡ÂºÂ¿ng ViÃ¡Â»â€¡t
- Repo Ã„â€˜ÃƒÂ­ch: `nhuanphat200328/vsotrebuild2`
- Supabase project ref: `yrvhrsztcxfhlxsxbzhv` (khÃƒÂ´ng ghi key trong repo)

## YÃƒÂªu cÃ¡ÂºÂ§u

- Node.js >= 20.9 (Ã„â€˜ÃƒÂ£ kiÃ¡Â»Æ’m vÃ¡Â»â€ºi 24.17.0)
- npm 11+
- Python 3.12 + `psycopg[binary]` (chÃ¡Â»â€° cho migration/import)

## CÃƒÂ i Ã„â€˜Ã¡ÂºÂ·t

```powershell
npm install
```

TÃ¡ÂºÂ¡o `.env.local` tÃ¡Â»Â« `.env.example` vÃƒÂ  Ã„â€˜iÃ¡Â»Ân:

| BiÃ¡ÂºÂ¿n | PhÃ¡ÂºÂ¡m vi | Ghi chÃƒÂº |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | anon/publishable key, RLS bÃ¡ÂºÂ¯t buÃ¡Â»â„¢c |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client | tÃƒÂ¹y chÃ¡Â»Ân, tÃ†Â°Ã†Â¡ng Ã„â€˜Ã†Â°Ã†Â¡ng anon |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | khÃƒÂ´ng bao giÃ¡Â»Â dÃƒÂ¹ng Ã¡Â»Å¸ client |
| `DIRECT_URL` | server only | Postgres non-pooling cho migration |
| `NEXT_PUBLIC_SITE_URL` | build/runtime | canonical, sitemap, Open Graph |

KhÃƒÂ´ng commit `.env.local`, khÃƒÂ´ng Ã„â€˜Ã†Â°a key vÃƒÂ o tÃƒÂ i liÃ¡Â»â€¡u, log hoÃ¡ÂºÂ·c frontend bundle.

## ChÃ¡ÂºÂ¡y local

```powershell
npm run dev
```

MÃ¡Â»Å¸ http://localhost:3000 Ã¢â‚¬â€ tÃ¡Â»Â± chuyÃ¡Â»Æ’n tÃ¡Â»â€ºi `/vi`.

## KiÃ¡Â»Æ’m tra

```powershell
npm run typecheck
npm run lint
npm run build
npm run start -- -p 3100
```

## Database

- Migrations: `supabase/migrations/0001..0017`, Ã„â€˜ÃƒÂ£ ÃƒÂ¡p dÃ¡Â»Â¥ng vÃƒÂ o project mÃ¡Â»â€ºi.
- ÃƒÂp dÃ¡Â»Â¥ng lÃ¡ÂºÂ¡i (idempotent, cÃƒÂ³ dry-run mÃ¡ÂºÂ·c Ã„â€˜Ã¡Â»â€¹nh):

```powershell
python scripts\apply_migrations.py          # dry-run + rollback
python scripts\apply_migrations.py --apply  # ghi thÃ¡ÂºÂ­t
```

- Import dÃ¡Â»Â¯ liÃ¡Â»â€¡u 2026 (idempotent theo `legacy_sid`/`legacy_pid`):

```powershell
python -u scripts\import_2026.py
```

NguÃ¡Â»â€œn: `supabase/seed/2026/programme.json` (dÃ¡Â»Â¯ liÃ¡Â»â€¡u chÃ†Â°Ã†Â¡ng trÃƒÂ¬nh thÃ¡ÂºÂ­t cÃ¡Â»Â§a VSOT 2026).
Import ghi Ã„â€˜ÃƒÂ¨ giÃ¡Â»Â/phÃƒÂ²ng/tiÃƒÂªu Ã„â€˜Ã¡Â»Â nÃ¡ÂºÂ¿u chÃ¡ÂºÂ¡y lÃ¡ÂºÂ¡i trÃƒÂªn DB Ã„â€˜ÃƒÂ£ chÃ¡Â»â€°nh qua CMS.

## Routes chÃƒÂ­nh

| Route | NÃ¡Â»â„¢i dung |
|---|---|
| `/` | redirect `/vi` |
| `/vi`, `/en` | Trang chÃ¡Â»Â§, sÃ¡Â»â€˜ liÃ¡Â»â€¡u thÃ¡ÂºÂ­t tÃ¡Â»Â« DB |
| `/[locale]/hoi-nghi` | Danh sÃƒÂ¡ch hÃ¡Â»â„¢i nghÃ¡Â»â€¹ Ã„â€˜ÃƒÂ£ publish |
| `/[locale]/hoi-nghi/2026` | Landing hÃ¡Â»â„¢i nghÃ¡Â»â€¹ + JSON-LD Event |
| `.../chuong-trinh?date=&view=list|grid|table&q=&room=&type=` | Programme List/Grid/Table + tÃƒÂ¬m kiÃ¡ÂºÂ¿m/lÃ¡Â»Âc inline |
| `.../chuong-trinh/tong-quan` | TÃ¡Â»â€¢ng quan phÃƒÂ²ng Ãƒâ€” giÃ¡Â»Â |
| `.../phien/[id]` | Chi tiÃ¡ÂºÂ¿t phiÃƒÂªn, canonical/share |
| `.../dien-gia?q=&role=` | Directory diÃ¡Â»â€¦n giÃ¡ÂºÂ£ (C/D/P), lÃ¡Â»Âc client-side |
| `.../dien-gia/[slug]` | HÃ¡Â»â€œ sÃ†Â¡ diÃ¡Â»â€¦n giÃ¡ÂºÂ£ + cÃƒÂ¡c phÃƒÂ¢n cÃƒÂ´ng theo ngÃƒÂ y |
| `/[locale]/tin-tuc`, `/[slug]` | Tin tÃ¡Â»Â©c tÃ¡Â»Â« CMS + tÃ¡Â»â€¡p Ã„â€˜ÃƒÂ­nh kÃƒÂ¨m |
| `/[locale]/hoi-nghi/cac-nam-truoc` | Kho lÃ†Â°u trÃ¡Â»Â¯ hÃ¡Â»â„¢i nghÃ¡Â»â€¹ 2018Ã¢â‚¬â€œ2025 |
| `/legacy/<year>/...` | Website hÃ¡Â»â„¢i nghÃ¡Â»â€¹ cÃƒÂ¡c nÃ„Æ’m (bÃ¡ÂºÂ£n bÃ¡ÂºÂ£o toÃƒÂ n, link Ã„â€˜ÃƒÂ£ trÃ¡Â»Â vÃ¡Â»Â site mÃ¡Â»â€ºi) |
| `/[locale]/lien-he` | Form liÃƒÂªn hÃ¡Â»â€¡ lÃ†Â°u DB, honeypot + rate limit |
| `/admin/**` | CMS: dashboard, conferences/programme, pages, news, media, contacts, users |
| `/api/health` | Health check |
| `/sitemap.xml`, `/robots.txt` | SEO |

Admin yÃƒÂªu cÃ¡ÂºÂ§u Ã„â€˜Ã„Æ’ng nhÃ¡ÂºÂ­p Supabase vÃƒÂ  quyÃ¡Â»Ân RBAC; kiÃ¡Â»Æ’m quyÃ¡Â»Ân Ã¡Â»Å¸ page + server action.

## Deploy Vercel (khi Ã„â€˜Ã†Â°Ã¡Â»Â£c duyÃ¡Â»â€¡t)

1. Import repo `nhuanphat200328/vsotrebuild2`.
2. Framework preset: Next.js. Build: `npm run build`.
3. ThÃƒÂªm Environment Variables cho Preview/Production (khÃƒÂ´ng dÃƒÂ¹ng chung service key vÃ¡Â»â€ºi local).
4. Ã„ÂÃ¡ÂºÂ·t `NEXT_PUBLIC_SITE_URL` = URL Preview tÃ†Â°Ã†Â¡ng Ã¡Â»Â©ng.
5. KhÃƒÂ´ng chÃ¡ÂºÂ¡y migration tÃ¡Â»Â± Ã„â€˜Ã¡Â»â„¢ng tÃ¡Â»Â« Vercel; ÃƒÂ¡p dÃ¡Â»Â¥ng thÃ¡Â»Â§ cÃƒÂ´ng cÃƒÂ³ kiÃ¡Â»Æ’m soÃƒÂ¡t.

## TÃƒÂ i liÃ¡Â»â€¡u

`TTS2026_REQUIREMENTS_ANALYSIS.md`, `TEMPLATE_CATALOG.md`, `V1_REUSE_ANALYSIS.md`,
`IMPLEMENTATION_PLAN.md`, `SYSTEM_ARCHITECTURE.md`, `DATABASE_DESIGN.md`, `SITEMAP.md`,
`DATA_FLOW.md`, `SKILLS_USAGE_REPORT.md`, `TESTING_REPORT.md`, `SECURITY_CHECKLIST.md`,
`docs/architecture-diagram.html`, cÃƒÂ¹ng bÃ¡Â»â„¢ tÃƒÂ i liÃ¡Â»â€¡u audit/plan/report trong `docs/`:
`SOURCE_CONTENT_AUDIT.md`, `HOMEPAGE_CONTENT_PLAN.md`, `NEWS_CONTENT_AUDIT.md`,
`CONFERENCE_ARCHIVE_PLAN.md`, `ASSET_MIGRATION_PLAN.md`, `DATABASE_UPDATE_PLAN.md`,
`UI_UX_DESIGN_PLAN.md`, `IMPLEMENTATION_REPORT.md`, `TESTING_REPORT.md`,
`ASSET_MIGRATION_REPORT.md`, `SKILLS_USAGE_REPORT.md`, `CONTENT_AUDIT_2026.md`,\n`LEGACY_CONFERENCES_AUDIT.md`, `NOVENA_DESIGN_ANALYSIS.md`, `ASSET_CATALOG.md`,\n`DATA_MIGRATION_PLAN.md`, `HOMEPAGE_LAYOUT.md`, `FINAL_IMPLEMENTATION_REPORT.md`, `ABSTRACT_MAPPING_REPORT.md`, `UI_REFINEMENT_AUDIT.md`,\n`GLOBAL_HEADER_FOOTER_AUDIT.md`, `DESIGN_SYSTEM_REVIEW.md`, `UI_REFINEMENT_REPORT.md`,\n`NEWS_MIGRATION_REPORT.md`, `HEADER_FOOTER_CONSISTENCY_REPORT.md`, `INTERACTION_TEST_REPORT.md`.

## TÃƒÂ i nguyÃƒÂªn tÃ„Â©nh

- `public/media/2026/`: KV, logo, template PPTX, thÃ†Â° mÃ¡Â»Âi, abstract, tÃ¡Â»â€¡p tin.
- `public/legacy/<year>/`: 6 kÃ¡Â»Â³ hÃ¡Â»â„¢i nghÃ¡Â»â€¹ 2018Ã¢â‚¬â€œ2025 (39,6 MB), bÃ¡ÂºÂ£o toÃƒÂ n nÃ¡Â»â„¢i dung gÃ¡Â»â€˜c;
  header/footer cÃ¡Â»Â§a bÃ¡ÂºÂ£n copy Ã„â€˜ÃƒÂ£ Ã„â€˜Ã†Â°Ã¡Â»Â£c trÃ¡Â»Â vÃ¡Â»Â route mÃ¡Â»â€ºi Ã„â€˜Ã¡Â»Æ’ khÃƒÂ´ng 404.
