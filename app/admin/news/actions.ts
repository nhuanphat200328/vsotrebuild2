"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";
import { normalizeSearch } from "@/lib/utils/search";

const status = z.enum(["draft", "published", "archived"]);
const tStatus = z.enum(["missing", "draft", "pending_review", "published", "archived"]);

const newsSchema = z.object({
  slug: z.string().trim().max(200).optional(),
  category_id: z.string().uuid().optional(),
  status,
  is_featured: z.coerce.boolean().default(false),
  published_at: z.string().optional(),
  vi_title: z.string().trim().min(1).max(300),
  vi_excerpt: z.string().trim().max(500).optional(),
  vi_body: z.string().max(100000).optional(),
  vi_status: tStatus,
  en_title: z.string().trim().max(300).optional(),
  en_excerpt: z.string().trim().max(500).optional(),
  en_body: z.string().max(100000).optional(),
  en_status: tStatus,
});

function slugify(value: string) {
  return normalizeSearch(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function parseNews(formData: FormData) {
  return newsSchema.safeParse({
    slug: formData.get("slug") || undefined,
    category_id: formData.get("category_id") || undefined,
    status: formData.get("status"),
    is_featured: formData.get("is_featured") === "1",
    published_at: formData.get("published_at") || undefined,
    vi_title: formData.get("vi_title"),
    vi_excerpt: formData.get("vi_excerpt") || undefined,
    vi_body: formData.get("vi_body") || undefined,
    vi_status: formData.get("vi_status"),
    en_title: formData.get("en_title") || undefined,
    en_excerpt: formData.get("en_excerpt") || undefined,
    en_body: formData.get("en_body") || undefined,
    en_status: formData.get("en_status"),
  });
}

async function saveNewsTranslations(newsId: string, d: z.infer<typeof newsSchema>) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("news_translations").upsert(
    [
      {
        news_id: newsId,
        locale: "vi",
        title: d.vi_title,
        excerpt: d.vi_excerpt ?? null,
        body: { text: d.vi_body ?? "" },
        status: d.vi_status,
      },
      {
        news_id: newsId,
        locale: "en",
        title: d.en_title || null,
        excerpt: d.en_excerpt ?? null,
        body: { text: d.en_body ?? "" },
        status: d.en_title ? d.en_status : "missing",
      },
    ],
    { onConflict: "news_id,locale" },
  );
  if (error) throw new Error(error.message);
}

function publishedAt(value: string | undefined, status: string) {
  if (status !== "published") return null;
  if (value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date().toISOString();
}

export async function createNewsAction(formData: FormData) {
  const { access } = await requirePermission("news.write", "/admin/news");
  const parsed = parseNews(formData);
  if (!parsed.success) redirect("/admin/news/new?error=invalid");
  if (
    (parsed.data.status === "published" || parsed.data.vi_status === "published" || parsed.data.en_status === "published") &&
    !access.permissions.has("news.publish")
  ) {
    redirect("/admin/news/new?error=publish");
  }
  const slug = slugify(parsed.data.slug || parsed.data.vi_title);
  if (!slug) redirect("/admin/news/new?error=slug");

  const admin = createSupabaseAdminClient();
  const { data: created, error } = await admin
    .from("news")
    .insert({
      slug,
      category_id: parsed.data.category_id ?? null,
      status: parsed.data.status,
      is_featured: parsed.data.is_featured,
      published_at: publishedAt(parsed.data.published_at, parsed.data.status),
    })
    .select("id")
    .single();
  if (error || !created) {
    redirect(`/admin/news/new?error=${error?.code === "23505" ? "slug" : "server"}`);
  }
  await saveNewsTranslations(created.id, parsed.data);
  revalidatePath("/", "layout");
  redirect(`/admin/news/${created.id}?created=1`);
}

export async function updateNewsAction(formData: FormData) {
  const { access } = await requirePermission("news.write", "/admin/news");
  const id = String(formData.get("id") ?? "");
  const parsed = parseNews(formData);
  if (!id || !parsed.success) redirect(`/admin/news/${id}?error=invalid`);
  if (
    (parsed.data.status === "published" || parsed.data.vi_status === "published" || parsed.data.en_status === "published") &&
    !access.permissions.has("news.publish")
  ) {
    redirect(`/admin/news/${id}?error=publish`);
  }
  const slug = slugify(parsed.data.slug || parsed.data.vi_title);
  if (!slug) redirect(`/admin/news/${id}?error=slug`);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("news")
    .update({
      slug,
      category_id: parsed.data.category_id ?? null,
      status: parsed.data.status,
      is_featured: parsed.data.is_featured,
      published_at: publishedAt(parsed.data.published_at, parsed.data.status),
    })
    .eq("id", id);
  if (error) redirect(`/admin/news/${id}?error=${error.code === "23505" ? "slug" : "server"}`);
  await saveNewsTranslations(id, parsed.data);
  revalidatePath("/", "layout");
  redirect(`/admin/news/${id}?saved=1`);
}

export async function deleteNewsAction(formData: FormData) {
  await requirePermission("news.delete", "/admin/news");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/news");
  const admin = createSupabaseAdminClient();
  await admin
    .from("news")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);
  revalidatePath("/", "layout");
  redirect("/admin/news?deleted=1");
}

export async function createCategoryAction(formData: FormData) {
  const { access } = await requirePermission("news.write", "/admin/news/categories");
  const canPublish = access.permissions.has("news.publish");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!name || !slug) redirect("/admin/news/categories?error=invalid");
  const admin = createSupabaseAdminClient();
  const { data: created, error } = await admin
    .from("news_categories")
    .insert({ slug, status: canPublish ? "published" : "draft", sort: 0 })
    .select("id")
    .single();
  if (error || !created) redirect("/admin/news/categories?error=server");
  await admin.from("news_category_translations").insert({
    category_id: created.id,
    locale: "vi",
    name,
    status: canPublish ? "published" : "draft",
  });
  revalidatePath("/", "layout");
  redirect("/admin/news/categories?saved=1");
}
