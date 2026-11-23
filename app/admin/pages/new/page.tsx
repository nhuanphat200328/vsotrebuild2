import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageForm } from "@/components/admin/page-form";
import { createPageAction } from "../actions";

export default async function NewPagePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div>
      <Link href="/admin/pages" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Trang nội dung
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">Thêm trang</h1>
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
        <PageForm action={createPageAction} submitLabel="Tạo trang" />
      </div>
    </div>
  );
}
