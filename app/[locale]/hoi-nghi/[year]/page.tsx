import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, MapPin, Presentation, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { getConferenceDocuments } from "@/lib/documents/data";
import { getProgrammeData } from "@/lib/programme/data";
import { conferenceIntro, conferenceName, hasEnglishTranslation } from "@/lib/programme/conference";
import { formatDate } from "@/lib/utils/dates";
import { mediaUrl } from "@/lib/utils/storage";
import { absoluteUrl, eventJsonLd } from "@/lib/utils/seo";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, year } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "vi";
  const data = await getProgrammeData(year);
  if (!data) return { title: locale === "en" ? "Congress" : "Hội nghị" };
  const name = conferenceName(data.conference, locale);
  return {
    title: name,
    description:
      conferenceIntro(data.conference, locale) ??
      (locale === "en"
        ? "Scientific programme, faculty and venue information."
        : "Chương trình khoa học, diễn giả và thông tin hội trường."),
    alternates: { canonical: `/${locale}/hoi-nghi/${year}` },
    openGraph: { title: name, type: "website" },
  };
}

export default async function ConferencePage({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale: rawLocale, year } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const data = await getProgrammeData(year);
  if (!data) notFound();

  const name = conferenceName(data.conference, locale);
  const intro = conferenceIntro(data.conference, locale);
  const presentationCount = data.sessions.reduce(
    (sum, session) => sum + session.presentations.length,
    0,
  );
  const peopleCount = new Set(
    data.sessions.flatMap((session) => [
      ...session.session_people.map((p) => p.people?.id),
      ...session.presentations.flatMap((p) =>
        p.presentation_people.map((person) => person.people?.id),
      ),
    ]),
  ).size;
  const fallback = locale === "en" && !hasEnglishTranslation(data.conference);
  const documents = await getConferenceDocuments(data.conference.id, [
    "abstract",
    "programme",
    "invitation",
  ]);

  return (
    <div className="bg-white pb-20">
      <JsonLd
        data={eventJsonLd({
          name,
          startDate: data.conference.start_date,
          endDate: data.conference.end_date,
          city: data.conference.city,
          url: absoluteUrl(`/${locale}/hoi-nghi/${year}`),
          description: intro,
        })}
      />
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(13,129,205,0.55),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(233,172,55,0.18),transparent_35%)]"
        />
        <Container className="relative py-16">
          <nav className="text-xs font-semibold text-white/60">
            <Link className="hover:text-white" href={`/${locale}`}>
              {locale === "en" ? "Home" : "Trang chủ"}
            </Link>
            <span className="mx-1.5">/</span>
            <Link className="hover:text-white" href={`/${locale}/hoi-nghi`}>
              {locale === "en" ? "Congresses" : "Hội nghị"}
            </Link>
          </nav>
          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            {name}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
            {data.conference.start_date && data.conference.end_date ? (
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-gold-300" aria-hidden />
                {formatDate(data.conference.start_date, locale)} –{" "}
                {formatDate(data.conference.end_date, locale)}
              </span>
            ) : null}
            {data.conference.city ? (
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-gold-300" aria-hidden />
                {data.conference.city}
              </span>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/hoi-nghi/${year}/chuong-trinh`}
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-3 text-sm font-bold text-ink-900 hover:bg-gold-300"
            >
              {locale === "en" ? "Scientific programme" : "Chương trình khoa học"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={`/${locale}/hoi-nghi/${year}/dien-gia`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {locale === "en" ? "Faculty" : "Diễn giả"}
            </Link>
            <Link
              href={`/${locale}/hoi-nghi/${year}/chuong-trinh/tong-quan`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {locale === "en" ? "At a glance" : "Tổng quan"}
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        {fallback ? (
          <p className="mb-6 rounded-lg border border-gold-300 bg-gold-100 px-4 py-2.5 text-sm text-ink-700">
            English translation is being updated. Showing Vietnamese content.
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {[
            { icon: CalendarDays, value: data.dates.length, label: locale === "en" ? "days" : "ngày" },
            { icon: MapPin, value: data.rooms.length, label: locale === "en" ? "halls" : "hội trường" },
            { icon: Users, value: peopleCount, label: locale === "en" ? "faculty" : "diễn giả" },
            { icon: Presentation, value: presentationCount, label: locale === "en" ? "presentations" : "báo cáo" },
          ].map((item) => (
            <div key={item.label} className="bg-white px-5 py-6 text-center">
              <item.icon className="mx-auto size-5 text-brand-500" aria-hidden />
              <p className="mt-2 text-2xl font-extrabold text-ink-900">{item.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-ink-900">
              {locale === "en" ? "Overview" : "Tổng quan"}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-700">
              {intro ?? (locale === "en" ? "Content is being updated." : "Nội dung đang được cập nhật.")}
            </p>

            <div className="mt-7">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">
                {locale === "en" ? "Programme days" : "Các ngày hội nghị"}
              </h3>
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white">
                {data.dates.map((date) => (
                  <li key={date.id}>
                    <Link
                      href={`/${locale}/hoi-nghi/${year}/chuong-trinh?date=${date.date}`}
                      className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-surface"
                    >
                      <span className="font-semibold text-ink-900">
                        {formatDate(date.date, locale)}
                      </span>
                      <span className="text-xs text-ink-500">
                        {data.sessions.filter((s) => s.conference_dates?.date === date.date).length}{" "}
                        {locale === "en" ? "sessions" : "phiên"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">
              {locale === "en" ? "Halls" : "Hội trường"}
            </h2>
            <ul className="mt-3 grid gap-2">
              {data.rooms.map((room) => (
                <li key={room.id} className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-700">
                  {locale === "en" ? room.name_en || room.name_vi : room.name_vi}
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-ink-500">
              {locale === "en" ? "Session types" : "Loại phiên"}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.types
                .filter((type) => !type.is_break)
                .map((type) => (
                  <span
                    key={type.id}
                    className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-600"
                  >
                    {locale === "en" ? type.name_en || type.name_vi : type.name_vi || type.name_en}
                  </span>
                ))}
            </div>
          </aside>
        </div>

        {documents.length ? (
          <section className="mt-12" aria-labelledby="congress-documents">
            <h2 id="congress-documents" className="text-2xl font-extrabold text-ink-900">
              {locale === "en" ? "Congress documents" : "Tài liệu hội nghị"}
            </h2>
            <div className="mt-4 border-t-2 border-brand-700">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col gap-2 border-b border-line py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="text-sm font-bold text-ink-900">
                      {locale === "en"
                        ? doc.title_en || doc.title_vi
                        : doc.title_vi || doc.title_en}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      {locale === "en"
                        ? doc.description_en || doc.description_vi
                        : doc.description_vi || doc.description_en}
                    </p>
                  </div>
                  {doc.file_path ? (
                    <a
                      href={mediaUrl(doc)}
                      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ArrowRight className="size-3.5" aria-hidden />
                      {doc.file_format ?? "PDF"}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  );
}

