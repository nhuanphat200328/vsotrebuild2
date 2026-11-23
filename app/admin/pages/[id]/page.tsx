import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageForm } from "@/components/admin/page-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminPage } from "@/lib/pages/data";
import { requirePermission } from "@/lib/auth/require";
import { deletePageAction, updatePageAction } from "../actions";

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const { access } = await requirePermission("page.read", `/admin/pages/${id}`);
  const page = await getAdminPage(id);
  if (!page) notFound();
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const saved = sp.saved === "1" || sp.created === "1";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/pages" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          Trang nội dung
        </Link>
        <div className="flex gap-2">
          {page.status === "published" ? (
            <Link
              href={`/vi/${page.slug}`}
              className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-ink-700 hover:bg-surface"
            >
              Xem public
            </Link>
          ) : null}
          {access.permissions.has("page.delete") ? (
            <form action={deletePageAction}>
              <input type="hidden" name="id" value={page.id} />
              <DeleteButton />
            </form>
          ) : null}
        </div>
      </div>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">Sửa trang</h1>
      <p className="mt-1 text-sm text-ink-500">/{page.slug}</p>

      {saved ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
          Đã lưu.
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error === "publish"
            ? "Bạn không có quyền publish."
            : error === "slug"
              ? "Slug đã tồn tại hoặc không hợp lệ."
              : "Dữ liệu không hợp lệ hoặc lỗi server."}
        </p>
      ) : null}

      <div className="mt-4">
        <PageForm page={page} action={updatePageAction} submitLabel="Lưu trang" />
      </div>
    </div>
  );
}
