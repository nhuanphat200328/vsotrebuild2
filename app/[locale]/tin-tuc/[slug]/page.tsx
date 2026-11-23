import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { Container } from "@/components/ui/container";
import {
  getPublishedNewsBySlug,
  newsCategoryName,
  publicAttachments,
} from "@/lib/news/data";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const result = await getPublishedNewsBySlug(slug, rawLocale as Locale);
  return {
    title: result?.translation.title ?? undefined,
    description: result?.translation.excerpt ?? undefined,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const result = await getPublishedNewsBySlug(slug, locale);
  if (!result) notFound();
  const { news, translation, isFallback } = result;
  const paragraphs = (translation.body?.text ?? "").split(/\n{2,}/).filter(Boolean);
  const category = newsCategoryName(news, locale);
  const attachments = publicAttachments(news);

  return (
    <div className="bg-white pb-20">
      <Container className="max-w-3xl py-10">
        <Link href={`/${locale}/tin-tuc`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
          <ArrowLeft className="size-4" aria-hidden />
          {locale === "en" ? "News" : "Tin tức"}
        </Link>
        {isFallback ? (
          <p className="mt-5 rounded-lg border border-gold-300 bg-gold-100 px-4 py-2.5 text-sm text-ink-700">
            English translation is being updated. Showing Vietnamese content.
          </p>
        ) : null}
        {category ? (
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            {category}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{translation.title}</h1>
        {news.published_at ? (
          <p className="mt-2 text-xs font-semibold text-ink-500">
            {new Date(news.published_at).toLocaleDateString(locale === "en" ? "en-GB" : "vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            })}
          </p>
        ) : null}
        {translation.excerpt ? <p className="mt-4 text-lg leading-relaxed text-ink-500">{translation.excerpt}</p> : null}
        <div className="mt-7 space-y-4 text-base leading-relaxed text-ink-700">
          {paragraphs.length ? paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">{paragraph}</p>
          )) : <p className="text-ink-500">Nội dung đang được cập nhật.</p>}
        </div>

        {attachments.length ? (
          <div className="mt-8 border-t border-line pt-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
              {locale === "en" ? "Attachments" : "Tệp đính kèm"}
            </h2>
            <ul className="mt-3 grid gap-2">
              {attachments.map((attachment) => (
                <li key={attachment.file_path}>
                  <a
                    href={attachment.file_path}
                    className="inline-flex items-center gap-2 border border-line px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-surface"
                    download
                  >
                    <Download className="size-4" aria-hidden />
                    {locale === "en"
                      ? attachment.title_en || attachment.title_vi
                      : attachment.title_vi || attachment.title_en}
                    <span className="text-xs font-normal text-ink-500">
                      ({attachment.file_format ?? "PDF"})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
