import { createSupabasePublicClient } from "@/lib/supabase/public";

export type ConferenceDocument = {
  id: string;
  doc_type: string;
  title_vi: string | null;
  title_en: string | null;
  description_vi: string | null;
  description_en: string | null;
  file_path: string | null;
  file_format: string | null;
  storage_bucket: string | null;
  storage_path: string | null;
  source_url: string | null;
  sort: number;
};

export async function getConferenceDocuments(
  conferenceId: string,
  docTypes?: string[],
): Promise<ConferenceDocument[]> {
  const supabase = createSupabasePublicClient();
  let query = supabase
    .from("conference_documents")
    .select(
      "id, doc_type, title_vi, title_en, description_vi, description_en, file_path, file_format, storage_bucket, storage_path, source_url, sort",
    )
    .eq("conference_id", conferenceId)
    .eq("is_public", true)
    .not("file_path", "is", null)
    .order("doc_type")
    .order("sort");
  if (docTypes?.length) query = query.in("doc_type", docTypes);
  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as unknown as ConferenceDocument[];
}
