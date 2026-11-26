import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { ProgrammeText } from "@/components/programme/programme-text";
import { RoleBadge, roleLabel } from "@/components/programme/role-badge";
import {
  getConferenceByYear,
  getSessionById,
  presentationTitle,
  sessionTitle,
  typeName,
} from "@/lib/programme/data";
import {
  abstractHref,
  hasAbstract,
  presentationHeading,
  sessionHeading,
} from "@/lib/programme/model";
import { textBody } from "@/lib/utils/text";
import { formatDate } from "@/lib/utils/dates";
import { absoluteUrl, eventJsonLd } from "@/lib/utils/seo";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, year, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "vi";
  const session = await getSessionById(id);
  if (!session) return { title: locale === "en" ? "Session" : "Phiên" };
  const title = sessionTitle(session, locale);
  return {
    title,
    description: `${session.start_time.slice(0, 5)}–${session.end_time.slice(0, 5)} · ${
      session.rooms?.name_vi ?? ""
    } · ${year}`,
    alternates: { canonical: `/${locale}/hoi-nghi/${year}/phien/${id}` },
    openGraph: { title, type: "article" },
  };
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ locale: string; year: string; id: string }>;
}) {
  const { locale: rawLocale, year, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const [session, conference] = await Promise.all([
    getSessionById(id),
    getConferenceByYear(year),
  ]);
  if (!session || !conference || session.conference_id !== conference.id) notFound();

  const fullSessionTitle = sessionTitle(session, locale);
  const sessionHeadingText = sessionHeading(session, locale);
  const sessionTitleBody = textBody(fullSessionTitle);
  const chairs = session.session_people.filter((p) =>
    ["chair", "co_chair", "discussant", "moderator"].includes(p.role),
  );

  return (
    <div className="bg-surface pb-20">
      <JsonLd
        data={eventJsonLd({
          name: sessionTitle(session, locale),
          startDate: session.conference_dates?.date
            ? `${session.conference_dates.date}T${session.start_time}`
            : null,
          endDate: session.conference_dates?.date
            ? `${session.conference_dates.date}T${session.end_time}`
            : null,
          city: conference.city,
          url: absoluteUrl(`/${locale}/hoi-nghi/${year}/phien/${session.id}`),
          description: typeName(session, locale),
        })}
      />
      <Container className="py-8">
        <Link
          href={`/${locale}/hoi-nghi/${year}/chuong-trinh?date=${session.conference_dates?.date ?? ""}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {locale === "en" ? "Back to programme" : "Quay lại chương trình"}
        </Link>

        <article className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <header className="border-b-2 border-gold-500 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              {typeName(session, locale) ?? (locale === "en" ? "Session" : "Phiên")}
            </p>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl">
              {sessionHeadingText}
            </h1>
            {sessionTitleBody ? (
              <ProgrammeText
                text={sessionTitleBody}
                className="mt-3 text-sm leading-relaxed text-ink-700"
              />
            ) : null}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-brand-500" aria-hidden />
                {session.conference_dates?.date
                  ? formatDate(session.conference_dates.date, locale)
                  : ""}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-brand-500" aria-hidden />
                {locale === "en"
                  ? session.rooms?.name_en || session.rooms?.name_vi
                  : session.rooms?.name_vi}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 text-brand-500" aria-hidden />
                {session.start_time.slice(0, 5)}–{session.end_time.slice(0, 5)}
              </span>
            </div>
          </header>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
                {locale === "en" ? "Chairs & discussants" : "Chủ tọa & thảo luận"}
              </h2>
              {chairs.length === 0 ? (
                <p className="mt-2 text-sm text-ink-500">
                  {locale === "en" ? "Being updated." : "Đang được cập nhật."}
                </p>
              ) : (
                <ul className="mt-3 grid gap-3">
                  {chairs.map((person) =>
                    person.people ? (
                      <li key={`${person.role}-${person.people.id}`} className="flex items-start gap-2">
                        <RoleBadge role={person.role} locale={locale} />
                        <div>
                          <Link
                            href={`/${locale}/hoi-nghi/${year}/dien-gia/${person.people.slug}`}
                            className="text-sm font-bold text-ink-900 hover:text-brand-700"
                          >
                            {person.people.display_name || person.people.full_name}
                          </Link>
                          <p className="text-xs text-ink-500">
                            {roleLabel(person.role, locale)}
                            {person.people.institution ? ` · ${person.people.institution}` : ""}
                          </p>
                        </div>
                      </li>
                    ) : null,
                  )}
                </ul>
              )}
            </aside>

            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
                {locale === "en" ? "Presentations" : "Báo cáo"}
              </h2>
              {session.presentations.length === 0 ? (
                <p className="mt-2 text-sm text-ink-500">
                  {locale === "en" ? "No presentations." : "Chưa có báo cáo."}
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-line">
                  {session.presentations.map((presentation, index) => (
                    <li key={presentation.id} className="py-3">
                      <div className="flex gap-3">
                        <span className="mt-0.5 text-xs font-extrabold text-brand-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-snug text-ink-900">
                            {presentationHeading(presentation, locale)}
                          </p>
                          {textBody(presentationTitle(presentation, locale)) ? (
                            <ProgrammeText
                              text={textBody(presentationTitle(presentation, locale))}
                              className="mt-1 text-xs leading-relaxed text-ink-600"
                            />
                          ) : null}
                          <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                            {hasAbstract(presentation) ? (
                              <Link
                                href={abstractHref(locale, year, presentation.id)}
                                className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
                              >
                                <FileText className="size-3.5" aria-hidden />
                                Abstract
                              </Link>
                            ) : null}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              {presentation.presentation_people.length ? (
                                <span className="text-[11px] text-ink-500">
                                  {locale === "en" ? "Presenter:" : "Báo cáo viên:"}
                                </span>
                              ) : null}
                              {presentation.presentation_people.map((person) =>
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
                              {presentation.start_time ? (
                                <span className="max-sm:basis-full max-sm:mt-0.5 text-[11px] text-ink-500">
                                  {presentation.start_time.slice(0, 5)}
                                  {presentation.end_time ? `–${presentation.end_time.slice(0, 5)}` : ""}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </article>
      </Container>
    </div>
  );
}
