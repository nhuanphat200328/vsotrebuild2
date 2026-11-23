import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SessionForm } from "@/components/admin/session-form";
import { getAdminConference, getAdminProgramme } from "@/lib/programme/admin";
import { requirePermission } from "@/lib/auth/require";
import { createSessionAction } from "../actions";

export default async function NewSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const { access } = await requirePermission("programme.write", `/admin/conferences/${id}/programme/new`);
  if (!access.permissions.has("programme.write")) redirect(`/admin/conferences/${id}/programme`);
  const conference = await getAdminConference(id);
  if (!conference) notFound();
  const data = await getAdminProgramme(id);
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div>
      <Link
        href={`/admin/conferences/${id}/programme`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Programme Builder
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">Thêm phiên</h1>
      <p className="mt-1 text-sm text-ink-500">
        Phiên mới mặc định Draft. Kiểm tra xung đột phòng trước khi lưu.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error === "conflict"
            ? "Trùng phòng/thời gian với phiên khác."
            : error === "time"
              ? "Giờ kết thúc phải sau giờ bắt đầu."
              : error === "publish"
                ? "Bạn không có quyền publish."
                : "Dữ liệu không hợp lệ hoặc lỗi server."}
        </p>
      ) : null}

      <div className="mt-4">
        <SessionForm
          conferenceId={id}
          dates={data.dates}
          rooms={data.rooms}
          types={data.types}
          action={createSessionAction}
          submitLabel="Tạo phiên"
        />
      </div>
    </div>
  );
}
