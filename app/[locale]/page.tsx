import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Download,
  FileImage,
  FileText,
  MapPin,
  Presentation,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ConferenceTimeline } from "@/components/home/conference-timeline";
import { TypewriterSlogan } from "@/components/home/typewriter-slogan";
import { CountUp } from "@/components/ui/count-up";
import { getPublishedLegacySites } from "@/lib/archive/data";
import { getConferenceDocuments } from "@/lib/documents/data";
import { getPublishedNews, newsCategoryName, publicAttachments } from "@/lib/news/data";
import { getLatestConferenceYear, getProgrammeData } from "@/lib/programme/data";
import { conferenceIntro, conferenceName } from "@/lib/programme/conference";
import { sessionHeading } from "@/lib/programme/model";
import { formatDate, formatShortDate, formatWeekday } from "@/lib/utils/dates";
import { mediaUrl } from "@/lib/utils/storage";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const revalidate = 300;

function docTitle(
  doc: { title_vi: string | null; title_en: string | null },
  locale: Locale,
) {
  return locale === "en" ? doc.title_en || doc.title_vi : doc.title_vi || doc.title_en;
}

function docDescription(
  doc: { description_vi: string | null; description_en: string | null },
  locale: Locale,
) {
  return locale === "en"
    ? doc.description_en || doc.description_vi
    : doc.description_vi || doc.description_en;
}

