import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Presentation,
  Search,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { RoleBadge } from "@/components/programme/role-badge";
import { getLatestConferenceYear, getProgrammeData } from "@/lib/programme/data";
import { conferenceIntro, conferenceName } from "@/lib/programme/conference";
import { formatDate, formatShortDate, formatWeekday } from "@/lib/utils/dates";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  const latestYear = await getLatestConferenceYear();
  const data = latestYear ? await getProgrammeData(latestYear) : null;
  const programmeHref = latestYear
    ? `/${locale}/hoi-nghi/${latestYear}/chuong-trinh`
    : `/${locale}/hoi-nghi`;
  const facultyHref = latestYear
    ? `/${locale}/hoi-nghi/${latestYear}/dien-gia`
    : `/${locale}/hoi-nghi`;

  const presentationCount =
    data?.sessions.reduce((sum, session) => sum + session.presentations.length, 0) ?? 0;
  const facultyCount = data
    ? new Set(
        data.sessions.flatMap((session) => [
          ...session.session_people.map((p) => p.people?.id),
          ...session.presentations.flatMap((p) =>
            p.presentation_people.map((person) => person.people?.id),
          ),
        ]),
      ).size
    : 0;
  const name = data ? conferenceName(data.conference, locale) : "VSOT 2026";
  const intro = data ? conferenceIntro(data.conference, locale) : null;
  const todaySessions =
    data?.sessions
      .filter((session) => session.conference_dates?.date === data.dates[0]?.date)
      .slice(0, 3) ?? [];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(106,127,200,0.55),transparent_42%),radial-gradient(circle_at_88%_12%,rgba(245,181,61,0.22),transparent_36%)]"
        />
        <Container className="relative py-16 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300">
            {dict.hero.subtitle}
          </p>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {dict.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            {dict.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={programmeHref}
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-3 text-sm font-bold text-brand-900 transition hover:bg-gold-300"
            >
              {locale === "en" ? "Scientific programme" : "Chương trình khoa học"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={facultyHref}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {locale === "en" ? "Faculty" : "Diễn giả"}
            </Link>
            <Link
              href={`/${locale}/lien-he`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {locale === "en" ? "Contact" : "Liên hệ"}
            </Link>
          </div>

          {data?.conference.start_date && data?.conference.end_date ? (
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-gold-300" aria-hidden />
                {formatDate(data.conference.start_date, locale)} –{" "}
                {formatDate(data.conference.end_date, locale)}
              </span>
              {data.conference.city ? (
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-gold-300" aria-hidden />
                  {data.conference.city}
                </span>
              ) : null}
            </div>
          ) : null}
        </Container>
      </section>

      {data ? (
        <Container className="-mt-8 relative z-10">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-lg shadow-brand-900/5 lg:grid-cols-4">
            {[
              {
                icon: CalendarDays,
                value: data.dates.length,
                label: locale === "en" ? "days" : "ngày",
              },
              {
                icon: MapPin,
                value: data.rooms.length,
                label: locale === "en" ? "halls" : "hội trường",
              },
              {
                icon: Users,
                value: facultyCount,
                label: locale === "en" ? "faculty" : "diễn giả",
              },
              {
                icon: Presentation,
                value: presentationCount,
                label: locale === "en" ? "presentations" : "báo cáo",
              },
            ].map((item) => (
              <div key={item.label} className="bg-white px-5 py-6 text-center">
                <item.icon className="mx-auto size-5 text-brand-600" aria-hidden />
                <p className="mt-2 text-2xl font-extrabold text-ink-900">{item.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      ) : null}

      {data ? (
        <Container className="py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                {locale === "en" ? "Latest congress" : "Hội nghị gần nhất"}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                {name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
                {intro ??
                  (locale === "en"
                    ? "The scientific programme is being updated."
                    : "Chương trình khoa học đang được cập nhật.")}
              </p>
            </div>
            <Link
              href={`/${locale}/hoi-nghi/${latestYear}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
            >
              {locale === "en" ? "Congress overview" : "Tổng quan hội nghị"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {data.dates.map((date) => (
              <Link
                key={date.id}
                href={`${programmeHref}?date=${date.date}`}
                className="rounded-xl border border-line bg-white px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <span className="block text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  {formatWeekday(date.date, locale)}
                </span>
                <span className="mt-1 block text-sm font-extrabold text-ink-900">
                  {formatShortDate(date.date, locale)}
                </span>
                <span className="mt-1 block text-[11px] text-ink-500">
                  {data.sessions.filter((s) => s.conference_dates?.date === date.date).length}{" "}
                  {locale === "en" ? "sessions" : "phiên"}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section aria-labelledby="featured-sessions">
              <div className="flex items-center justify-between gap-3">
                <h2 id="featured-sessions" className="text-xl font-extrabold text-ink-900">
                  {locale === "en" ? "Opening day highlights" : "Điểm nhấn ngày đầu"}
                </h2>
                <Link
                  href={`${programmeHref}?date=${data.dates[0]?.date ?? ""}`}
                  className="text-xs font-bold text-brand-700 hover:underline"
                >
                  {locale === "en" ? "View all" : "Xem tất cả"}
                </Link>
              </div>
              <div className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">
                {todaySessions.length === 0 ? (
                  <p className="p-6 text-sm text-ink-500">
                    {locale === "en" ? "No sessions published." : "Chưa có phiên được công bố."}
                  </p>
                ) : (
                  todaySessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/${locale}/hoi-nghi/${latestYear}/phien/${session.id}`}
                      className="flex items-start gap-4 p-4 transition hover:bg-surface"
                    >
                      <span className="w-16 shrink-0 text-xs font-extrabold text-brand-700">
                        {session.start_time.slice(0, 5)}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold leading-snug text-ink-900">
                          {session.session_translations.find((t) => t.locale === locale)?.title ??
                            session.session_translations[0]?.title}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-500">
                          {session.rooms?.name_vi ? <span>{session.rooms.name_vi}</span> : null}
                          {session.session_types?.name_vi ? (
                            <span>· {session.session_types.name_vi}</span>
                          ) : null}
                          <span>
                            · {session.presentations.length}{" "}
                            {locale === "en" ? "presentations" : "báo cáo"}
                          </span>
                        </span>
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </section>

            <aside className="grid gap-3" aria-label="Quick links">
              <Link
                href={programmeHref}
                className="group rounded-xl border border-line bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
              >
                <CalendarDays className="size-5 text-brand-600" aria-hidden />
                <p className="mt-3 text-base font-extrabold text-ink-900">
                  {locale === "en" ? "Scientific programme" : "Chương trình khoa học"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  {locale === "en"
                    ? "List, grid and room-by-room views with filters."
                    : "Chế độ danh sách, lưới và bảng theo phòng, kèm bộ lọc."}
                </p>
              </Link>
              <Link
                href={facultyHref}
                className="group rounded-xl border border-line bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
              >
                <Users className="size-5 text-brand-600" aria-hidden />
                <p className="mt-3 text-base font-extrabold text-ink-900">
                  {locale === "en" ? "Faculty directory" : "Danh sách diễn giả"}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs leading-relaxed text-ink-500">
                  <RoleBadge role="chair" locale={locale} />
                  <RoleBadge role="discussant" locale={locale} />
                  <RoleBadge role="presenter" locale={locale} />
                </p>
              </Link>
              <Link
                href={`${programmeHref}#programme-search`}
                className="group rounded-xl border border-line bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
              >
                <Search className="size-5 text-brand-600" aria-hidden />
                <p className="mt-3 text-base font-extrabold text-ink-900">
                  {locale === "en" ? "Search the programme" : "Tìm trong chương trình"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  {locale === "en"
                    ? "Filter by session, presentation, speaker or room."
                    : "Lọc theo phiên, báo cáo, diễn giả hoặc hội trường."}
                </p>
              </Link>
            </aside>
          </div>
        </Container>
      ) : (
        <Container className="py-16">
          <p className="rounded-xl border border-dashed border-line bg-surface p-8 text-sm text-ink-500">
            {locale === "en"
              ? "The scientific programme is being updated."
              : "Chương trình khoa học đang được cập nhật."}
          </p>
        </Container>
      )}
    </div>
  );
}
