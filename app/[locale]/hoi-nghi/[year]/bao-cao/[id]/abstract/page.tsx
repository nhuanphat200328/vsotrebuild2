import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getConferenceByYear, getPresentationAbstract } from "@/lib/programme/data";
import { pickTranslation } from "@/lib/programme/model";
import { formatDate } from "@/lib/utils/dates";
import { mediaUrl } from "@/lib/utils/storage";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, year, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "vi";
  const presentation = await getPresentationAbstract(id);
  const title = presentation
    ? pickTranslation(presentation.presentation_translations as never, locale)?.title
    : null;
  return {
    title: title ? `Abstract — ${title}` : locale === "en" ? "Abstract" : "Abstract",
    description: title ?? undefined,
    alternates: {
      canonical: `/${locale}/hoi-nghi/${year}/bao-cao/${id}/abstract`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function AbstractPage({
  params,
}: {
  params: Promise<{ locale: string; year: string; id: string }>;
}) {
  const { locale: rawLocale, year, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const [presentation, conference] = await Promise.all([
    getPresentationAbstract(id),
    getConferenceByYear(year),
  ]);
  if (!presentation || !conference || presentation.sessions?.conference_id !== conference.id) {
    notFound();
  }
  const hasFile = Boolean(
    presentation.abstract_storage_path || presentation.abstract_file_path,
  );
  if (!hasFile) notFound();

  const title = pickTranslation(
    presentation.presentation_translations as never,
    locale,
  )?.title;
  const sessionTitle = presentation.sessions
    ? pickTranslation(presentation.sessions.session_translations as never, locale)?.title
    : null;
  const isHtml = (presentation.abstract_format ?? "").toUpperCase() === "HTML";
  const url =
    isHtml && presentation.abstract_file_path
      ? presentation.abstract_file_path
      : mediaUrl({
          file_path: presentation.abstract_file_path,
          storage_bucket: presentation.abstract_storage_bucket,
          storage_path: presentation.abstract_storage_path,
        });

  return (
    <div className="bg-surface pb-20">
      <Container className="py-8">
        {presentation.sessions ? (
          <Link
            href={`/${locale}/hoi-nghi/${year}/phien/${presentation.sessions.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {locale === "en" ? "Back to session" : "Quay lại phiên"}
          </Link>
        ) : null}

        <div className="mt-4 flex flex-col gap-4 border-b-2 border-gold-500 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {locale === "en" ? "Abstract" : "Abstract"}
            </p>
            <h1 className="mt-2 max-w-4xl text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
              {title ?? (locale === "en" ? "Presentation abstract" : "Tóm tắt báo cáo")}
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {sessionTitle ? `${sessionTitle} · ` : ""}
              {presentation.sessions?.conference_dates?.date
                ? formatDate(presentation.sessions.conference_dates.date, locale)
                : ""}
              {presentation.sessions
                ? ` · ${presentation.sessions.start_time.slice(0, 5)}–${presentation.sessions.end_time.slice(0, 5)}`
                : ""}
              {presentation.sessions?.rooms
                ? ` · ${locale === "en" ? presentation.sessions.rooms.name_en || presentation.sessions.rooms.name_vi : presentation.sessions.rooms.name_vi}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-bold text-brand-700 hover:bg-surface"
            >
              <ExternalLink className="size-3.5" aria-hidden />
              {locale === "en" ? "Open in new tab" : "Mở tab mới"}
            </a>
            <a
              href={url}
              download
              className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-surface"
            >
              <FileText className="size-3.5" aria-hidden />
              {presentation.abstract_format ?? "PDF"}
            </a>
          </div>
        </div>

        <div className="mt-5 overflow-hidden border border-line bg-white">
          <iframe
            src={url}
            title={title ?? "Abstract"}
            className="h-[75vh] w-full border-0"
            loading="lazy"
            sandbox={isHtml ? "" : undefined}
          />
        </div>
        <p className="mt-3 text-xs text-ink-500">
          {locale === "en"
            ? "If the document does not render, use “Open in new tab”."
            : "Nếu tài liệu không hiển thị, dùng “Mở tab mới”."}
        </p>
      </Container>
    </div>
  );
}
