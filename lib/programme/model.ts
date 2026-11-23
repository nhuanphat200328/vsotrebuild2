import type { Locale } from "@/lib/i18n/config";

export type Translation = {
  locale: Locale;
  title: string | null;
  short_title?: string | null;
  status: string;
};

export type SessionPerson = {
  role: "chair" | "co_chair" | "discussant" | "moderator" | "presenter" | "invited_speaker";
  sort: number;
  people: {
    id: string;
    slug: string;
    full_name: string;
    display_name: string | null;
    title: string | null;
    institution: string | null;
    country: string | null;
  } | null;
};

export type Presentation = {
  id: string;
  start_time: string | null;
  end_time: string | null;
  sort: number;
  presentation_type: string | null;
  presentation_translations: Translation[];
  presentation_people: SessionPerson[];
};

export type ProgrammeSession = {
  id: string;
  conference_id?: string;
  start_time: string;
  end_time: string;
  program_number: string | null;
  is_separator: boolean;
  sort: number;
  session_translations: Translation[];
  rooms: { id: string; name_vi: string; name_en: string | null } | null;
  conference_dates: { id: string; date: string; label_vi: string | null; label_en: string | null };
  session_types: {
    code: string;
    name_vi: string | null;
    name_en: string | null;
    color: string | null;
  } | null;
  session_people: SessionPerson[];
  presentations: Presentation[];
};

export type ConferenceTranslation = {
  locale: Locale;
  name: string | null;
  short_name: string | null;
  intro: string | null;
  status: string;
};

export type ConferenceInfo = {
  id: string;
  slug: string;
  year: number;
  start_date: string | null;
  end_date: string | null;
  city: string | null;
  conference_translations: ConferenceTranslation[];
};

export type ProgrammeData = {
  conference: ConferenceInfo;
  dates: {
    id: string;
    date: string;
    label_vi: string | null;
    label_en: string | null;
    kind: string;
  }[];
  rooms: { id: string; name_vi: string; name_en: string | null; sort: number }[];
  types: {
    id: string;
    code: string;
    name_vi: string | null;
    name_en: string | null;
    is_break: boolean;
  }[];
  sessions: ProgrammeSession[];
};

export function pickTranslation(
  translations: Translation[] | null | undefined,
  locale: Locale,
  fallback: Locale = "vi",
) {
  if (!translations?.length) return null;
  return (
    translations.find((item) => item.locale === locale && item.status === "published") ??
    translations.find((item) => item.locale === fallback && item.status === "published") ??
    null
  );
}

export function sessionTitle(session: ProgrammeSession, locale: Locale) {
  return (
    pickTranslation(session.session_translations, locale)?.title ??
    "Nội dung đang được cập nhật"
  );
}

export function presentationTitle(presentation: Presentation, locale: Locale) {
  return (
    pickTranslation(presentation.presentation_translations, locale)?.title ??
    "Nội dung đang được cập nhật"
  );
}

export function typeName(session: ProgrammeSession, locale: Locale) {
  const type = session.session_types;
  if (!type) return null;
  return locale === "en" ? type.name_en || type.name_vi : type.name_vi || type.name_en;
}
