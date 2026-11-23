import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Locale } from "@/lib/i18n/config";

export type NewsTranslation = {
  locale: Locale;
  title: string | null;
  excerpt: string | null;
  body: { text?: string } | null;
  status: string;
};

export type NewsRow = {
  id: string;
  slug: string;
  status: string;
  published_at: string | null;
  is_featured: boolean;
  category_id: string | null;
  news_translations: NewsTranslation[];
  news_categories?: { slug: string; news_category_translations: { locale: string; name: string | null }[] } | null;
};

export async function getPublishedNews(locale: Locale, limit = 50) {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, slug, status, published_at, is_featured, news_translations(locale, title, excerpt, body, status)")
    .eq("status", "published")
    .is("deleted_at", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as NewsRow[];
}

export async function getPublishedNewsBySlug(slug: string, locale: Locale) {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, slug, status, published_at, news_translations(locale, title, excerpt, body, status)")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const translations = (data.news_translations ?? []) as NewsTranslation[];
  const exact = translations.find((t) => t.locale === locale && t.status === "published");
  const fallback = translations.find((t) => t.locale === "vi" && t.status === "published");
  const translation = exact ?? fallback;
  if (!translation) return null;
  return { news: data as unknown as NewsRow, translation, isFallback: locale === "en" && !exact };
}

export async function getAdminNews() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("news")
    .select("id, slug, status, published_at, is_featured, category_id, news_translations(locale, title, status)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as NewsRow[];
}

export async function getAdminNewsItem(id: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("news")
    .select("id, slug, status, published_at, is_featured, category_id, news_translations(locale, title, excerpt, body, status)")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as unknown as NewsRow | null;
}

export async function getNewsCategories() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("news_categories")
    .select("id, slug, status, sort, news_category_translations(locale, name, status)")
    .order("sort");
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as {
    id: string;
    slug: string;
    status: string;
    sort: number;
    news_category_translations: { locale: string; name: string | null; status: string }[];
  }[];
}
