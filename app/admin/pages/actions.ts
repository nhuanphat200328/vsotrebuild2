"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";
import { normalizeSearch } from "@/lib/utils/search";

const translationStatus = z.enum(["missing", "draft", "pending_review", "published", "archived"]);
const pageStatus = z.enum(["draft", "published", "archived"]);

const schema = z.object({
  slug: z.string().trim().max(200).optional(),
  template: z.string().trim().max(50).default("default"),
  status: pageStatus,
  sort: z.coerce.number().int().min(0).max(9999).default(0),
  vi_title: z.string().trim().min(1).max(300),
  vi_excerpt: z.string().trim().max(500).optional(),
  vi_body: z.string().max(50000).optional(),
  vi_seo_title: z.string().trim().max(200).optional(),
  vi_seo_description: z.string().trim().max(300).optional(),
  vi_status: translationStatus,
  en_title: z.string().trim().max(300).optional(),
  en_excerpt: z.string().trim().max(500).optional(),
  en_body: z.string().max(50000).optional(),
  en_seo_title: z.string().trim().max(200).optional(),
  en_seo_description: z.string().trim().max(300).optional(),
  en_status: translationStatus,
});

const RESERVED_SLUGS = new Set([
  "tin-tuc", "hoi-nghi", "lien-he", "dang-nhap", "admin", "api",
  "legacy", "archive", "hoi-vien", "tai-lieu", "chuyen-de",
]);

function slugify(value: string) {
  return normalizeSearch(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function validateSlug(slug: string) {
  return Boolean(slug) && !RESERVED_SLUGS.has(slug);
}

function parse(formData: FormData) {
  return schema.safeParse({
    slug: formData.get("slug") || undefined,
    template: formData.get("template") || "default",
    status: formData.get("status"),
    sort: formData.get("sort") || 0,
    vi_title: formData.get("vi_title"),
    vi_excerpt: formData.get("vi_excerpt") || undefined,
    vi_body: formData.get("vi_body") || undefined,
    vi_seo_title: formData.get("vi_seo_title") || undefined,
    vi_seo_description: formData.get("vi_seo_description") || undefined,
    vi_status: formData.get("vi_status"),
    en_title: formData.get("en_title") || undefined,
    en_excerpt: formData.get("en_excerpt") || undefined,
    en_body: formData.get("en_body") || undefined,
    en_seo_title: formData.get("en_seo_title") || undefined,
    en_seo_description: formData.get("en_seo_description") || undefined,
    en_status: formData.get("en_status"),
  });
}

async function saveTranslations(pageId: string, data: z.infer<typeof schema>) {
  const admin = createSupabaseAdminClient();
  const rows = [
    {
      page_id: pageId,
      locale: "vi",
      title: data.vi_title,
      excerpt: data.vi_excerpt ?? null,
      body: { text: data.vi_body ?? "" },
      seo_title: data.vi_seo_title ?? null,
      seo_description: data.vi_seo_description ?? null,
      status: data.vi_status,
    },
    {
      page_id: pageId,
      locale: "en",
      title: data.en_title || null,
      excerpt: data.en_excerpt ?? null,
      body: { text: data.en_body ?? "" },
      seo_title: data.en_seo_title ?? null,
      seo_description: data.en_seo_description ?? null,
      status: data.en_title ? data.en_status : "missing",
    },
  ];
  const { error } = await admin
    .from("page_translations")
    .upsert(rows, { onConflict: "page_id,locale" });
  if (error) throw new Error(error.message);
}

function pageUrl(id: string, query = "") {
  return `/admin/pages/${id}${query}`;
}

function requirePublish(access: { permissions: Set<string> }, status: string, viStatus: string, enStatus: string) {
  const wantsPublish =
    status === "published" || viStatus === "published" || enStatus === "published";
  return wantsPublish && !access.permissions.has("page.publish");
}

export async function createPageAction(formData: FormData) {
  const { access } = await requirePermission("page.write", "/admin/pages");
  const parsed = parse(formData);
  if (!parsed.success) redirect("/admin/pages/new?error=invalid");
  if (requirePublish(access, parsed.data.status, parsed.data.vi_status, parsed.data.en_status)) {
    redirect("/admin/pages/new?error=publish");
  }

  const slug = slugify(parsed.data.slug || parsed.data.vi_title);
  if (!validateSlug(slug)) redirect("/admin/pages/new?error=slug");

  const admin = createSupabaseAdminClient();
  const { data: created, error } = await admin
    .from("pages")
    .insert({
      slug,
      template: parsed.data.template,
      status: parsed.data.status,
      sort: parsed.data.sort,
      published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();
  if (error || !created) {
    const message = error?.code === "23505" ? "slug" : "server";
    redirect(`/admin/pages/new?error=${message}`);
  }

  await saveTranslations(created.id, parsed.data);
  revalidatePath("/", "layout");
  redirect(pageUrl(created.id, "?created=1"));
}

export async function updatePageAction(formData: FormData) {
  const { access } = await requirePermission("page.write", "/admin/pages");
  const id = String(formData.get("id") ?? "");
  const parsed = parse(formData);
  if (!id || !parsed.success) redirect(pageUrl(id, "?error=invalid"));
  if (requirePublish(access, parsed.data.status, parsed.data.vi_status, parsed.data.en_status)) {
    redirect(pageUrl(id, "?error=publish"));
  }

  const slug = slugify(parsed.data.slug || parsed.data.vi_title);
  if (!validateSlug(slug)) redirect(pageUrl(id, "?error=slug"));

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("pages")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();
  const { error } = await admin
    .from("pages")
    .update({
      slug,
      template: parsed.data.template,
      status: parsed.data.status,
      sort: parsed.data.sort,
      published_at:
        parsed.data.status === "published"
          ? existing?.published_at ?? new Date().toISOString()
          : null,
    })
    .eq("id", id);
  if (error) {
    const message = error.code === "23505" ? "slug" : "server";
    redirect(pageUrl(id, `?error=${message}`));
  }

  await saveTranslations(id, parsed.data);
  revalidatePath("/", "layout");
  redirect(pageUrl(id, "?saved=1"));
}

export async function deletePageAction(formData: FormData) {
  await requirePermission("page.delete", "/admin/pages");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/pages");
  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("pages")
    .update({
      deleted_at: new Date().toISOString(),
      status: "archived",
      slug: `deleted-${id}`,
    })
    .eq("id", id);
  if (error) redirect(pageUrl(id, "?error=server"));
  revalidatePath("/", "layout");
  redirect("/admin/pages?deleted=1");
}
