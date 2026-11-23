"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";

const MAX_BYTES = 3.5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

function safeName(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function uploadMediaAction(formData: FormData) {
  const { user } = await requirePermission("media.upload", "/admin/media");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=file");
  if (file.size > MAX_BYTES) redirect("/admin/media?error=size");
  if (!ALLOWED.has(file.type)) redirect("/admin/media?error=type");

  const admin = createSupabaseAdminClient();
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from("media-public")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (uploadError) redirect("/admin/media?error=server");

  const { error } = await admin.from("media").insert({
    bucket: "media-public",
    path,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    alt_vi: String(formData.get("alt_vi") ?? "") || null,
    alt_en: String(formData.get("alt_en") ?? "") || null,
    visibility: "public",
    uploaded_by: user.id,
  });
  if (error) {
    await admin.storage.from("media-public").remove([path]);
    redirect("/admin/media?error=server");
  }

  revalidatePath("/admin/media");
  redirect("/admin/media?saved=1");
}

export async function deleteMediaAction(formData: FormData) {
  await requirePermission("media.delete", "/admin/media");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/media");
  const admin = createSupabaseAdminClient();
  const { data: media } = await admin
    .from("media")
    .select("id, bucket, path")
    .eq("id", id)
    .maybeSingle();
  if (!media) redirect("/admin/media?error=missing");

  const references = await Promise.all([
    admin.from("news").select("id", { count: "exact", head: true }).eq("cover_media_id", id),
    admin.from("people").select("id", { count: "exact", head: true }).eq("photo_media_id", id),
    admin.from("conferences").select("id", { count: "exact", head: true }).or(`banner_media_id.eq.${id},logo_media_id.eq.${id}`),
    admin.from("conference_documents").select("id", { count: "exact", head: true }).eq("media_id", id),
  ]);
  if (references.some((r) => (r.count ?? 0) > 0)) {
    redirect("/admin/media?error=in_use");
  }

  await admin.storage.from(media.bucket).remove([media.path]);
  await admin.from("media").delete().eq("id", id);
  revalidatePath("/admin/media");
  redirect("/admin/media?deleted=1");
}
