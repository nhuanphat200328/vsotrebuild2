import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminPages } from "@/lib/pages/data";
import { requirePermission } from "@/lib/auth/require";

export default async function AdminPagesPage() {
  const { access } = await requirePermission("page.read", "/admin/pages");
  const pages = await getAdminPages();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Trang nội dung</h1>
          <p className="mt-1 text-sm text-ink-500">Quản lý trang tĩnh, song ngữ và SEO.</p>
        </div>
        {access.permissions.has("page.write") ? (
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-700"
          >
            <Plus className="size-4" aria-hidden />
            Thêm trang
          </Link>
        ) : null}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <ul className="divide-y divide-line">
          {pages.map((page) => {
            const vi = page.page_translations.find((t) => t.locale === "vi");
            const en = page.page_translations.find((t) => t.locale === "en");
            return (
              <li key={page.id} className="grid gap-2 p-4 md:grid-cols-[1fr_130px_130px_80px] md:items-center">
                <div className="min-w-0">
                  <Link href={`/admin/pages/${page.id}`} className="truncate text-sm font-bold text-ink-900 hover:text-brand-700">
                    {vi?.title ?? "(chưa có tiêu đề)"}
                  </Link>
                  <p className="text-[11px] text-ink-500">/{page.slug}</p>
                </div>
                <span className="w-fit rounded-full bg-surface px-2 py-1 text-[10px] font-bold text-ink-500">
                  {page.status}
                </span>
                <span className="text-[11px] text-ink-500">
                  VI: {vi?.status ?? "missing"} · EN: {en?.status ?? "missing"}
                </span>
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="w-fit rounded-md border border-line px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                >
                  Sửa
                </Link>
              </li>
            );
          })}
        </ul>
        {pages.length === 0 ? <p className="p-8 text-sm text-ink-500">Chưa có trang.</p> : null}
      </div>
    </div>
  );
}
