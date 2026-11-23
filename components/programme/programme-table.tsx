import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { sessionTitle, typeName, type ProgrammeSession } from "@/lib/programme/model";

export function ProgrammeTable({
  sessions,
  rooms,
  locale,
  year,
}: {
  sessions: ProgrammeSession[];
  rooms: { id: string; name_vi: string; name_en: string | null }[];
  locale: Locale;
  year: string;
}) {
  const times = [...new Set(sessions.map((session) => session.start_time))].sort();
  const cell = (time: string, roomId: string) =>
    sessions.filter((session) => session.start_time === time && session.rooms?.id === roomId);

  return (
    <div
      className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm"
      tabIndex={0}
      role="region"
      aria-label={locale === "en" ? "Room schedule" : "Lịch theo hội trường"}
    >
      <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 w-20 border-b border-r border-line bg-surface px-2 py-2.5 text-[11px] font-extrabold text-brand-800">
              {locale === "en" ? "Time" : "Giờ"}
            </th>
            {rooms.map((room) => (
              <th
                key={room.id}
                className="sticky top-0 z-10 w-44 border-b border-r border-line bg-surface px-2 py-2.5 text-[11px] font-extrabold text-brand-800"
              >
                {locale === "en" ? room.name_en || room.name_vi : room.name_vi}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <th className="sticky left-0 z-10 border-b border-r border-line bg-surface px-2 py-3 text-xs font-extrabold text-brand-800">
                {time.slice(0, 5)}
              </th>
              {rooms.map((room) => {
                const items = cell(time, room.id);
                return (
                  <td key={room.id} className="border-b border-r border-line p-1.5 align-top">
                    {items.map((session) => (
                      <Link
                        key={session.id}
                        href={`/${locale}/hoi-nghi/${year}/phien/${session.id}`}
                        className="mb-1 block rounded border border-line border-l-4 border-l-brand-500 bg-white p-2 text-[11px] leading-snug transition hover:bg-brand-50"
                      >
                        <span className="block text-[9px] font-extrabold uppercase tracking-wide text-ink-500">
                          {typeName(session, locale)}
                        </span>
                        <span className="mt-2 block font-bold text-ink-900">
                          {sessionTitle(session, locale)}
                        </span>
                        <span className="mt-1 block text-ink-500">
                          {session.start_time.slice(0, 5)}–{session.end_time.slice(0, 5)}
                        </span>
                      </Link>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

