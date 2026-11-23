import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";
import { Container } from "@/components/ui/container";
import {
  getPublishedNews,
  newsCategoryName,
  publicAttachments,
  type NewsRow,
} from "@/lib/news/data";
import { isLocale, type Locale } from "@/lib/i18n/config";

function pick(item: NewsRow, locale: Locale) {
  return (
    item.news_translations.find((t) => t.locale === locale && t.status === "published") ??
    item.news_translations.find((t) => t.locale === "vi" && t.status === "published")
  );
}

function formatNewsDate(value: string | null, locale: Locale) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(locale === "en" ? "en-GB" : "vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "News" : "Tin tức",
    description:
      locale === "en"
        ? "News, announcements and documents from VSOT."
        : "Tin tức, thông báo và tài liệu của Hội Ghép tạng Việt Nam.",
    alternates: { canonical: `/${locale}/tin-tuc` },
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const news = await getPublishedNews(locale);

  return (
    <div className="bg-white pb-20">
      <Container className="py-12">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">VSOT</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {locale === "en" ? "News & announcements" : "Tin tức & thông báo"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            {locale === "en"
              ? "Updates, announcements and documents from the Vietnam Society of Organ Transplantation."
              : "Tin tức, thông báo và tài liệu của Hội Ghép tạng Việt Nam."}
          </p>
        </div>

        {news.length === 0 ? (
          <p className="mt-10 border-t border-line pt-6 text-sm text-ink-500">
            {locale === "en" ? "No news published yet." : "Chưa có tin tức được công bố."}
          </p>
        ) : (
          <div className="mt-10 border-t-2 border-brand-700">
            {news.map((item) => {
              const translation = pick(item, locale);
              if (!translation) return null;
              const category = newsCategoryName(item, locale);
              const attachments = publicAttachments(item);
              const date = formatNewsDate(item.published_at, locale);
              const fallback = locale === "en" && translation.locale !== "en";
              return (
                <article
                  key={item.id}
                  className="grid gap-3 border-b border-line py-6 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8"
                >
                  <div className="text-xs text-ink-500">
                    {category ? (
                      <p className="font-bold uppercase tracking-[0.14em] text-brand-600">
                        {category}
                      </p>
                    ) : null}
                    {date ? <p className="mt-1 font-semibold">{date}</p> : null}
                    {fallback ? (
                      <p className="mt-1 text-[11px] text-gold-600">EN translation pending</p>
                    ) : null}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold leading-snug text-ink-900 sm:text-xl">
                      <Link
                        href={`/${locale}/tin-tuc/${item.slug}`}
                        className="hover:text-brand-700"
                      >
                        {translation.title}
                      </Link>
                    </h2>
                    {translation.excerpt ? (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-600">
                        {translation.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/${locale}/tin-tuc/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline"
                      >
                        {locale === "en" ? "Read more" : "Xem chi tiết"}
                        <ArrowRight className="size-3.5" aria-hidden />
                      </Link>
                      {attachments.map((attachment) => (
                        <a
                          key={attachment.file_path}
                          href={attachment.file_path}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 hover:text-brand-700"
                          download
                        >
                          <Download className="size-3.5" aria-hidden />
                          {attachment.file_format ?? "PDF"}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
