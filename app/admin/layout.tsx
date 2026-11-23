import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, FileText, Images, LayoutDashboard, LogOut, Mail, Newspaper, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth/access";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/vi/dang-nhap?next=/admin");

  const access = await getUserAccess(user.id);
  const roles = access.roles;

  if (roles.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface p-6">
        <div className="max-w-md rounded-xl border border-line bg-white p-8 text-center">
          <h1 className="text-xl font-extrabold text-ink-900">Không có quyền truy cập</h1>
          <p className="mt-2 text-sm text-ink-500">
            Tài khoản này chưa được gán vai trò quản trị.
          </p>
          <Link href="/vi" className="mt-5 inline-block text-sm font-bold text-brand-700 hover:underline">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-xs font-extrabold text-white">
              VSOT
            </span>
            <span className="text-sm font-extrabold text-ink-900">CMS</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span className="hidden sm:inline">{user.email}</span>
            <span className="rounded-full bg-brand-50 px-2 py-1 font-bold text-brand-700">
              {roles.join(", ")}
            </span>
            <Link href="/vi" className="font-semibold text-ink-700 hover:text-brand-700">
              Website
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-line bg-white p-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-bold text-brand-800"
          >
            <LayoutDashboard className="size-4" aria-hidden />
            Dashboard
          </Link>
          <p className="mt-4 px-3 text-[10px] font-bold uppercase tracking-widest text-ink-500">
            Quản trị
          </p>
          <ul className="mt-2 grid gap-1 px-3 pb-3 text-xs text-ink-500">
            {access.permissions.has("conference.read") ? (
              <li>
                <Link
                  href="/admin/conferences"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-ink-700 hover:bg-surface"
                >
                  <CalendarDays className="size-4" aria-hidden />
                  Hội nghị & chương trình
                </Link>
              </li>
            ) : null}
            {access.permissions.has("contact.read") ? (
              <li>
                <Link
                  href="/admin/contacts"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-ink-700 hover:bg-surface"
                >
                  <Mail className="size-4" aria-hidden />
                  Liên hệ
                </Link>
              </li>
            ) : null}
            {access.permissions.has("page.read") ? (
              <li>
                <Link
                  href="/admin/pages"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-ink-700 hover:bg-surface"
                >
                  <FileText className="size-4" aria-hidden />
                  Trang nội dung
                </Link>
              </li>
            ) : null}
            {access.permissions.has("news.read") ? (
              <li>
                <Link
                  href="/admin/news"
                  className="flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-ink-700 hover:bg-surface"
                >
                  <Newspaper className="size-4" aria-hidden />
                  Tin tức
                </Link>
              </li>
            ) : null}
            <li className="px-2 py-1">Diễn giả — sắp triển khai</li>
            {access.permissions.has("media.read") ? (
              <li>
                <Link href="/admin/media" className="flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-ink-700 hover:bg-surface">
                  <Images className="size-4" aria-hidden /> Media
                </Link>
              </li>
            ) : null}
            {access.permissions.has("user.read") ? (
              <li>
                <Link href="/admin/users" className="flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-ink-700 hover:bg-surface">
                  <Users className="size-4" aria-hidden /> Người dùng
                </Link>
              </li>
            ) : null}
          </ul>
          <form action="/api/auth/signout" method="post" className="border-t border-line p-2">
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-ink-500 hover:bg-surface">
              <LogOut className="size-4" aria-hidden />
              Đăng xuất
            </button>
          </form>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}


