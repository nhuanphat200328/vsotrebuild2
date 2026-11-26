import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Locale } from "@/lib/i18n/config";

export type NewsAttachment = {
  title_vi: string | null;
  title_en: string | null;
  file_path: string;
  file_format: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  source_url: string | null;
  sort: number;
  is_public: boolean;
};

export type NewsTranslation = {
  locale: Locale;
  title: string | null;
  excerpt: string | null;
  body: { text?: string } | null;
  status: string;
};

export type NewsCategory = {
  slug: string;
  news_category_translations: { locale: string; name: string | null }[];
};

export type NewsRow = {
  id: string;
  slug: string;
  status: string;
  published_at: string | null;
  is_featured: boolean;
  category_id: string | null;
  source_url: string | null;
  news_translations: NewsTranslation[];
  news_categories?: NewsCategory | null;
  news_attachments?: NewsAttachment[];
};

const newsSelect =
  "id, slug, status, published_at, is_featured, category_id, source_url, news_translations(locale, title, excerpt, body, status), news_categories(slug, news_category_translations(locale, name)), news_attachments(title_vi, title_en, file_path, file_format, storage_bucket, storage_path, source_url, sort, is_public)";

export async function getPublishedNews(locale: Locale, limit = 50) {
  const supabase = createSupabasePublicClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("news")
    .select(newsSelect)
    .eq("status", "published")
    .is("deleted_at", null)
    .or(`published_at.is.null,published_at.lte.${now}`)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as NewsRow[];
}

export async function getPublishedNewsBySlug(slug: string, locale: Locale) {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("news")
    .select(newsSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as unknown as NewsRow;
  const translations = row.news_translations ?? [];
  const exact = translations.find((t) => t.locale === locale && t.status === "published");
  const fallback = translations.find((t) => t.locale === "vi" && t.status === "published");
  const translation = exact ?? fallback;
  if (!translation) return null;
  return { news: row, translation, isFallback: locale === "en" && !exact };
}

export async function getAdminNews() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("news")
    .select("id, slug, status, published_at, is_featured, category_id, source_url, news_translations(locale, title, status)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as NewsRow[];
}

export async function getAdminNewsItem(id: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("news")
    .select("id, slug, status, published_at, is_featured, category_id, source_url, news_translations(locale, title, excerpt, body, status)")
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

export function newsCategoryName(news: NewsRow, locale: Locale) {
  const translations = news.news_categories?.news_category_translations ?? [];
  const exact = translations.find((t) => t.locale === locale)?.name;
  const fallback = translations.find((t) => t.locale === "vi")?.name;
  return exact ?? fallback ?? null;
}

export function publicAttachments(news: NewsRow) {
  return [...(news.news_attachments ?? [])]
    .filter((attachment) => attachment.is_public && attachment.file_path)
    .sort((a, b) => a.sort - b.sort);
}
