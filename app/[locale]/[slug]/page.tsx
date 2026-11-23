import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { bodyText, getPublishedPage } from "@/lib/pages/data";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const result = await getPublishedPage(slug, rawLocale as Locale);
  if (!result) return {};
  const { translation } = result;
  return {
    title: translation.seo_title || translation.title || undefined,
    description: translation.seo_description || translation.excerpt || undefined,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const result = await getPublishedPage(slug, locale);
  if (!result) notFound();

  const { translation, isFallback } = result;
  const text = bodyText(translation.body);
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="bg-white pb-20">
      <Container className="max-w-3xl py-12">
        {isFallback ? (
          <p className="mb-6 rounded-lg border border-gold-300 bg-gold-100 px-4 py-2.5 text-sm text-ink-700">
            English translation is being updated. Showing Vietnamese content.
          </p>
        ) : null}
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {translation.title}
        </h1>
        {translation.excerpt ? (
          <p className="mt-3 text-lg leading-relaxed text-ink-500">{translation.excerpt}</p>
        ) : null}
        <div className="mt-8 space-y-4 text-base leading-relaxed text-ink-700">
          {paragraphs.length ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-ink-500">Nội dung đang được cập nhật.</p>
          )}
        </div>
      </Container>
    </div>
  );
}
