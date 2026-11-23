export type MediaRef = {
  file_path?: string | null;
  storage_bucket?: string | null;
  storage_path?: string | null;
};

const publicBucket = "media-public";

/**
 * Prefer the Supabase Storage public URL when metadata has a storage path.
 * Falls back to the local public file so the site still works without Storage.
 */
export function mediaUrl(ref: MediaRef): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (base && ref.storage_path) {
    const bucket = ref.storage_bucket || publicBucket;
    const path = ref.storage_path
      .split("/")
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`;
  }
  return ref.file_path ?? "#";
}
