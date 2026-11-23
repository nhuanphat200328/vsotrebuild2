import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Locale } from "@/lib/i18n/config";
import { pickTranslation, type Translation } from "@/lib/programme/data";

export type FacultyRole = "chair" | "discussant" | "presenter";

export type FacultyPerson = {
  id: string;
  slug: string;
  full_name: string;
  display_name: string | null;
  title: string | null;
  institution: string | null;
  country: string | null;
  roles: FacultyRole[];
  sessionCount: number;
  presentationCount: number;
};

type RawPerson = {
  id: string;
  slug: string;
  full_name: string;
  display_name: string | null;
  title: string | null;
  institution: string | null;
  country: string | null;
  session_people: { role: string; sessions: { id: string; conference_id: string } | null }[];
  presentation_people: {
    role: string;
    presentations: { sessions: { id: string; conference_id: string } | null } | null;
  }[];
};

export async function getFacultyForConference(conferenceId: string) {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("people")
    .select(
      `id, slug, full_name, display_name, title, institution, country,
       session_people(role, sessions(id, conference_id)),
       presentation_people(role, presentations(sessions(conference_id)))`,
    )
    .eq("status", "published")
    .order("full_name");

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as RawPerson[])
    .map((person) => {
      const sessionIds = new Set<string>();
      const roles = new Set<FacultyRole>();
      let presentationCount = 0;

      for (const assignment of person.session_people ?? []) {
        if (assignment.sessions?.conference_id === conferenceId) {
          sessionIds.add(assignment.sessions.id);
          roles.add(assignment.role === "discussant" ? "discussant" : "chair");
        }
      }

      for (const assignment of person.presentation_people ?? []) {
        if (assignment.presentations?.sessions?.conference_id === conferenceId) {
          roles.add("presenter");
          presentationCount += 1;
        }
      }

      return {
        id: person.id,
        slug: person.slug,
        full_name: person.full_name,
        display_name: person.display_name,
        title: person.title,
        institution: person.institution,
        country: person.country,
        roles: [...roles],
        sessionCount: sessionIds.size,
        presentationCount,
      } satisfies FacultyPerson;
    })
    .filter((person) => person.roles.length > 0);
}

export async function getFacultyProfile(slug: string, conferenceId: string) {
  const supabase = await createSupabasePublicClient();
  const { data, error } = await supabase
    .from("people")
    .select("id, slug, full_name, display_name, title, institution, country")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const [sessionRoles, presentationRoles] = await Promise.all([
    supabase
      .from("session_people")
      .select(
        `role,
         sessions(id, start_time, end_time, conference_id,
           session_translations(locale, title, status),
           rooms(name_vi, name_en),
           conference_dates(date, label_vi, label_en))`,
      )
      .eq("person_id", data.id),
    supabase
      .from("presentation_people")
      .select(
        `role,
         presentations(id, start_time, end_time,
           presentation_translations(locale, title, status),
           sessions(id, conference_id, start_time, end_time,
             session_translations(locale, title, status),
             rooms(name_vi, name_en),
             conference_dates(date, label_vi, label_en)))`,
      )
      .eq("person_id", data.id),
  ]);

  if (sessionRoles.error) throw new Error(sessionRoles.error.message);
  if (presentationRoles.error) throw new Error(presentationRoles.error.message);

  const sessions = ((sessionRoles.data ?? []) as unknown as {
    role: string;
    sessions: {
      id: string;
      start_time: string;
      end_time: string;
      conference_id: string;
      session_translations: Translation[];
      rooms: { name_vi: string; name_en: string | null } | null;
      conference_dates: { date: string; label_vi: string | null; label_en: string | null };
    } | null;
  }[]).filter((row) => row.sessions?.conference_id === conferenceId);

  const presentations = ((presentationRoles.data ?? []) as unknown as {
    role: string;
    presentations: {
      id: string;
      start_time: string | null;
      end_time: string | null;
      presentation_translations: Translation[];
      sessions: {
        id: string;
        conference_id: string;
        start_time: string;
        end_time: string;
        session_translations: Translation[];
        rooms: { name_vi: string; name_en: string | null } | null;
        conference_dates: { date: string; label_vi: string | null; label_en: string | null };
      } | null;
    } | null;
  }[]).filter((row) => row.presentations?.sessions?.conference_id === conferenceId);

  const roles = new Set<string>();
  for (const row of sessions) roles.add(row.role);
  for (const row of presentations) roles.add(row.role);

  return {
    person: data,
    roles: [...roles],
    sessions,
    presentations,
  };
}

export function pickTitle(translations: Translation[], locale: Locale) {
  return pickTranslation(translations, locale)?.title ?? null;
}


