import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getNewsCategories } from "@/lib/news/data";
import { createCategoryAction } from "../actions";

export default async function NewsCategoriesPage() {
  const categories = await getNewsCategories();
  return (
    <div>
      <Link href="/admin/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        <ArrowLeft className="size-4" aria-hidden /> Tin tức
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold text-ink-900">Danh mục tin</h1>
      <form action={createCategoryAction} className="mt-4 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-4">
        <input name="name" required placeholder="Tên danh mục" className="h-10 flex-1 rounded-lg border border-line px-3 text-sm" />
        <input name="slug" placeholder="slug (tùy chọn)" className="h-10 rounded-lg border border-line px-3 text-sm" />
        <button className="h-10 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white">Thêm</button>
      </form>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between gap-3 p-4">
            <span className="text-sm font-bold text-ink-900">
              {category.news_category_translations.find((t) => t.locale === "vi")?.name ?? category.slug}
            </span>
            <span className="text-xs text-ink-500">/{category.slug} · {category.status}</span>
          </li>
        ))}
      </ul>
      {categories.length === 0 ? <p className="mt-3 text-sm text-ink-500">Chưa có danh mục.</p> : null}
    </div>
  );
}
