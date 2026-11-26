import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { ProgrammeText } from "@/components/programme/programme-text";
import { RoleBadge } from "@/components/programme/role-badge";
import type { Locale } from "@/lib/i18n/config";
import {
  abstractHref,
  hasAbstract,
  presentationHeading,
  presentationTitle,
  sessionHeading,
  sessionTitle,
  typeName,
  type ProgrammeSession,
  type SessionPerson,
} from "@/lib/programme/model";
import { textBody } from "@/lib/utils/text";

function PersonLine({
  person,
  locale,
  year,
}: {
  person: SessionPerson;
  locale: Locale;
  year: string;
}) {
  if (!person.people) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <RoleBadge role={person.role} locale={locale} />
      <Link
        href={`/${locale}/hoi-nghi/${year}/dien-gia/${person.people.slug}`}
        className="text-sm text-brand-700 hover:underline"
      >
        {person.people.display_name || person.people.full_name}
      </Link>
    </span>
  );
}

export function ProgrammeList({
  sessions,
  locale,
  year,
}: {
  sessions: ProgrammeSession[];
  locale: Locale;
  year: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {sessions.map((session) => {
        const fullTitle = sessionTitle(session, locale);
        const title = sessionHeading(session, locale);
        const titleBody = textBody(fullTitle);
        const type = typeName(session, locale);
        const chairs = session.session_people.filter((p) =>
          ["chair", "co_chair", "discussant", "moderator"].includes(p.role),
        );
        const sessionPresentations = session.presentations ?? [];

        return (
          <details
            key={session.id}
            className="group border-b border-line last:border-b-0"
          >
            <summary className="grid cursor-pointer list-none grid-cols-[86px_minmax(0,1fr)_18px] items-start gap-3 p-3.5 hover:bg-surface sm:grid-cols-[120px_minmax(0,1fr)_20px] sm:p-4">
              <div className="text-xs font-extrabold text-brand-800 sm:text-sm">
                <span className="block">
                  {session.start_time.slice(0, 5)}–{session.end_time.slice(0, 5)}
                </span>
                <span className="mt-1 inline-block rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white">
                  {locale === "en"
                    ? session.rooms?.name_en || session.rooms?.name_vi
                    : session.rooms?.name_vi}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold leading-snug text-ink-900 sm:text-[15px]">
                  {title}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-ink-500">
                  {type ? <span>{type}</span> : null}
                  {session.program_number ? <span>· {session.program_number}</span> : null}
                  {sessionPresentations.length ? (
                    <span>
                      · {sessionPresentations.length}{" "}
                      {locale === "en" ? "presentations" : "báo cáo"}
                    </span>
                  ) : null}
                </div>
              </div>
              <ChevronRight className="mt-0.5 size-4 text-ink-500 transition group-open:rotate-90" />
            </summary>

            <div className="border-t border-line bg-surface/60 px-3.5 py-4 sm:px-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/${locale}/hoi-nghi/${year}/phien/${session.id}`}
                  className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
                >
                  {locale === "en" ? "Session details" : "Chi tiết phiên"}
                </Link>
              </div>

              {titleBody ? (
                <ProgrammeText
                  text={titleBody}
                  className="mt-3 text-sm leading-relaxed text-ink-700"
                />
              ) : null}

              {chairs.length ? (
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
                    {locale === "en" ? "Chairs & discussants" : "Chủ tọa & thảo luận"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5">
                    {chairs.map((person) => (
                      <PersonLine
                        key={`${person.role}-${person.people?.id}`}
                        person={person}
                        locale={locale}
                        year={year}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {sessionPresentations.length ? (
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
                    {locale === "en" ? "Presentations" : "Báo cáo"}
                  </p>
                  <ul className="mt-1 divide-y divide-line/70">
                    {sessionPresentations.map((presentation) => {
                      const speakers = presentation.presentation_people ?? [];
                      const pFullTitle = presentationTitle(presentation, locale);
                      const pHeading = presentationHeading(presentation, locale);
                      const pBody = textBody(pFullTitle);
                      return (
                        <li key={presentation.id} className="py-2.5">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-snug text-ink-900">
                                {pHeading}
                              </p>
                              {pBody ? (
                                <ProgrammeText
                                  text={pBody}
                                  className="mt-1 text-xs leading-relaxed text-ink-600"
                                />
                              ) : null}
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                {hasAbstract(presentation) ? (
                                  <Link
                                    href={abstractHref(locale, year, presentation.id)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
                                  >
                                    <FileText className="size-3.5" aria-hidden />
                                    Abstract
                                  </Link>
                                ) : null}
                                {speakers.length ? (
                                  <span className="text-[11px] text-ink-500">
                                    {locale === "en" ? "Presenter:" : "Báo cáo viên:"}
                                  </span>
                                ) : null}
                                {speakers.map((person) =>
                                  person.people ? (
                                    <Link
                                      key={person.people.id}
                                      href={`/${locale}/hoi-nghi/${year}/dien-gia/${person.people.slug}`}
                                      className="text-xs text-ink-500 hover:text-brand-700"
                                    >
                                      {person.people.display_name || person.people.full_name}
                                    </Link>
                                  ) : null,
                                )}
                              </div>
                            </div>
                            <span className="shrink-0 text-[11px] font-semibold text-ink-500">
                              {presentation.start_time?.slice(0, 5)}
                              {presentation.end_time
                                ? `–${presentation.end_time.slice(0, 5)}`
                                : ""}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </details>
        );
      })}
    </div>
  );
}
