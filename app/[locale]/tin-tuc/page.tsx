import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getPublishedNews } from "@/lib/news/data";
import { isLocale, type Locale } from "@/lib/i18n/config";

function pick(item: Awaited<ReturnType<typeof getPublishedNews>>[number], locale: Locale) {
  return (
    item.news_translations.find((t) => t.locale === locale && t.status === "published") ??
    item.news_translations.find((t) => t.locale === "vi" && t.status === "published")
  );
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
    <div className="bg-surface pb-20">
      <Container className="py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">
          {locale === "en" ? "News" : "Tin tức"}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {locale === "en" ? "Updates from VSOT." : "Tin tức và hoạt động của Hội Ghép tạng Việt Nam."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {news.map((item) => {
            const t = pick(item, locale);
            if (!t) return null;
            const fallback = locale === "en" && t.locale !== "en";
            return (
              <article key={item.id} className="rounded-xl border border-line bg-white p-5">
                <p className="text-xs font-semibold text-ink-500">
                  {item.published_at ? new Date(item.published_at).toLocaleDateString(locale === "en" ? "en-GB" : "vi-VN") : ""}
                  {fallback ? " · English translation is being updated" : ""}
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-ink-900">
                  <Link href={`/${locale}/tin-tuc/${item.slug}`} className="hover:text-brand-700">
                    {t.title}
                  </Link>
                </h2>
                {t.excerpt ? <p className="mt-2 text-sm leading-relaxed text-ink-500">{t.excerpt}</p> : null}
              </article>
            );
          })}
        </div>
        {news.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-line bg-white p-8 text-sm text-ink-500">
            {locale === "en" ? "No news published yet." : "Chưa có tin tức được công bố."}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
