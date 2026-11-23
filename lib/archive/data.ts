import { createSupabasePublicClient } from "@/lib/supabase/public";

export type LegacySite = {
  slug: string;
  year: number | null;
  title: string | null;
  description: string | null;
  entry_path: string | null;
};

export async function getPublishedLegacySites(): Promise<LegacySite[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("legacy_sites")
    .select("slug, year, title, description, entry_path")
    .eq("status", "published")
    .order("year", { ascending: false });
  if (error) return [];
  return ((data ?? []) as unknown as LegacySite[]).filter(
    (site) => site.entry_path && site.slug !== "2026",
  );
}
