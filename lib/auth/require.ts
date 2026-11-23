import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth/access";

export async function requireAdmin(next = "/admin") {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/vi/dang-nhap?next=${encodeURIComponent(next)}`);
  const access = await getUserAccess(user.id);
  if (access.roles.length === 0) throw new Error("Forbidden");
  return { user, access };
}

export async function requirePermission(code: string, next = "/admin") {
  const result = await requireAdmin(next);
  if (!result.access.permissions.has(code)) throw new Error("Forbidden");
  return result;
}
