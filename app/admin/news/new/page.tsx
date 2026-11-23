import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/news-form";
import { getNewsCategories } from "@/lib/news/data";
import { createNewsAction } from "../actions";

export default async function NewNewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const categories = await getNewsCategories();
  return (
    <div>
      <Link href="/admin/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        <ArrowLeft className="size-4" aria-hidden /> Tin tức
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold text-ink-900">Thêm bài viết</h1>
      {error ? <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">Dữ liệu không hợp lệ, slug trùng hoặc thiếu quyền publish.</p> : null}
      <div className="mt-4">
        <NewsForm categories={categories} action={createNewsAction} submitLabel="Tạo bài" />
      </div>
    </div>
  );
}
