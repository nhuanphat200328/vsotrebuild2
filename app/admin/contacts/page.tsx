import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth/access";
import { updateContactStatus } from "./actions";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/vi/dang-nhap?next=/admin/contacts");

  const access = await getUserAccess(user.id);
  if (!access.permissions.has("contact.read")) {
    return (
      <div className="rounded-xl border border-line bg-white p-6">
        <h1 className="text-xl font-extrabold text-ink-900">Không có quyền truy cập</h1>
        <p className="mt-2 text-sm text-ink-500">
          Tài khoản của bạn không có quyền xem yêu cầu liên hệ.
        </p>
      </div>
    );
  }

  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const q = (typeof sp.q === "string" ? sp.q : "").replace(/[%_\\"(),.]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("contact_requests")
    .select("id, full_name, email, phone, organization, subject, message, status, locale, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) query = query.eq("status", status);
  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%`);

  const { data: rows, error } = await query;
  if (error) throw new Error(error.message);

  const canUpdate = access.permissions.has("contact.update");

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Liên hệ</h1>
      <p className="mt-1 text-sm text-ink-500">
        {rows?.length ?? 0} yêu cầu (tối đa 100 gần nhất).
      </p>

      <form className="mt-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tên, email, chủ đề..."
          className="h-10 flex-1 rounded-lg border border-line px-3 text-sm"
        />
        <select name="status" defaultValue={status} className="h-10 rounded-lg border border-line px-2 text-sm">
          <option value="">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="in_progress">Đang xử lý</option>
          <option value="resolved">Đã xử lý</option>
          <option value="spam">Spam</option>
        </select>
        <button className="h-10 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white">
          Lọc
        </button>
      </form>

      <div className="mt-4 grid gap-3">
        {(rows ?? []).map((row) => (
          <details key={row.id} className="rounded-xl border border-line bg-white p-4">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center gap-2">
                <Mail className="size-4 text-brand-500" aria-hidden />
                <span className="text-sm font-bold text-ink-900">{row.full_name}</span>
                <span className="text-xs text-ink-500">{row.email}</span>
                <span className="ml-auto rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                  {row.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-500">
                {row.subject || "(không chủ đề)"} ·{" "}
                {new Date(row.created_at).toLocaleString("vi-VN")}
              </p>
            </summary>

            <div className="mt-3 border-t border-line pt-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                {row.message}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-500">
                {row.phone ? <span>Điện thoại: {row.phone}</span> : null}
                {row.organization ? <span>Đơn vị: {row.organization}</span> : null}
                <span>Ngôn ngữ: {row.locale}</span>
              </div>

              {canUpdate ? (
                <form action={updateContactStatus} className="mt-4 grid gap-2 sm:grid-cols-[180px_1fr_auto]">
                  <input type="hidden" name="id" value={row.id} />
                  <select
                    name="status"
                    defaultValue={row.status}
                    className="h-10 rounded-lg border border-line px-2 text-sm"
                  >
                    <option value="new">Mới</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="resolved">Đã xử lý</option>
                    <option value="spam">Spam</option>
                  </select>
                  <input
                    name="note"
                    placeholder="Ghi chú xử lý (tùy chọn)"
                    maxLength={2000}
                    className="h-10 rounded-lg border border-line px-3 text-sm"
                  />
                  <button className="h-10 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white">
                    Cập nhật
                  </button>
                </form>
              ) : null}
            </div>
          </details>
        ))}
        {(rows ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white p-8 text-sm text-ink-500">
            Chưa có yêu cầu liên hệ.
          </p>
        ) : null}
      </div>

      <Link href="/admin/dashboard" className="mt-5 inline-block text-sm font-semibold text-brand-700 hover:underline">
        ← Dashboard
      </Link>
    </div>
  );
}
