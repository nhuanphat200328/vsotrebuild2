import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { getAdminConference, getAdminProgramme } from "@/lib/programme/admin";
import { requirePermission } from "@/lib/auth/require";

function titleOf(
  translations: { locale: string; title: string | null }[],
  locale = "vi",
) {
  return translations.find((t) => t.locale === locale)?.title ?? "Chưa có tiêu đề";
}

export default async function AdminProgrammePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const { access } = await requirePermission("programme.read", `/admin/conferences/${id}/programme`);
  const conference = await getAdminConference(id);
  if (!conference) notFound();
  const sp = await searchParams;
  const date = typeof sp.date === "string" ? sp.date : "";
  const data = await getAdminProgramme(id, date || undefined);

  return (
    <div>
      <Link href="/admin/conferences" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Hội nghị
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Programme Builder — VSOT {conference.year}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {data.sessions.length} phiên. Chỉnh sửa giờ/phòng/nội dung; hệ thống chặn xung đột phòng.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/vi/hoi-nghi/${conference.slug}/chuong-trinh`}
            className="rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-bold text-ink-700 hover:bg-surface"
          >
            Xem public
          </Link>
          {access.permissions.has("programme.write") ? (
            <Link
              href={`/admin/conferences/${id}/programme/new`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-700"
            >
              <Plus className="size-4" aria-hidden />
              Thêm phiên
            </Link>
          ) : null}
        </div>
      </div>

      <form className="mt-4 flex flex-wrap gap-2">
        <select
          name="date"
          defaultValue={date}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
        >
          <option value="">Tất cả ngày</option>
          {data.dates.map((d) => (
            <option key={d.id} value={d.date}>
              {d.label_vi ?? d.date}
            </option>
          ))}
        </select>
        <button className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-bold text-ink-700">
          Lọc
        </button>
      </form>

      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <div className="hidden grid-cols-[120px_1fr_180px_100px_60px] gap-3 border-b border-line bg-surface px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-ink-500 md:grid">
          <span>Thời gian</span>
          <span>Phiên</span>
          <span>Phòng</span>
          <span>Trạng thái</span>
          <span />
        </div>
        <ul className="divide-y divide-line">
          {data.sessions.map((session) => (
            <li key={session.id} className="grid gap-2 px-4 py-3 md:grid-cols-[120px_1fr_180px_100px_60px] md:items-center md:gap-3">
              <div className="text-xs font-bold text-brand-800">
                {session.start_time.slice(0, 5)}–{session.end_time.slice(0, 5)}
                <span className="mt-0.5 block text-[11px] font-normal text-ink-500">
                  {session.conference_dates?.label_vi ?? ""}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900">
                  {titleOf(session.session_translations)}
                </p>
                <p className="text-[11px] text-ink-500">
                  {session.session_types?.name_vi ?? ""} · {session.presentations.length} báo cáo
                  {session.program_number ? ` · ${session.program_number}` : ""}
                </p>
              </div>
              <p className="text-xs text-ink-700">{session.rooms?.name_vi ?? "Chưa gán phòng"}</p>
              <span className="w-fit rounded-full bg-surface px-2 py-1 text-[10px] font-bold text-ink-500">
                {session.status}
              </span>
              <Link
                href={`/admin/conferences/${id}/programme/${session.id}`}
                className="w-fit rounded-md border border-line px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
              >
                Sửa
              </Link>
            </li>
          ))}
        </ul>
        {data.sessions.length === 0 ? (
          <p className="p-8 text-sm text-ink-500">Không có phiên phù hợp.</p>
        ) : null}
      </div>
    </div>
  );
}
