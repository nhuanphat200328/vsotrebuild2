"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isIP } from "node:net";

const schema = z.object({
  full_name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(300),
  phone: z.string().trim().max(50).optional(),
  organization: z.string().trim().max(300).optional(),
  subject: z.string().trim().max(300).optional(),
  message: z.string().trim().min(10).max(5000),
});

export async function submitContact(formData: FormData) {
  const rawLocale = String(formData.get("locale") ?? "vi");
  const locale = rawLocale === "en" ? "en" : "vi";
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) {
    redirect(`/${locale}/lien-he?sent=1`);
  }

  const parsed = schema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    organization: formData.get("organization") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirect(`/${locale}/lien-he?error=invalid`);
  }

  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for") ?? "";
  const candidate = forwarded.split(",")[0]?.trim() || "";
  const ip = candidate && isIP(candidate) ? candidate : null;

  if (ip) {
    const admin = createSupabaseAdminClient();
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("contact_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) redirect(`/${locale}/lien-he?error=rate`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_requests").insert({
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    organization: parsed.data.organization ?? null,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
    locale,
    status: "new",
    ip,
    user_agent: (requestHeaders.get("user-agent") ?? "").slice(0, 500),
  });

  if (error) {
    redirect(`/${locale}/lien-he?error=server`);
  }

  redirect(`/${locale}/lien-he?sent=1`);
}
