"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";

const time = z.string().regex(/^\d{2}:\d{2}$/);
const status = z.enum(["draft", "published", "archived"]);

const sessionSchema = z.object({
  conference_id: z.string().uuid(),
  date_id: z.string().uuid(),
  room_id: z.string().uuid(),
  session_type_id: z.string().uuid(),
  start_time: time,
  end_time: time,
  program_number: z.string().trim().max(50).optional(),
  status,
  title_vi: z.string().trim().min(1).max(500),
  title_en: z.string().trim().max(500).optional(),
  short_vi: z.string().trim().max(200).optional(),
  short_en: z.string().trim().max(200).optional(),
});

const presentationSchema = z.object({
  session_id: z.string().uuid(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  presentation_type: z.string().trim().max(50).optional(),
  title_vi: z.string().trim().min(1).max(1000),
  title_en: z.string().trim().max(1000).optional(),
  status,
});

function parseSession(formData: FormData) {
  return sessionSchema.safeParse({
    conference_id: formData.get("conference_id"),
    date_id: formData.get("date_id"),
    room_id: formData.get("room_id"),
    session_type_id: formData.get("session_type_id"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    program_number: formData.get("program_number") || undefined,
    status: formData.get("status"),
    title_vi: formData.get("title_vi"),
    title_en: formData.get("title_en") || undefined,
    short_vi: formData.get("short_vi") || undefined,
    short_en: formData.get("short_en") || undefined,
  });
}

function editUrl(conferenceId: string, sessionId: string, query = "") {
  return `/admin/conferences/${conferenceId}/programme/${sessionId}${query}`;
}

async function assertNoConflict(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  dateId: string,
  roomId: string,
  start: string,
  end: string,
  excludeId?: string,
) {
  let query = admin
    .from("sessions")
    .select("id", { count: "exact", head: true })
    .eq("date_id", dateId)
    .eq("room_id", roomId)
    .lt("start_time", end)
    .gt("end_time", start);
  if (excludeId) query = query.neq("id", excludeId);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function createSessionAction(formData: FormData) {
  const { access } = await requirePermission("programme.write", "/admin");
  const parsed = parseSession(formData);
  if (!parsed.success) {
    redirect(`/admin/conferences/${formData.get("conference_id")}/programme/new?error=invalid`);
  }
  if (parsed.data.end_time <= parsed.data.start_time) {
    redirect(`/admin/conferences/${parsed.data.conference_id}/programme/new?error=time`);
  }
  if (parsed.data.status === "published" && !access.permissions.has("programme.publish")) {
    redirect(`/admin/conferences/${parsed.data.conference_id}/programme/new?error=publish`);
  }

  const admin = createSupabaseAdminClient();
  if (
    await assertNoConflict(
      admin,
      parsed.data.date_id,
      parsed.data.room_id,
      parsed.data.start_time,
      parsed.data.end_time,
    )
  ) {
    redirect(`/admin/conferences/${parsed.data.conference_id}/programme/new?error=conflict`);
  }

  const { data: created, error } = await admin
    .from("sessions")
    .insert({
      conference_id: parsed.data.conference_id,
      date_id: parsed.data.date_id,
      room_id: parsed.data.room_id,
      session_type_id: parsed.data.session_type_id,
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      program_number: parsed.data.program_number ?? null,
      status: parsed.data.status,
      sort: 0,
    })
    .select("id")
    .single();
  if (error || !created) {
    redirect(`/admin/conferences/${parsed.data.conference_id}/programme/new?error=server`);
  }

  await saveTranslations(created.id, parsed.data);
  revalidatePath("/", "layout");
  redirect(editUrl(parsed.data.conference_id, created.id, "?created=1"));
}

export async function updateSessionAction(formData: FormData) {
  const { access } = await requirePermission("programme.write", "/admin");
  const sessionId = String(formData.get("session_id") ?? "");
  const parsed = parseSession(formData);
  if (!sessionId || !parsed.success) {
    redirect(editUrl(String(formData.get("conference_id")), sessionId, "?error=invalid"));
  }
  if (parsed.data.end_time <= parsed.data.start_time) {
    redirect(editUrl(parsed.data.conference_id, sessionId, "?error=time"));
  }
  if (parsed.data.status === "published" && !access.permissions.has("programme.publish")) {
    redirect(editUrl(parsed.data.conference_id, sessionId, "?error=publish"));
  }

  const admin = createSupabaseAdminClient();
  if (
    await assertNoConflict(
      admin,
      parsed.data.date_id,
      parsed.data.room_id,
      parsed.data.start_time,
      parsed.data.end_time,
      sessionId,
    )
  ) {
    redirect(editUrl(parsed.data.conference_id, sessionId, "?error=conflict"));
  }

  const { error } = await admin
    .from("sessions")
    .update({
      date_id: parsed.data.date_id,
      room_id: parsed.data.room_id,
      session_type_id: parsed.data.session_type_id,
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      program_number: parsed.data.program_number ?? null,
      status: parsed.data.status,
    })
    .eq("id", sessionId)
    .eq("conference_id", parsed.data.conference_id);
  if (error) redirect(editUrl(parsed.data.conference_id, sessionId, "?error=server"));

  await saveTranslations(sessionId, parsed.data);
  revalidatePath("/", "layout");
  redirect(editUrl(parsed.data.conference_id, sessionId, "?saved=1"));
}

async function saveTranslations(
  sessionId: string,
  data: z.infer<typeof sessionSchema>,
) {
  const admin = createSupabaseAdminClient();
  const rows = [
    {
      session_id: sessionId,
      locale: "vi",
      title: data.title_vi,
      short_title: data.short_vi || data.title_vi,
      status: data.title_vi ? "published" : "missing",
    },
    {
      session_id: sessionId,
      locale: "en",
      title: data.title_en || null,
      short_title: data.short_en || data.title_en || null,
      status: data.title_en ? "published" : "missing",
    },
  ];
  const { error } = await admin
    .from("session_translations")
    .upsert(rows, { onConflict: "session_id,locale" });
  if (error) throw new Error(error.message);
}

export async function createPresentationAction(formData: FormData) {
  const { access } = await requirePermission("programme.write", "/admin");
  const sessionId = String(formData.get("session_id") ?? "");
  const conferenceId = String(formData.get("conference_id") ?? "");
  const parsed = presentationSchema.safeParse({
    session_id: sessionId,
    start_time: formData.get("start_time") || undefined,
    end_time: formData.get("end_time") || undefined,
    presentation_type: formData.get("presentation_type") || undefined,
    title_vi: formData.get("title_vi"),
    title_en: formData.get("title_en") || undefined,
    status: formData.get("status"),
  });
  if (!parsed.success) {
    redirect(editUrl(conferenceId, sessionId, "?error=presentation"));
  }
  if (parsed.data.status === "published" && !access.permissions.has("programme.publish")) {
    redirect(editUrl(conferenceId, sessionId, "?error=publish"));
  }

  const admin = createSupabaseAdminClient();
  const { data: created, error } = await admin
    .from("presentations")
    .insert({
      session_id: sessionId,
      start_time: parsed.data.start_time ?? null,
      end_time: parsed.data.end_time ?? null,
      presentation_type: parsed.data.presentation_type ?? null,
      status: parsed.data.status,
      sort: 0,
    })
    .select("id")
    .single();
  if (error || !created) redirect(editUrl(conferenceId, sessionId, "?error=server"));

  await savePresentationTranslation(created.id, parsed.data.title_vi, parsed.data.title_en);
  revalidatePath("/", "layout");
  redirect(editUrl(conferenceId, sessionId, "?saved=1"));
}

export async function updatePresentationAction(formData: FormData) {
  const { access } = await requirePermission("programme.write", "/admin");
  const presentationId = String(formData.get("presentation_id") ?? "");
  const sessionId = String(formData.get("session_id") ?? "");
  const conferenceId = String(formData.get("conference_id") ?? "");
  const parsed = presentationSchema.safeParse({
    session_id: sessionId,
    start_time: formData.get("start_time") || undefined,
    end_time: formData.get("end_time") || undefined,
    presentation_type: formData.get("presentation_type") || undefined,
    title_vi: formData.get("title_vi"),
    title_en: formData.get("title_en") || undefined,
    status: formData.get("status"),
  });
  if (!parsed.success || !presentationId) {
    redirect(editUrl(conferenceId, sessionId, "?error=presentation"));
  }
  if (parsed.data.status === "published" && !access.permissions.has("programme.publish")) {
    redirect(editUrl(conferenceId, sessionId, "?error=publish"));
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("presentations")
    .update({
      start_time: parsed.data.start_time ?? null,
      end_time: parsed.data.end_time ?? null,
      presentation_type: parsed.data.presentation_type ?? null,
      status: parsed.data.status,
    })
    .eq("id", presentationId)
    .eq("session_id", sessionId);
  if (error) redirect(editUrl(conferenceId, sessionId, "?error=server"));

  await savePresentationTranslation(presentationId, parsed.data.title_vi, parsed.data.title_en);
  revalidatePath("/", "layout");
  redirect(editUrl(conferenceId, sessionId, "?saved=1"));
}

async function savePresentationTranslation(
  presentationId: string,
  titleVi: string,
  titleEn?: string,
) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("presentation_translations").upsert(
    [
      {
        presentation_id: presentationId,
        locale: "vi",
        title: titleVi,
        status: titleVi ? "published" : "missing",
      },
      {
        presentation_id: presentationId,
        locale: "en",
        title: titleEn || null,
        status: titleEn ? "published" : "missing",
      },
    ],
    { onConflict: "presentation_id,locale" },
  );
  if (error) throw new Error(error.message);
}

