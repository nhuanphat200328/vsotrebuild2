import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminNews, getNewsCategories } from "@/lib/news/data";
import { requirePermission } from "@/lib/auth/require";

export default async function AdminNewsPage() {
  const { access } = await requirePermission("news.read", "/admin/news");
  const [news, categories] = await Promise.all([getAdminNews(), getNewsCategories()]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Tin tức</h1>
          <p className="mt-1 text-sm text-ink-500">Bài viết song ngữ, danh mục và trạng thái xuất bản.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/news/categories" className="rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-bold text-ink-700">Danh mục</Link>
          {access.permissions.has("news.write") ? (
            <Link href="/admin/news/new" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white">
              <Plus className="size-4" aria-hidden /> Thêm bài
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <ul className="divide-y divide-line">
          {news.map((item) => {
            const vi = item.news_translations.find((t) => t.locale === "vi");
            const en = item.news_translations.find((t) => t.locale === "en");
            return (
              <li key={item.id} className="grid gap-2 p-4 md:grid-cols-[1fr_110px_140px_70px] md:items-center">
                <div className="min-w-0">
                  <Link href={`/admin/news/${item.id}`} className="truncate text-sm font-bold text-ink-900 hover:text-brand-700">{vi?.title ?? "(chưa có tiêu đề)"}</Link>
                  <p className="text-[11px] text-ink-500">/{item.slug}{item.is_featured ? " · nổi bật" : ""}</p>
                </div>
                <span className="w-fit rounded-full bg-surface px-2 py-1 text-[10px] font-bold text-ink-500">{item.status}</span>
                <span className="text-[11px] text-ink-500">VI: {vi?.status ?? "missing"} · EN: {en?.status ?? "missing"}</span>
                <Link href={`/admin/news/${item.id}`} className="text-xs font-bold text-brand-700">Sửa</Link>
              </li>
            );
          })}
        </ul>
        {news.length === 0 ? <p className="p-8 text-sm text-ink-500">Chưa có bài viết.</p> : null}
      </div>
      <p className="mt-3 text-xs text-ink-500">{categories.length} danh mục.</p>
    </div>
  );
}
