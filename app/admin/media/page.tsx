import Image from "next/image";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMediaAction, uploadMediaAction } from "./actions";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { access } = await requirePermission("media.read", "/admin/media");
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const admin = createSupabaseAdminClient();
  const { data, error: queryError } = await admin
    .from("media")
    .select("id, bucket, path, file_name, mime_type, size_bytes, alt_vi, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (queryError) throw new Error(queryError.message);

  const rows = (data ?? []).map((item) => ({
    ...item,
    url: admin.storage.from(item.bucket).getPublicUrl(item.path).data.publicUrl,
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Media</h1>
      <p className="mt-1 text-sm text-ink-500">Ảnh và PDF dùng cho nội dung website.</p>
      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error === "size"
            ? "File vượt quá 5 MB."
            : error === "type"
              ? "Định dạng không được hỗ trợ."
              : error === "in_use"
                ? "Không thể xóa: media đang được sử dụng."
                : "Tải lên thất bại."}
        </p>
      ) : null}

      {access.permissions.has("media.upload") ? (
        <form action={uploadMediaAction} className="mt-4 grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input type="file" name="file" required accept="image/*,application/pdf" className="text-sm" />
          <input name="alt_vi" placeholder="Alt VI" className="h-10 rounded-lg border border-line px-3 text-sm" />
          <input name="alt_en" placeholder="Alt EN" className="h-10 rounded-lg border border-line px-3 text-sm" />
          <button className="h-10 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white">Tải lên</button>
        </form>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((item) => (
          <div key={item.id} className="rounded-xl border border-line bg-white p-3">
            {item.mime_type?.startsWith("image/") ? (
              <Image src={item.url} alt={item.alt_vi ?? ""} width={480} height={240} unoptimized className="h-36 w-full rounded-lg object-cover" />
            ) : (
              <div className="grid h-36 place-items-center rounded-lg bg-surface text-xs font-bold text-ink-500">PDF</div>
            )}
            <p className="mt-2 truncate text-xs font-bold text-ink-900">{item.file_name}</p>
            <p className="text-[11px] text-ink-500">{formatSize(item.size_bytes)} · {item.mime_type}</p>
            {access.permissions.has("media.delete") ? (
              <form action={deleteMediaAction} className="mt-2">
                <input type="hidden" name="id" value={item.id} />
                <DeleteButton label="Xóa" />
              </form>
            ) : null}
          </div>
        ))}
      </div>
      {rows.length === 0 ? <p className="mt-6 text-sm text-ink-500">Chưa có media.</p> : null}
    </div>
  );
}
