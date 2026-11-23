"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/next-path";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  const rawLocale = String(formData.get("locale") ?? "vi");
  const locale = rawLocale === "en" ? "en" : "vi";

  if (!email || !password) {
    redirect(`/${locale}/dang-nhap?error=missing`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/${locale}/dang-nhap?error=invalid`);
  }

  redirect(next);
}
