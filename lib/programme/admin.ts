import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AdminSession = {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  program_number: string | null;
  date_id: string;
  room_id: string | null;
  session_type_id: string | null;
  session_translations: { locale: string; title: string | null; short_title: string | null; status: string }[];
  rooms: { id: string; name_vi: string } | null;
  conference_dates: { id: string; date: string; label_vi: string | null } | null;
  session_types: { code: string; name_vi: string | null } | null;
  presentations: { id: string }[];
};

export async function getAdminConference(id: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("conferences")
    .select("id, slug, year, status, start_date, end_date, city, conference_translations(locale, name, status)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAdminProgramme(conferenceId: string, date?: string) {
  const admin = createSupabaseAdminClient();
  const [dates, rooms, types, sessions] = await Promise.all([
    admin
      .from("conference_dates")
      .select("id, date, label_vi, kind, sort")
      .eq("conference_id", conferenceId)
      .order("sort"),
    admin
      .from("rooms")
      .select("id, name_vi, name_en, sort")
      .eq("conference_id", conferenceId)
      .order("sort"),
    admin.from("session_types").select("id, code, name_vi, name_en, is_break").order("code"),
    admin
      .from("sessions")
      .select(
        `id, start_time, end_time, status, program_number, date_id, room_id, session_type_id,
         session_translations(locale, title, short_title, status),
         rooms(id, name_vi),
         conference_dates(id, date, label_vi),
         session_types(code, name_vi),
         presentations(id)`,
      )
      .eq("conference_id", conferenceId)
      .order("start_time"),
  ]);

  for (const result of [dates, rooms, types, sessions]) {
    if (result.error) throw new Error(result.error.message);
  }

  let rows = (sessions.data ?? []) as unknown as AdminSession[];
  if (date) rows = rows.filter((row) => row.conference_dates?.date === date);

  return {
    dates: (dates.data ?? []) as { id: string; date: string; label_vi: string | null; kind: string }[],
    rooms: (rooms.data ?? []) as { id: string; name_vi: string; name_en: string | null }[],
    types: (types.data ?? []) as { id: string; code: string; name_vi: string | null; name_en: string | null; is_break: boolean }[],
    sessions: rows,
  };
}

export async function getAdminSession(sessionId: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("sessions")
    .select(
      `id, conference_id, date_id, room_id, session_type_id, start_time, end_time,
       status, program_number, sort,
       session_translations(locale, title, short_title, description, status),
       presentations(
         id, start_time, end_time, sort, presentation_type, status, legacy_pid,
         presentation_translations(locale, title, status),
         presentation_people(role, sort, people(id, full_name, display_name))
       )`,
    )
    .eq("id", sessionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAdminPeople() {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("people")
    .select("id, full_name, display_name, institution")
    .eq("status", "published")
    .order("full_name");
  if (error) throw new Error(error.message);
  return data ?? [];
}