function FileIcon({ format }: { format: string | null }) {
  const value = (format ?? "").toUpperCase();
  if (["JPG", "JPEG", "PNG"].includes(value)) return <FileImage className="size-4" aria-hidden />;
  return <FileText className="size-4" aria-hidden />;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const sloganParts = dict.hero.title.split(/,\s*/);
  const sloganLine1 = sloganParts[0] ?? dict.hero.title;
  const secondLineRaw = sloganParts.slice(1).join(", ");
  const sloganLine2 = secondLineRaw
    ? secondLineRaw.charAt(0).toUpperCase() + secondLineRaw.slice(1)
    : secondLineRaw;

  const latestYear = await getLatestConferenceYear();
  const [data, news, archiveSites] = await Promise.all([
    latestYear ? getProgrammeData(latestYear) : Promise.resolve(null),
    getPublishedNews(locale, 5),
    getPublishedLegacySites(),
  ]);
  const documents = data
    ? await getConferenceDocuments(data.conference.id, ["template", "invitation"])
    : [];
  const templates = documents.filter((doc) => doc.doc_type === "template");
  const invitations = documents.filter((doc) => doc.doc_type === "invitation");

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
  const openingSessions =
    data?.sessions
      .filter((session) => session.conference_dates?.date === data.dates[0]?.date)
      .slice(0, 4) ?? [];

  const stats = [
    { value: data?.dates.length ?? 5, label: locale === "en" ? "congress days" : "ngày hội nghị" },
    { value: data?.rooms.length ?? 6, label: locale === "en" ? "halls" : "hội trường" },
    { value: facultyCount || 245, label: locale === "en" ? "faculty" : "diễn giả" },
    {
      value: presentationCount || 255,
      label: locale === "en" ? "presentations" : "báo cáo",
    },
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-line bg-brand-50">
        <Image
          src="/media/2026/kv.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover scale-110 blur-xl opacity-40"
        />
        <div aria-hidden className="absolute inset-0 bg-brand-50/35" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-8 size-72 rounded-full bg-brand-100/70 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-0 size-64 rounded-full bg-gold-100/60 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6">
          <Image
            src="/media/2026/kv.png"
            alt="Key visual Hội nghị khoa học thường niên VSOT 2026"
            width={1921}
            height={1081}
            priority
            sizes="100vw"
            className="kv-hero-image"
          />
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-16">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Image
                src="/media/2026/logo.gif"
                alt="Logo Hội Ghép tạng Việt Nam"
                width={64}
                height={56}
                className="h-14 w-auto"
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-600">
                {dict.hero.subtitle}
              </p>
            </div>
            <TypewriterSlogan line1={sloganLine1} line2={sloganLine2} />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
              {dict.hero.description}
            </p>
          </div>

          {data ? (
            <aside className="min-w-0 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
                {locale === "en" ? "VSOT 2026 Congress" : "Hội nghị VSOT 2026"}
              </p>
              <h2 className="mt-2 text-xl font-extrabold leading-snug text-ink-900">{name}</h2>
              <dl className="mt-5 grid gap-3 text-sm text-ink-700">
                {data.conference.start_date && data.conference.end_date ? (
                  <div className="flex items-start gap-2.5">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                    <div>
                      <dt className="sr-only">{locale === "en" ? "Dates" : "Thời gian"}</dt>
                      <dd>
                        {formatDate(data.conference.start_date, locale)} –{" "}
                        {formatDate(data.conference.end_date, locale)}
                      </dd>
                    </div>
                  </div>
                ) : null}
                {data.conference.city ? (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                    <div>
                      <dt className="sr-only">{locale === "en" ? "Venue" : "Địa điểm"}</dt>
                      <dd>{data.conference.city}</dd>
                    </div>
                  </div>
                ) : null}
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={programmeHref}
                  className="inline-flex items-center gap-2 bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                >
                  {locale === "en" ? "Scientific programme" : "Chương trình khoa học"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
                <Link
                  href={facultyHref}
                  className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  {locale === "en" ? "Faculty" : "Diễn giả"}
                </Link>
              </div>
            </aside>
          ) : null}
        </Container>
      </section>

      <section className="reveal-section" aria-label={locale === "en" ? "Congress statistics" : "Số liệu hội nghị"}>
        <Container>
          <dl className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-5 py-7 text-center ${
                  index > 0 ? "border-l border-line" : ""
                } ${index >= 2 ? "border-t border-line lg:border-t-0" : ""}`}
              >
                <dd className="text-3xl font-extrabold tracking-tight text-brand-800">
                  <CountUp value={stat.value} label={stat.label} />
                </dd>
                <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="reveal-section py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              {locale === "en" ? "About the society" : "Về Hội Ghép tạng Việt Nam"}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              {dict.about.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{dict.about.body}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              {intro ??
                (locale === "en"
                  ? "The scientific programme is being updated."
                  : "Chương trình khoa học đang được cập nhật.")}
            </p>
            <Link
              href={`/${locale}/hoi-nghi/${latestYear}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
            >
              {locale === "en" ? "Congress overview" : "Tổng quan hội nghị"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>

            <div className="mt-10 border-t-2 border-brand-700 pt-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                    {locale === "en" ? "Newsroom" : "Tin tức & thông báo"}
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
                    {locale === "en" ? "Latest news" : "Tin tức mới nhất"}
                  </h2>
                </div>
                <Link
                  href={`/${locale}/tin-tuc`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
                >
                  {locale === "en" ? "View all" : "Xem tất cả"}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>

              {news.length === 0 ? (
                <p className="mt-5 border-t border-line pt-4 text-sm text-ink-500">
                  {locale === "en" ? "News is being updated." : "Tin tức đang được cập nhật."}
                </p>
              ) : (
                <div className="mt-3 border-t border-line">
                  {news.map((item) => {
                    const translation =
                      item.news_translations.find(
                        (entry) => entry.locale === locale && entry.status === "published",
                      ) ?? item.news_translations.find((entry) => entry.locale === "vi");
                    const category = newsCategoryName(item, locale);
                    const attachments = publicAttachments(item);
                    return (
                      <article
                        key={item.id}
                        className="hover-slide border-b border-line py-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          {category ? (
                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
                              {category}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-1 text-base font-bold leading-snug text-ink-900">
                          <Link
                            href={`/${locale}/tin-tuc/${item.slug}`}
                            className="hover:text-brand-700"
                          >
                            {translation?.title}
                          </Link>
                        </h3>
                        {translation?.excerpt ? (
                          <p className="mt-1 text-sm leading-relaxed text-ink-500">
                            {translation.excerpt}
                          </p>
                        ) : null}
                        <div className="mt-2 flex flex-wrap gap-3">
                          <Link
                            href={`/${locale}/tin-tuc/${item.slug}`}
                            className="text-xs font-bold text-brand-700 hover:underline"
                          >
                            {locale === "en" ? "Read more" : "Xem chi tiết"}
                          </Link>
                          {attachments[0] ? (
                            <a
                              href={mediaUrl(attachments[0])}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-brand-700"
                            >
                              <Download className="size-3.5" aria-hidden />
                              {attachments[0].title_vi ?? attachments[0].file_format ?? "PDF"}
                            </a>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="border-t border-line lg:border-t-0">
            <h2 className="py-3 text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
              {locale === "en" ? "Congress days" : "Các ngày hội nghị"}
            </h2>
            {data?.dates.map((date) => (
              <Link
                key={date.id}
                href={`${programmeHref}?date=${date.date}`}
                className="hover-slide flex items-center justify-between gap-4 border-t border-line px-2 py-3 text-sm transition hover:text-brand-700"
              >
                <span className="font-semibold text-ink-900">
                  {formatWeekday(date.date, locale)}, {formatShortDate(date.date, locale)}
                </span>
                <span className="text-xs text-ink-500">
                  {data.sessions.filter((s) => s.conference_dates?.date === date.date).length}{" "}
                  {locale === "en" ? "sessions" : "phiên"}
                </span>
              </Link>
            ))}

            <div className="mt-8 border-t border-line pt-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
                {locale === "en" ? "Programme & faculty" : "Chương trình & diễn giả"}
              </h2>
              <div className="mt-2 grid">
                <Link
                  href={programmeHref}
                  className="hover-slide flex items-center justify-between border-b border-line px-2 py-2.5 text-sm font-semibold text-ink-900 hover:text-brand-700"
                >
                  {locale === "en" ? "Scientific programme" : "Chương trình khoa học"}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href={facultyHref}
                  className="hover-slide flex items-center justify-between border-b border-line px-2 py-2.5 text-sm font-semibold text-ink-900 hover:text-brand-700"
                >
                  {locale === "en" ? "Faculty" : "Diễn giả"}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href={`/${locale}/hoi-nghi/${latestYear}/chuong-trinh/tong-quan`}
                  className="hover-slide flex items-center justify-between border-b border-line px-2 py-2.5 text-sm font-semibold text-ink-900 hover:text-brand-700"
                >
                  {locale === "en" ? "At a glance" : "Tổng quan chương trình"}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      <Container className="reveal-section py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              {locale === "en" ? "Science" : "Khoa học"}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              {locale === "en" ? "Opening day programme" : "Chương trình ngày đầu"}
            </h2>
          </div>
          <Link
            href={`${programmeHref}?date=${data?.dates[0]?.date ?? ""}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
          >
            {locale === "en" ? "Full programme" : "Toàn bộ chương trình"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-6 border-t border-line">
          {openingSessions.length === 0 ? (
            <p className="py-5 text-sm text-ink-500">
              {locale === "en" ? "Programme is being updated." : "Chương trình đang được cập nhật."}
            </p>
          ) : (
            openingSessions.map((session) => {
              const title = sessionHeading(session, locale);
              return (
                <Link
                  key={session.id}
                  href={`/${locale}/hoi-nghi/${latestYear}/phien/${session.id}`}
                  className="hover-slide grid gap-3 border-b border-line px-2 py-4 transition hover:text-brand-700 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold text-brand-700">
                    <Clock className="size-3.5" aria-hidden />
                    {session.start_time.slice(0, 5)}–{session.end_time.slice(0, 5)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold leading-snug text-ink-900">
                      {title}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-ink-500">
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
                  <span className="hidden items-center gap-1 text-xs font-bold text-brand-700 sm:flex">
                    {locale === "en" ? "Open" : "Chi tiết"}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </Container>

      <section className="reveal-section border-y border-line bg-surface">
        <Container className="reveal-section py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
                {locale === "en" ? "Speaker resources" : "Tài liệu dành cho báo cáo viên"}
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                {locale === "en" ? "Download the presentation templates." : "Tải template bài báo cáo."}
              </p>
              <div className="mt-4 border-t border-line">
                {templates.map((doc) => (
                  <div key={doc.id} className="grid gap-2 border-b border-line py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center bg-brand-50 text-brand-700">
                          <FileIcon format={doc.file_format} />
                        </span>
                        <div>
                          <p className="text-sm font-bold leading-snug text-ink-900">
                            {docTitle(doc, locale)}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-ink-500">
                            {docDescription(doc, locale)}
                          </p>
                        </div>
                      </div>
                      {doc.file_path ? (
                        <a
                          href={mediaUrl(doc)}
                          className="inline-flex shrink-0 items-center gap-1.5 border border-line px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-white"
                          download
                        >
                          <Download className="size-3.5" aria-hidden />
                          {doc.file_format ?? "Tải"}
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
                <p className="pt-4 text-xs leading-relaxed text-ink-500">
                  {locale === "en"
                    ? "Please download the appropriate template and use it when preparing your presentation."
                    : "Vui lòng tải template phù hợp và sử dụng khi chuẩn bị bài báo cáo tại hội nghị."}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
                {locale === "en" ? "Invitation letters" : "Thư mời"}
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                {locale === "en"
                  ? "Official invitation from the Organising Committee."
                  : "Thư mời chính thức Hội nghị khoa học thường niên VSOT 2026."}
              </p>
              <div className="mt-4 border-t border-line">
                {invitations.map((doc) => (
                  <div key={doc.id} className="border-b border-line py-4">
                    <p className="text-sm font-bold leading-snug text-ink-900">
                      {docTitle(doc, locale)}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      {docDescription(doc, locale)}
                    </p>
                    {doc.file_path ? (
                      <div className="mt-2 flex flex-wrap gap-3">
                        <a
                          href={mediaUrl(doc)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
                        >
                          {locale === "en" ? "View" : "Xem"} {doc.file_format ?? ""}
                        </a>
                        <a
                          href={mediaUrl(doc)}
                          download
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-brand-700"
                        >
                          <Download className="size-3.5" aria-hidden />
                          {locale === "en" ? "Download" : "Tải xuống"}
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {archiveSites.length > 0 ? (
        <Container className="reveal-section py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                {locale === "en" ? "Archive" : "Kho lưu trữ"}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
                {locale === "en" ? "Past congresses" : "Hội nghị các năm"}
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                {locale === "en"
                  ? "Programmes and materials from previous VSOT congresses."
                  : "Chương trình và tư liệu các kỳ hội nghị trước của VSOT."}
              </p>
            </div>
            <Link
              href={`/${locale}/hoi-nghi/cac-nam-truoc`}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
            >
              {locale === "en" ? "Archive overview" : "Xem kho lưu trữ"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8">
            <ConferenceTimeline sites={archiveSites} locale={locale} />
          </div>
        </Container>
      ) : null}

      <section className="reveal-section border-t border-line bg-brand-900 text-white">
        <Container className="flex flex-col gap-5 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-extrabold">
              {locale === "en" ? "Explore the scientific programme" : "Khám phá chương trình khoa học"}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {locale === "en"
                ? "Sessions, presentations and faculty of VSOT 2026."
                : "Phiên họp, báo cáo và diễn giả của VSOT 2026."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={programmeHref}
              className="inline-flex items-center gap-2 bg-gold-500 px-5 py-2.5 text-sm font-bold text-brand-900 hover:bg-gold-300"
            >
              {locale === "en" ? "Programme" : "Chương trình"}
              <Presentation className="size-4" aria-hidden />
            </Link>
            <Link
              href={facultyHref}
              className="inline-flex items-center gap-2 border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {locale === "en" ? "Faculty" : "Diễn giả"}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
