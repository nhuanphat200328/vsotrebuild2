import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RoleRow = {
  roles:
    | {
        code: string;
        role_permissions: { permissions: { code: string } | null }[];
      }
    | null;
};

export async function getUserAccess(userId: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("user_roles")
    .select("roles(code, role_permissions(permissions(code)))")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  const roles = new Set<string>();
  const permissions = new Set<string>();

  for (const row of (data ?? []) as unknown as RoleRow[]) {
    const role = row.roles;
    if (!role) continue;
    roles.add(role.code);
    for (const link of role.role_permissions ?? []) {
      if (link.permissions?.code) permissions.add(link.permissions.code);
    }
  }

  return { roles: [...roles], permissions };
}
