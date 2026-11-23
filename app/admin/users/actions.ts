"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";

const createSchema = z.object({
  email: z.string().email(),
  full_name: z.string().trim().min(2).max(200),
  password: z.string().min(12).max(200),
  role: z.enum(["admin", "editor", "viewer"]),
});

export async function createUserAction(formData: FormData) {
  const { user } = await requirePermission("user.invite", "/admin/users");
  const parsed = createSchema.safeParse({
    email: formData.get("email"),
    full_name: formData.get("full_name"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) redirect("/admin/users?error=invalid");

  const admin = createSupabaseAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { vsot_invite: "true", full_name: parsed.data.full_name },
  });
  if (error || !created.user) redirect("/admin/users?error=create");

  const { data: role } = await admin.from("roles").select("id").eq("code", parsed.data.role).maybeSingle();
  if (role) {
    await admin.from("user_roles").insert({ user_id: created.user.id, role_id: role.id });
  }
  await admin.from("audit_logs").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "user.create",
    entity: "profiles",
    entity_id: created.user.id,
  });
  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function assignRoleAction(formData: FormData) {
  const { user, access } = await requirePermission("user.role.update", "/admin/users");
  const targetId = String(formData.get("user_id") ?? "");
  const roleCode = String(formData.get("role") ?? "");
  if (!targetId || !["admin", "editor", "viewer"].includes(roleCode)) {
    redirect("/admin/users?error=invalid");
  }
  if (!access.permissions.has("user.role.update")) redirect("/admin/users?error=forbidden");

  const admin = createSupabaseAdminClient();
  const { data: targetRoles } = await admin
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", targetId);
  const targetIsSuper = (targetRoles ?? []).some(
    (row) => (row.roles as unknown as { code: string } | null)?.code === "super_admin",
  );
  if (targetIsSuper) redirect("/admin/users?error=super");

  const { data: role } = await admin.from("roles").select("id").eq("code", roleCode).maybeSingle();
  if (!role) redirect("/admin/users?error=role");
  await admin.from("user_roles").delete().eq("user_id", targetId);
  await admin.from("user_roles").insert({ user_id: targetId, role_id: role.id });
  await admin.from("audit_logs").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "user.role.update",
    entity: "user_roles",
    entity_id: targetId,
    after: { role: roleCode },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function toggleUserAction(formData: FormData) {
  const { user } = await requirePermission("user.disable", "/admin/users");
  const targetId = String(formData.get("user_id") ?? "");
  const disable = formData.get("disable") === "1";
  if (!targetId) redirect("/admin/users");
  if (targetId === user.id) redirect("/admin/users?error=self");

  const admin = createSupabaseAdminClient();
  const { data: targetRoles } = await admin.from("user_roles").select("roles(code)").eq("user_id", targetId);
  const targetIsSuper = (targetRoles ?? []).some(
    (row) => (row.roles as unknown as { code: string } | null)?.code === "super_admin",
  );
  if (targetIsSuper) redirect("/admin/users?error=super");

  await admin.auth.admin.updateUserById(targetId, {
    ban_duration: disable ? "876000h" : "none",
  });
  await admin.from("profiles").update({ status: disable ? "disabled" : "active" }).eq("id", targetId);
  await admin.from("audit_logs").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: disable ? "user.disable" : "user.enable",
    entity: "profiles",
    entity_id: targetId,
  });
  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}
