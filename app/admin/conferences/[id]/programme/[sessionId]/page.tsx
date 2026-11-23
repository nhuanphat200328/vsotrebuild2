import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SessionForm } from "@/components/admin/session-form";
import { getAdminConference, getAdminProgramme, getAdminSession } from "@/lib/programme/admin";
import { requirePermission } from "@/lib/auth/require";
import {
  createPresentationAction,
  updatePresentationAction,
  updateSessionAction,
} from "../actions";

type PresentationRow = {
  id: string;
  start_time: string | null;
  end_time: string | null;
  presentation_type: string | null;
  status: string;
  presentation_translations: { locale: string; title: string | null }[];
};

export default async function EditSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; sessionId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id, sessionId } = await params;
  await requirePermission("programme.read", `/admin/conferences/${id}/programme/${sessionId}`);
  const conference = await getAdminConference(id);
  if (!conference) notFound();
  const [session, data] = await Promise.all([getAdminSession(sessionId), getAdminProgramme(id)]);
  if (!session) notFound();

  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const saved = sp.saved === "1" || sp.created === "1";

  const presentations = ((session.presentations ?? []) as unknown as PresentationRow[]).sort(
    (a, b) => (a.start_time ?? "").localeCompare(b.start_time ?? ""),
  );

  return (
    <div>
      <Link
        href={`/admin/conferences/${id}/programme`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Programme Builder
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Sửa phiên</h1>
          <p className="mt-1 text-sm text-ink-500">
            {session.start_time.slice(0, 5)}–{session.end_time.slice(0, 5)} · {presentations.length} báo cáo
          </p>
        </div>
        <Link
          href={`/vi/hoi-nghi/${conference.slug}/phien/${sessionId}`}
          className="rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-bold text-ink-700 hover:bg-surface"
        >
          Xem public
        </Link>
      </div>

      {saved ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
          Đã lưu.
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error === "conflict"
            ? "Trùng phòng/thời gian với phiên khác."
            : error === "time"
              ? "Giờ kết thúc phải sau giờ bắt đầu."
              : error === "publish"
                ? "Bạn không có quyền publish."
                : error === "presentation"
                  ? "Dữ liệu báo cáo không hợp lệ."
                  : "Lỗi server."}
        </p>
      ) : null}

      <div className="mt-4">
        <SessionForm
          conferenceId={id}
          dates={data.dates}
          rooms={data.rooms}
          types={data.types}
          session={session}
          action={updateSessionAction}
          submitLabel="Lưu phiên"
        />
      </div>

      <section className="mt-7">
        <h2 className="text-lg font-extrabold text-ink-900">Báo cáo</h2>
        <div className="mt-3 grid gap-3">
          {presentations.map((presentation) => {
            const vi = presentation.presentation_translations.find((t) => t.locale === "vi");
            const en = presentation.presentation_translations.find((t) => t.locale === "en");
            return (
              <form
                key={presentation.id}
                action={updatePresentationAction}
                className="grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-[90px_90px_1fr_1fr_120px_auto]"
              >
                <input type="hidden" name="session_id" value={sessionId} />
                <input type="hidden" name="conference_id" value={id} />
                <input type="hidden" name="presentation_id" value={presentation.id} />
                <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
                  Bắt đầu
                  <input
                    type="time"
                    name="start_time"
                    defaultValue={presentation.start_time?.slice(0, 5) ?? ""}
                    className="h-9 rounded border border-line px-2 text-xs font-normal"
                  />
                </label>
                <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
                  Kết thúc
                  <input
                    type="time"
                    name="end_time"
                    defaultValue={presentation.end_time?.slice(0, 5) ?? ""}
                    className="h-9 rounded border border-line px-2 text-xs font-normal"
                  />
                </label>
                <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
                  Tiêu đề VI *
                  <input
                    name="title_vi"
                    defaultValue={vi?.title ?? ""}
                    required
                    className="h-9 rounded border border-line px-2 text-xs font-normal"
                  />
                </label>
                <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
                  Tiêu đề EN
                  <input
                    name="title_en"
                    defaultValue={en?.title ?? ""}
                    className="h-9 rounded border border-line px-2 text-xs font-normal"
                  />
                </label>
                <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
                  Trạng thái
                  <select
                    name="status"
                    defaultValue={presentation.status}
                    className="h-9 rounded border border-line px-2 text-xs font-normal"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <button className="mt-4 h-9 rounded bg-brand-600 px-3 text-xs font-bold text-white">
                  Lưu
                </button>
              </form>
            );
          })}
        </div>

        <form action={createPresentationAction} className="mt-4 grid gap-3 rounded-xl border border-dashed border-line bg-white p-4 sm:grid-cols-[90px_90px_1fr_1fr_120px_auto]">
          <input type="hidden" name="session_id" value={sessionId} />
          <input type="hidden" name="conference_id" value={id} />
          <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
            Bắt đầu
            <input type="time" name="start_time" className="h-9 rounded border border-line px-2 text-xs font-normal" />
          </label>
          <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
            Kết thúc
            <input type="time" name="end_time" className="h-9 rounded border border-line px-2 text-xs font-normal" />
          </label>
          <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
            Tiêu đề VI *
            <input name="title_vi" required className="h-9 rounded border border-line px-2 text-xs font-normal" />
          </label>
          <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
            Tiêu đề EN
            <input name="title_en" className="h-9 rounded border border-line px-2 text-xs font-normal" />
          </label>
          <label className="grid gap-1 text-[10px] font-bold uppercase text-ink-500">
            Trạng thái
            <select name="status" defaultValue="draft" className="h-9 rounded border border-line px-2 text-xs font-normal">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <button className="mt-4 h-9 rounded bg-ink-900 px-3 text-xs font-bold text-white">Thêm</button>
        </form>
      </section>
    </div>
  );
}
