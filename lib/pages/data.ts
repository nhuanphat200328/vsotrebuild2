import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Locale } from "@/lib/i18n/config";

export type PageTranslation = {
  locale: Locale;
  title: string | null;
  excerpt: string | null;
  body: { text?: string } | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
};

export type PageRow = {
  id: string;
  slug: string;
  template: string;
  status: string;
  sort: number;
  published_at: string | null;
  page_translations: PageTranslation[];
};

export function bodyText(body: { text?: string } | null | undefined) {
  return body?.text ?? "";
}

export async function getPublishedPage(slug: string, locale: Locale) {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("pages")
    .select(
      "id, slug, template, status, published_at, page_translations(locale, title, excerpt, body, seo_title, seo_description, status)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const translations = (data.page_translations ?? []) as PageTranslation[];
  const exact = translations.find((t) => t.locale === locale && t.status === "published");
  const fallback = translations.find((t) => t.locale === "vi" && t.status === "published");
  const translation = exact ?? fallback;
  if (!translation) return null;

  return {
    page: data as unknown as PageRow,
    translation,
    isFallback: locale === "en" && !exact,
  };
}

export async function getAdminPages() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("pages")
    .select("id, slug, template, status, sort, published_at, page_translations(locale, title, status)")
    .is("deleted_at", null)
    .order("sort")
    .order("created_at");
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as PageRow[];
}

export async function getAdminPage(id: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("pages")
    .select(
      "id, slug, template, status, sort, published_at, page_translations(locale, title, excerpt, body, seo_title, seo_description, status)",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as unknown as PageRow | null;
}
