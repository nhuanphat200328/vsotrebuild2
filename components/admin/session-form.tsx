import Link from "next/link";

type SessionData = {
  id?: string;
  date_id?: string;
  room_id?: string | null;
  session_type_id?: string | null;
  start_time?: string;
  end_time?: string;
  program_number?: string | null;
  status?: string;
  session_translations?: { locale: string; title: string | null; short_title: string | null }[];
};

export function SessionForm({
  conferenceId,
  dates,
  rooms,
  types,
  session,
  action,
  submitLabel,
}: {
  conferenceId: string;
  dates: { id: string; date: string; label_vi: string | null }[];
  rooms: { id: string; name_vi: string }[];
  types: { id: string; code: string; name_vi: string | null }[];
  session?: SessionData;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  const vi = session?.session_translations?.find((t) => t.locale === "vi");
  const en = session?.session_translations?.find((t) => t.locale === "en");
  const start = session?.start_time?.slice(0, 5) ?? "08:00";
  const end = session?.end_time?.slice(0, 5) ?? "09:00";

  return (
    <form action={action} className="grid gap-4 rounded-xl border border-line bg-white p-5">
      <input type="hidden" name="conference_id" value={conferenceId} />
      {session?.id ? <input type="hidden" name="session_id" value={session.id} /> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Ngày
          <select
            name="date_id"
            defaultValue={session?.date_id ?? dates[0]?.id}
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          >
            {dates.map((date) => (
              <option key={date.id} value={date.id}>
                {date.label_vi ?? date.date}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Phòng
          <select
            name="room_id"
            defaultValue={session?.room_id ?? rooms[0]?.id}
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name_vi}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Loại phiên
          <select
            name="session_type_id"
            defaultValue={session?.session_type_id ?? types[0]?.id}
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          >
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name_vi || type.code}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Bắt đầu
          <input
            type="time"
            name="start_time"
            defaultValue={start}
            required
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Kết thúc
          <input
            type="time"
            name="end_time"
            defaultValue={end}
            required
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Số chương trình
          <input
            name="program_number"
            defaultValue={session?.program_number ?? ""}
            maxLength={50}
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Trạng thái
          <select
            name="status"
            defaultValue={session?.status ?? "draft"}
            className="h-10 rounded-lg border border-line px-2 text-sm font-normal"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <label className="grid gap-1 text-xs font-bold text-ink-700">
        Tiêu đề VI *
        <input
          name="title_vi"
          defaultValue={vi?.title ?? ""}
          required
          maxLength={500}
          className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
        />
      </label>
      <label className="grid gap-1 text-xs font-bold text-ink-700">
        Tiêu đề EN
        <input
          name="title_en"
          defaultValue={en?.title ?? ""}
          maxLength={500}
          className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Tên ngắn VI
          <input
            name="short_vi"
            defaultValue={vi?.short_title ?? ""}
            maxLength={200}
            className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
          />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink-700">
          Tên ngắn EN
          <input
            name="short_en"
            defaultValue={en?.short_title ?? ""}
            maxLength={200}
            className="h-10 rounded-lg border border-line px-3 text-sm font-normal"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="h-10 rounded-lg bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700">
          {submitLabel}
        </button>
        <Link
          href={`/admin/conferences/${conferenceId}/programme`}
          className="inline-flex h-10 items-center rounded-lg border border-line px-4 text-sm font-semibold text-ink-700 hover:bg-surface"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
