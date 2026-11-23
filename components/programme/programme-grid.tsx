import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { sessionTitle, typeName, type ProgrammeSession } from "@/lib/programme/model";

export function ProgrammeGrid({
  sessions,
  locale,
  year,
}: {
  sessions: ProgrammeSession[];
  locale: Locale;
  year: string;
}) {
  const groups = new Map<string, ProgrammeSession[]>();
  for (const session of sessions) {
    const key = session.start_time;
    const list = groups.get(key) ?? [];
    list.push(session);
    groups.set(key, list);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {[...groups.entries()].map(([time, list]) => (
        <section key={time} className="grid gap-0 border-b border-line last:border-b-0 md:grid-cols-[96px_minmax(0,1fr)]">
          <div className="border-b border-line bg-surface px-4 py-3 text-xs font-extrabold text-brand-800 md:border-b-0 md:border-r">
            {time.slice(0, 5)}
          </div>
          <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((session) => {
              const chairs = session.session_people.filter((p) => p.role === "chair");
              return (
                <Link
                  key={session.id}
                  href={`/${locale}/hoi-nghi/${year}/phien/${session.id}`}
                  className="flex min-h-36 flex-col rounded-lg border border-line border-l-4 border-l-brand-500 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-ink-500">
                    <span className="rounded-full bg-brand-700 px-2 py-0.5 text-white normal-case">
                      {locale === "en" ? session.rooms?.name_en || session.rooms?.name_vi : session.rooms?.name_vi}
                    </span>
                    <span>{typeName(session, locale)}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-ink-900">
                    {sessionTitle(session, locale)}
                  </h3>
                  {chairs.length ? (
                    <p className="mt-2 line-clamp-2 text-[11px] text-ink-500">
                      <span className="font-semibold text-ink-700">
                        {locale === "en" ? "Chair: " : "Chủ tọa: "}
                      </span>
                      {chairs
                        .map((p) => p.people?.display_name || p.people?.full_name)
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  ) : null}
                  <p className="mt-auto pt-3 text-[11px] font-semibold text-ink-500">
                    {session.presentations.length
                      ? `${session.presentations.length} ${locale === "en" ? "presentations" : "báo cáo"}`
                      : locale === "en"
                        ? "No presentations"
                        : "Chưa có báo cáo"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

