import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getPublishedLegacySites } from "@/lib/archive/data";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Past congresses" : "Hội nghị các năm",
    description:
      locale === "en"
        ? "Archive of previous VSOT scientific congresses."
        : "Kho lưu trữ các kỳ hội nghị khoa học trước của VSOT.",
    alternates: { canonical: `/${locale}/hoi-nghi/cac-nam-truoc` },
  };
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const sites = await getPublishedLegacySites();

  return (
    <div className="bg-white pb-20">
      <Container className="py-12">
        <Link
          href={`/${locale}/hoi-nghi`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {locale === "en" ? "Congresses" : "Hội nghị"}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {locale === "en" ? "Past congresses" : "Hội nghị các năm"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
          {locale === "en"
            ? "Programmes and materials preserved from previous VSOT congresses. Links open the archived website of each year."
            : "Chương trình và tư liệu được bảo toàn từ các kỳ hội nghị trước của VSOT. Liên kết mở website lưu trữ của từng năm."}
        </p>

        {sites.length === 0 ? (
          <p className="mt-10 border-t border-line pt-6 text-sm text-ink-500">
            {locale === "en" ? "Archive is being updated." : "Kho lưu trữ đang được cập nhật."}
          </p>
        ) : (
          <div className="mt-10 border-t-2 border-brand-700">
            {sites.map((site) => (
              <a
                key={site.slug}
                href={site.entry_path ?? "#"}
                className="grid gap-2 border-b border-line py-5 transition hover:bg-surface sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
              >
                <span className="text-2xl font-extrabold text-brand-800">{site.year}</span>
                <span>
                  <span className="block text-base font-bold text-ink-900">
                    {site.title ?? `VSOT ${site.year}`}
                  </span>
                  {site.description ? (
                    <span className="mt-1 block text-sm text-ink-500">{site.description}</span>
                  ) : null}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700">
                  {locale === "en" ? "Open archive" : "Mở lưu trữ"}
                  <ExternalLink className="size-3.5" aria-hidden />
                </span>
              </a>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
