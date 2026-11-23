import type { MetadataRoute } from "next";
import { createSupabasePublicClient } from "@/lib/supabase/public";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/vi`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/en`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/vi/hoi-nghi`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/vi/tin-tuc`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/vi/lien-he`, changeFrequency: "yearly", priority: 0.4 },
  ];

  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase
      .from("conferences")
      .select("slug")
      .eq("status", "published")
      .order("year", { ascending: false });

    for (const conference of data ?? []) {
      const year = conference.slug as string;
      for (const locale of ["vi", "en"] as const) {
        entries.push(
          { url: `${base}/${locale}/hoi-nghi/${year}`, changeFrequency: "weekly", priority: 0.9 },
          {
            url: `${base}/${locale}/hoi-nghi/${year}/chuong-trinh`,
            changeFrequency: "daily",
            priority: 0.9,
          },
          {
            url: `${base}/${locale}/hoi-nghi/${year}/chuong-trinh/tong-quan`,
            changeFrequency: "weekly",
            priority: 0.7,
          },
          {
            url: `${base}/${locale}/hoi-nghi/${year}/dien-gia`,
            changeFrequency: "weekly",
            priority: 0.7,
          },
        );
      }
    }
  } catch {
    // Sitemap still returns the stable public routes when the database is unavailable.
  }

  return entries;
}
