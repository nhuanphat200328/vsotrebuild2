"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAccess } from "@/lib/auth/access";

const allowed = new Set(["new", "in_progress", "resolved", "spam"]);

export async function updateContactStatus(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/vi/dang-nhap?next=/admin/contacts");

  const access = await getUserAccess(user.id);
  if (!access.permissions.has("contact.update")) {
    redirect("/admin/contacts?error=forbidden");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!id || !allowed.has(status)) {
    redirect("/admin/contacts?error=invalid");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("contact_requests")
    .update({ status })
    .eq("id", id);

  if (error) redirect("/admin/contacts?error=server");

  if (note) {
    await admin.from("contact_notes").insert({
      request_id: id,
      author_id: user.id,
      note: note.slice(0, 2000),
    });
  }

  revalidatePath("/admin/contacts");
  redirect("/admin/contacts?updated=1");
}
