import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/news-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminNewsItem, getNewsCategories } from "@/lib/news/data";
import { requirePermission } from "@/lib/auth/require";
import { deleteNewsAction, updateNewsAction } from "../actions";

export default async function EditNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const { access } = await requirePermission("news.read", `/admin/news/${id}`);
  const [news, categories] = await Promise.all([getAdminNewsItem(id), getNewsCategories()]);
  if (!news) notFound();
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const saved = sp.saved === "1" || sp.created === "1";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          <ArrowLeft className="size-4" aria-hidden /> Tin tức
        </Link>
        {access.permissions.has("news.delete") ? (
          <form action={deleteNewsAction}>
            <input type="hidden" name="id" value={news.id} />
            <DeleteButton label="Xóa bài" />
          </form>
        ) : null}
      </div>
      <h1 className="mt-3 text-2xl font-extrabold text-ink-900">Sửa bài viết</h1>
      <p className="mt-1 text-sm text-ink-500">/{news.slug}</p>
      {saved ? <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">Đã lưu.</p> : null}
      {error ? <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">Dữ liệu không hợp lệ, slug trùng hoặc thiếu quyền publish.</p> : null}
      <div className="mt-4">
        <NewsForm news={news} categories={categories} action={updateNewsAction} submitLabel="Lưu bài" />
      </div>
    </div>
  );
}
