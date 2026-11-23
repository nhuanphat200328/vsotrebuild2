import { createSupabasePublicClient } from "@/lib/supabase/public";
import type {
  ConferenceInfo,
  ProgrammeData,
  ProgrammeSession,
} from "@/lib/programme/model";

export type {
  ConferenceInfo,
  ConferenceTranslation,
  Presentation,
  ProgrammeData,
  ProgrammeSession,
  SessionPerson,
  Translation,
} from "@/lib/programme/model";
export {
  pickTranslation,
  presentationTitle,
  sessionTitle,
  typeName,
} from "@/lib/programme/model";

export async function getConferenceByYear(year: string) {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("conferences")
    .select(
      "id, slug, year, start_date, end_date, city, conference_translations(locale, name, short_name, intro, status)",
    )
    .eq("slug", year)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Conference query failed: ${error.message}`);
  return data as ConferenceInfo | null;
}

export async function getProgrammeData(year: string): Promise<ProgrammeData | null> {
  const supabase = await createSupabasePublicClient();
  const conference = await getConferenceByYear(year);
  if (!conference) return null;

  const [datesResult, roomsResult, typesResult, sessionsResult] = await Promise.all([
    supabase
      .from("conference_dates")
      .select("id, date, label_vi, label_en, kind, sort")
      .eq("conference_id", conference.id)
      .order("sort"),
    supabase
      .from("rooms")
      .select("id, name_vi, name_en, sort")
      .eq("conference_id", conference.id)
      .order("sort"),
    supabase.from("session_types").select("id, code, name_vi, name_en, is_break"),
    supabase
      .from("sessions")
      .select(
        `id, start_time, end_time, program_number, is_separator, sort,
         session_translations(locale, title, short_title, status),
         rooms(id, name_vi, name_en),
         conference_dates(id, date, label_vi, label_en),
         session_types(code, name_vi, name_en, color),
         session_people(role, sort, people(id, slug, full_name, display_name, title, institution, country)),
         presentations(
           id, start_time, end_time, sort, presentation_type,
           presentation_translations(locale, title, status),
           presentation_people(role, sort, people(id, slug, full_name, display_name, title, institution, country))
         )`,
      )
      .eq("conference_id", conference.id)
      .eq("status", "published")
      .order("start_time"),
  ]);

  for (const result of [datesResult, roomsResult, typesResult, sessionsResult]) {
    if (result.error) throw new Error(`Programme query failed: ${result.error.message}`);
  }

  const sessions = ((sessionsResult.data ?? []) as unknown as ProgrammeSession[]).map(
    (session) => ({
      ...session,
      presentations: [...(session.presentations ?? [])].sort((a, b) => a.sort - b.sort),
      session_people: [...(session.session_people ?? [])].sort((a, b) => a.sort - b.sort),
    }),
  );

  return {
    conference,
    dates: (datesResult.data ?? []) as ProgrammeData["dates"],
    rooms: (roomsResult.data ?? []) as ProgrammeData["rooms"],
    types: (typesResult.data ?? []) as ProgrammeData["types"],
    sessions,
  };
}

export async function getSessionById(id: string) {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(
      `id, start_time, end_time, program_number, is_separator, sort,
       conference_id,
       session_translations(locale, title, short_title, status),
       rooms(id, name_vi, name_en),
       conference_dates(id, date, label_vi, label_en),
       session_types(code, name_vi, name_en, color),
       session_people(role, sort, people(id, slug, full_name, display_name, title, institution, country)),
       presentations(
         id, start_time, end_time, sort, presentation_type,
         presentation_translations(locale, title, status),
         presentation_people(role, sort, people(id, slug, full_name, display_name, title, institution, country))
       )`,
    )
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Session query failed: ${error.message}`);
  return data as unknown as ProgrammeSession | null;
}

export async function getLatestConferenceYear(): Promise<string | null> {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("conferences")
    .select("slug, year")
    .eq("status", "published")
    .order("year", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data?.slug ?? null;
}
