import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { isLocale, type Locale } from "@/lib/i18n/config";
import type { ConferenceInfo } from "@/lib/programme/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<import("next").Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Congresses" : "Hội nghị khoa học",
    description:
      locale === "en"
        ? "VSOT annual scientific congresses and published programmes."
        : "Hội nghị khoa học thường niên và chương trình đã công bố của VSOT.",
    alternates: { canonical: `/${locale}/hoi-nghi` },
  };
}

export default async function ConferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("conferences")
    .select("id, slug, year, start_date, end_date, city, conference_translations(locale, name, short_name, intro, status)")
    .eq("status", "published")
    .order("year", { ascending: false });

  if (error) throw new Error(error.message);
  const conferences = (data ?? []) as unknown as ConferenceInfo[];

  return (
    <div className="bg-surface pb-20">
      <Container className="py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          VSOT
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {locale === "en" ? "Congresses" : "Hội nghị khoa học"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
          {locale === "en"
            ? "VSOT annual scientific congresses and archived programmes."
            : "Hội nghị khoa học thường niên và chương trình các năm của Hội Ghép tạng Việt Nam."}
        </p>

        {conferences.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-line bg-white p-8 text-sm text-ink-500">
            {locale === "en" ? "No congress published yet." : "Chưa có hội nghị được công bố."}
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {conferences.map((conference) => {
              const translation =
                conference.conference_translations.find((t) => t.locale === locale) ??
                conference.conference_translations.find((t) => t.locale === "vi");
              return (
                <article
                  key={conference.id}
                  className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
                    <CalendarDays className="size-4" aria-hidden />
                    {conference.start_date?.slice(0, 4) ?? conference.year}
                  </div>
                  <h2 className="mt-3 text-xl font-extrabold text-ink-900">
                    {translation?.name ?? `VSOT ${conference.year}`}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
                    <MapPin className="size-4" aria-hidden />
                    {conference.city ?? ""}
                  </p>
                  <Link
                    href={`/${locale}/hoi-nghi/${conference.slug}`}
                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    {locale === "en" ? "Open congress" : "Xem hội nghị"}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
