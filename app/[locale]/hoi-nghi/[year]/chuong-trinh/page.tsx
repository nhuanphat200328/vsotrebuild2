import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProgrammeResults } from "@/components/programme/programme-results";
import { getProgrammeData } from "@/lib/programme/data";
import { conferenceName, hasEnglishTranslation } from "@/lib/programme/conference";
import { formatShortDate, formatWeekday } from "@/lib/utils/dates";
import { isLocale, type Locale } from "@/lib/i18n/config";

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function hrefFor(
  base: string,
  params: SearchParams,
  overrides: Record<string, string | undefined>,
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value) search.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value) search.set(key, value);
    else search.delete(key);
  }
  const query = search.toString();
  return query ? `${base}?${query}` : base;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}): Promise<Metadata> {
  const { locale, year } = await params;
  const data = await getProgrammeData(year);
  const name = data ? conferenceName(data.conference, locale as Locale) : `VSOT ${year}`;
  return {
    title: locale === "en" ? `Programme ${year}` : `Chương trình ${year}`,
    description:
      locale === "en"
        ? `Scientific programme for ${name}: sessions, presentations and speakers.`
        : `Chương trình khoa học ${name}: phiên họp, báo cáo và diễn giả.`,
    alternates: { canonical: `/${locale}/hoi-nghi/${year}/chuong-trinh` },
    openGraph: { title: `${name} · ${year}`, type: "website" },
  };
}

export default async function ProgrammePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; year: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale: rawLocale, year } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const data = await getProgrammeData(year);
  if (!data) notFound();

  const sp = await searchParams;
  const view = ["list", "grid", "table"].includes(one(sp.view) ?? "")
    ? (one(sp.view) as "list" | "grid" | "table")
    : "list";
  const selectedDate = one(sp.date) ?? data.dates[0]?.date ?? "";
  const base = `/${locale}/hoi-nghi/${year}/chuong-trinh`;
  const conferenceNameText = conferenceName(data.conference, locale);
  const enFallback = locale === "en" && !hasEnglishTranslation(data.conference);
  const sessions = data.sessions.filter(
    (session) => session.conference_dates?.date === selectedDate,
  );

  return (
    <div className="bg-white pb-20">
      <div className="border-b border-line bg-surface">
        <Container className="py-9">
          <nav className="text-xs font-semibold text-ink-500">
            <Link className="hover:text-brand-700" href={`/${locale}`}>
              {locale === "en" ? "Home" : "Trang chủ"}
            </Link>
            <span className="mx-1.5">/</span>
            <Link className="hover:text-brand-700" href={`/${locale}/hoi-nghi`}>
              {locale === "en" ? "Congresses" : "Hội nghị"}
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-700">{conferenceNameText}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {locale === "en" ? "Scientific programme" : "Chương trình khoa học"}
              </h1>
              <p className="mt-2 text-sm text-ink-500">
                {conferenceNameText}
                {data.conference.city ? ` · ${data.conference.city}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex w-fit rounded-full border border-line bg-white p-1">
                {(["list", "grid", "table"] as const).map((mode) => (
                  <Link
                    key={mode}
                    href={hrefFor(base, sp, { view: mode })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${
                      view === mode ? "bg-brand-600 text-white" : "text-brand-800 hover:bg-brand-50"
                    }`}
                  >
                    {mode === "list" ? "List" : mode === "grid" ? "Grid" : "Table"}
                  </Link>
                ))}
              </div>
              <Link
                href={`/${locale}/hoi-nghi/${year}/chuong-trinh/tong-quan`}
                className="text-xs font-bold text-brand-700 hover:underline"
              >
                {locale === "en" ? "At a glance" : "Tổng quan"}
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <Container className={view === "table" ? "programme-wide-table pt-6" : "pt-6"}>
        {enFallback ? (
          <p className="mb-4 rounded-lg border border-gold-300 bg-gold-100 px-4 py-2.5 text-sm text-ink-700">
            English translation is being updated. Showing Vietnamese content.
          </p>
        ) : null}

        <nav className="flex gap-2 overflow-x-auto pb-2" aria-label="Programme dates">
          {data.dates.map((date) => {
            const active = date.date === selectedDate;
            return (
              <Link
                key={date.id}
                href={hrefFor(base, sp, { date: date.date })}
                className={`flex shrink-0 flex-col items-center rounded-full border px-4 py-2 text-xs font-bold ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line bg-white text-ink-700 hover:border-brand-300"
                }`}
              >
                <span className="uppercase">{formatWeekday(date.date, locale)}</span>
                <span className={active ? "text-white/90" : "text-ink-500"}>
                  {formatShortDate(date.date, locale)}
                </span>
              </Link>
            );
          })}
        </nav>

        <ProgrammeResults
          sessions={sessions}
          rooms={data.rooms}
          types={data.types}
          locale={locale}
          year={year}
          view={view}
          date={selectedDate}
          initialQuery={one(sp.q) ?? ""}
          initialRoom={one(sp.room) ?? ""}
          initialType={one(sp.type) ?? ""}
        />

        <p className="mt-6 text-xs text-ink-500">
          {locale === "en"
            ? "Times are local to the congress venue."
            : "Thời gian hiển thị theo giờ tại hội trường."}
        </p>
      </Container>
    </div>
  );
}
