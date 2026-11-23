import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";
import { assignRoleAction, createUserAction, toggleUserAction } from "./actions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { user: currentUser, access } = await requirePermission("user.read", "/admin/users");
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const admin = createSupabaseAdminClient();

  const [{ data: auth }, { data: profiles }, { data: roles }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("profiles").select("id, email, full_name, status"),
    admin
      .from("user_roles")
      .select("user_id, roles(code)"),
  ]);
  const allRoles = await admin.from("roles").select("code, name_vi").order("code");
  const roleByUser = new Map<string, string>();
  for (const row of roles ?? []) {
    const code = (row.roles as unknown as { code: string } | null)?.code;
    if (code) roleByUser.set(row.user_id, code);
  }
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Người dùng</h1>
      <p className="mt-1 text-sm text-ink-500">Tài khoản nội bộ, không có đăng ký công khai.</p>
      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error === "super" ? "Không thể sửa Super Admin." : error === "self" ? "Không thể tự khóa mình." : "Thao tác thất bại."}
        </p>
      ) : null}

      {access.permissions.has("user.invite") ? (
        <form action={createUserAction} className="mt-4 grid gap-2 rounded-xl border border-line bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_150px_auto]">
          <input type="email" name="email" required placeholder="Email" className="h-10 rounded-lg border border-line px-3 text-sm" />
          <input name="full_name" required placeholder="Họ tên" className="h-10 rounded-lg border border-line px-3 text-sm" />
          <input type="password" name="password" required minLength={12} placeholder="Mật khẩu tạm (>=12)" className="h-10 rounded-lg border border-line px-3 text-sm" />
          <select name="role" className="h-10 rounded-lg border border-line px-2 text-sm">
            {(allRoles.data ?? []).filter((r) => r.code !== "super_admin").map((role) => (
              <option key={role.code} value={role.code}>{role.name_vi ?? role.code}</option>
            ))}
          </select>
          <button className="h-10 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white">Tạo</button>
        </form>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white">
        <ul className="divide-y divide-line">
          {(auth?.users ?? []).map((user) => {
            const profile = profileById.get(user.id);
            const role = roleByUser.get(user.id) ?? "—";
            return (
              <li key={user.id} className="grid gap-2 p-4 lg:grid-cols-[1fr_120px_auto_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900">{profile?.full_name || user.email}</p>
                  <p className="text-[11px] text-ink-500">{user.email} · {profile?.status ?? "active"}</p>
                </div>
                <span className="w-fit rounded-full bg-surface px-2 py-1 text-[10px] font-bold text-ink-500">{role}</span>
                {access.permissions.has("user.role.update") && role !== "super_admin" ? (
                  <form action={assignRoleAction} className="flex gap-1">
                    <input type="hidden" name="user_id" value={user.id} />
                    <select name="role" defaultValue={role} className="h-9 rounded border border-line px-2 text-xs">
                      {(allRoles.data ?? []).filter((r) => r.code !== "super_admin").map((r) => (
                        <option key={r.code} value={r.code}>{r.name_vi ?? r.code}</option>
                      ))}
                    </select>
                    <button className="h-9 rounded bg-brand-600 px-2 text-xs font-bold text-white">Lưu</button>
                  </form>
                ) : <span />}
                {access.permissions.has("user.disable") && role !== "super_admin" && user.id !== currentUser.id ? (
                  <form action={toggleUserAction}>
                    <input type="hidden" name="user_id" value={user.id} />
                    <input type="hidden" name="disable" value={profile?.status === "disabled" ? "0" : "1"} />
                    <button className="h-9 rounded border border-line px-3 text-xs font-bold text-ink-700">
                      {profile?.status === "disabled" ? "Mở khóa" : "Khóa"}
                    </button>
                  </form>
                ) : <span />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
