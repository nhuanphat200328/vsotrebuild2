# SECURITY CHECKLIST — VSOT Demo Ver 2

- Ngày: 2026-11-23
- Phạm vi: source, config, DB mới, quy trình Git/Vercel

## 1. Secrets

- [x] Key chỉ đọc từ `key do not push to git.txt` khi tạo `.env.local`; không in giá trị.
- [x] `.env.local` nằm trong `.gitignore`; không có trong git index.
- [x] Key file bị `gitignore`; `template/` cũng bị loại khỏi repo.
- [x] `.env.example` chỉ có tên biến, không có giá trị thật.
- [x] Không hardcode key trong source, docs, HTML sơ đồ.
- [x] `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng server (`lib/supabase/admin.ts`), không prefix `NEXT_PUBLIC_`.
- [x] Client bundle không chứa service role key (rà soát `.next`).
- [ ] Rotate key nếu từng bị chia sẻ ngoài kênh an toàn (chưa có dấu hiệu; khuyến nghị trước Production).

## 2. Database / RLS

- [x] RLS bật trên toàn bộ 35 bảng public; 94 policy.
- [x] Anon không đọc draft/contact/profile/audit (kiểm bằng REST).
- [x] Public read dùng client cookie-less, tránh lộ draft qua session admin.
- [x] Migration không DROP dữ liệu; chạy dry-run trước khi apply.
- [x] Không chạy import/migration tự động từ app hoặc CI.
- [x] `contact_requests`: anon chỉ INSERT; đọc/sửa theo quyền `contact.*`.
- [ ] Kiểm lại policy sau mọi migration mới (bắt buộc trong checklist review).

## 3. Auth / RBAC

- [x] Không public signup; tài khoản tạo qua admin/invite.
- [x] Admin route chặn khi chưa đăng nhập (middleware).
- [x] Page + server action kiểm `requirePermission` (kế thừa v1).
- [x] Xoá endpoint `bootstrap-super-admin` (giảm bề mặt tấn công).
- [ ] Tạo super admin đầu tiên trên DB mới qua Supabase Dashboard (chưa thực hiện).

## 4. Application

- [x] Form liên hệ: Zod, honeypot, rate limit 5 request/10 phút/IP.
- [x] Không nối chuỗi input người dùng vào PostgREST filter (kế thừa pattern v1).
- [x] Không dùng `dangerouslySetInnerHTML` cho nội dung người dùng; JSON-LD escape `<`.
- [x] Header: nosniff, frame SAMEORIGIN, referrer, permissions, HSTS.
- [x] `/api/health` không lộ giá trị secret.
- [x] `robots.txt` chặn `/admin`, `/api`, trang đăng nhập.
- [ ] CSP nghiêm (nonce) chưa bật — Next inline runtime; ghi backlog, cần test kỹ trước khi bật.
- [ ] Rate limit phân tán chưa có; hiện dựa DB + IP header, đủ cho quy mô nhỏ.

## 5. Git / Deploy

- [x] Không commit `.env*`, key file, template.
- [x] Không force push, không rewrite history.
- [ ] Push repo `nhuanphat200328/vsotrebuild2` (thực hiện ở bước bàn giao).
- [ ] Vercel Preview: env riêng, không dùng lẫn key local; chưa thực hiện.
- [ ] Production: chưa thay đổi domain/env; chỉ sau phê duyệt.

## 6. Việc cần làm trước Production

1. Tạo super admin, xác nhận RBAC thực tế trên UI.
2. Bổ sung CSP, test không vỡ Next runtime.
3. Chạy Lighthouse/axe và kiểm trình duyệt thật.
4. Đặt `NEXT_PUBLIC_SITE_URL` = domain thật, cập nhật canonical/sitemap.
5. Rà soát toàn bộ policy RLS lần cuối; sao lưu DB.
6. Kiểm tra Supabase Auth: tắt signup nếu dashboard còn mở.
