import type { Locale } from "@/lib/i18n/config";

export function conferenceName(
  conference: {
    year: number;
    conference_translations: { locale: Locale; name: string | null; short_name: string | null; status: string }[];
  },
  locale: Locale,
) {
  const vi = conference.conference_translations.find((t) => t.locale === "vi");
  const en = conference.conference_translations.find((t) => t.locale === "en");
  const chosen = locale === "en" ? en ?? vi : vi ?? en;
  return chosen?.name ?? `VSOT ${conference.year}`;
}

export function conferenceIntro(
  conference: {
    conference_translations: { locale: Locale; intro: string | null; status: string }[];
  },
  locale: Locale,
) {
  const vi = conference.conference_translations.find((t) => t.locale === "vi");
  const en = conference.conference_translations.find((t) => t.locale === "en");
  return (locale === "en" ? en ?? vi : vi ?? en)?.intro ?? null;
}

export function hasEnglishTranslation(
  conference: { conference_translations: { locale: Locale; status: string }[] },
) {
  return conference.conference_translations.some(
    (t) => t.locale === "en" && t.status === "published",
  );
}
