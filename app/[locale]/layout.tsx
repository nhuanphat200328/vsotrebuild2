import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/ui/json-ld";
import { organizationJsonLd } from "@/lib/utils/seo";
import { getPublishedLegacySites } from "@/lib/archive/data";
import { getLatestConferenceYear } from "@/lib/programme/data";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "vi");
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dict.hero.eyebrow} (VSOT)`,
      template: "%s | VSOT",
    },
    description: dict.hero.description,
    alternates: {
      canonical: `/${isLocale(locale) ? locale : "vi"}`,
      languages: { vi: "/vi", en: "/en" },
    },
    openGraph: {
      type: "website",
      siteName: "VSOT",
      title: `${dict.hero.eyebrow} (VSOT)`,
      description: dict.hero.description,
      locale: locale === "en" ? "en_US" : "vi_VN",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const [latestYear, archiveSites] = await Promise.all([
    getLatestConferenceYear(),
    getPublishedLegacySites(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={organizationJsonLd()} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        {typedLocale === "en" ? "Skip to content" : "Bỏ qua điều hướng"}
      </a>
      <SiteHeader
        locale={typedLocale}
        dict={dict}
        latestYear={latestYear}
        archiveSites={archiveSites}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter
        locale={typedLocale}
        dict={dict}
        latestYear={latestYear}
        archiveSites={archiveSites}
      />
    </div>
  );
}
