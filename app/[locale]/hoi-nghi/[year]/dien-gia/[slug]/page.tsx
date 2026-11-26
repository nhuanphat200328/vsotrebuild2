import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { RoleBadge, roleLabel } from "@/components/programme/role-badge";
import { getConferenceByYear, pickTranslation } from "@/lib/programme/data";
import { getFacultyProfile, pickTitle } from "@/lib/faculty/data";
import { formatDate } from "@/lib/utils/dates";
import { absoluteUrl, personJsonLd } from "@/lib/utils/seo";
import { isLocale, type Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, year, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "vi";
  const conference = await getConferenceByYear(year);
  if (!conference) return { title: locale === "en" ? "Faculty" : "Diễn giả" };
  const profile = await getFacultyProfile(slug, conference.id);
  if (!profile) return { title: locale === "en" ? "Faculty" : "Diễn giả" };
  const name = profile.person.display_name || profile.person.full_name;
  return {
    title: name,
    description: [profile.person.title, profile.person.institution, profile.person.country]
      .filter(Boolean)
      .join(" · "),
    alternates: {
      canonical: `/${locale}/hoi-nghi/${year}/dien-gia/${profile.person.slug}`,
    },
    openGraph: { title: name, type: "profile" },
  };
}

export default async function FacultyProfilePage({
  params,
}: {
  params: Promise<{ locale: string; year: string; slug: string }>;
}) {
  const { locale: rawLocale, year, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const conference = await getConferenceByYear(year);
  if (!conference) notFound();
  const profile = await getFacultyProfile(slug, conference.id);
  if (!profile) notFound();

  const { person } = profile;
  const displayName = person.display_name || person.full_name;
  const profileNameSize =
    displayName.length > 44 ? "10px" : displayName.length > 36 ? "11.5px" : "14px";
  const base = `/${locale}/hoi-nghi/${year}/dien-gia`;

  const rows = [
    ...profile.sessions.map((row) => ({
      kind: "session" as const,
      role: row.role,
      date: row.sessions?.conference_dates?.date ?? "",
      start: row.sessions?.start_time?.slice(0, 5) ?? "",
      end: row.sessions?.end_time?.slice(0, 5) ?? "",
      room: locale === "en" ? row.sessions?.rooms?.name_en || row.sessions?.rooms?.name_vi : row.sessions?.rooms?.name_vi,
      title: row.sessions ? pickTranslation(row.sessions.session_translations, locale)?.title : null,
      href: row.sessions ? `/${locale}/hoi-nghi/${year}/phien/${row.sessions.id}` : null,
      lecture: null as string | null,
    })),
    ...profile.presentations.map((row) => ({
      kind: "presentation" as const,
      role: row.role,
      date: row.presentations?.sessions?.conference_dates?.date ?? "",
      start: row.presentations?.start_time?.slice(0, 5) ?? row.presentations?.sessions?.start_time?.slice(0, 5) ?? "",
      end: row.presentations?.end_time?.slice(0, 5) ?? row.presentations?.sessions?.end_time?.slice(0, 5) ?? "",
      room: locale === "en" ? row.presentations?.sessions?.rooms?.name_en || row.presentations?.sessions?.rooms?.name_vi : row.presentations?.sessions?.rooms?.name_vi,
      title: row.presentations?.sessions ? pickTranslation(row.presentations.sessions.session_translations, locale)?.title : null,
      href: row.presentations ? `/${locale}/hoi-nghi/${year}/phien/${row.presentations.sessions?.id}` : null,
      lecture: row.presentations ? pickTitle(row.presentations.presentation_translations, locale) : null,
    })),
  ].sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));

  const grouped = new Map<string, typeof rows>();
  for (const row of rows) {
    if (!row.date) continue;
    const list = grouped.get(row.date) ?? [];
    list.push(row);
    grouped.set(row.date, list);
  }

  return (
    <div className="bg-surface pb-20">
      <JsonLd
        data={personJsonLd({
          name: person.display_name || person.full_name,
          title: person.title,
          institution: person.institution,
          url: absoluteUrl(`${base}/${person.slug}`),
        })}
      />
      <Container className="py-8">
        <Link
          href={base}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {locale === "en" ? "Back to faculty" : "Quay lại danh sách diễn giả"}
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <header className="border-b-2 border-gold-500 p-3 sm:p-8">
            <h1
              className="profile-name text-3xl font-extrabold tracking-tight text-ink-900"
              style={{ "--profile-name-size": profileNameSize } as CSSProperties}
            >
              {displayName}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.roles.map((role) => (
                <RoleBadge key={role} role={role} locale={locale} showLabel />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {[person.title, person.institution, person.country].filter(Boolean).join(" · ") ||
                (locale === "en" ? "Affiliation being updated." : "Đơn vị đang được cập nhật.")}
            </p>
          </header>

          <div className="p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink-500">
              {locale === "en" ? "Programme roles" : "Vai trò trong chương trình"}
            </h2>

            {grouped.size === 0 ? (
              <p className="mt-3 text-sm text-ink-500">
                {locale === "en" ? "No programme assignments." : "Chưa có phân công trong chương trình."}
              </p>
            ) : (
              <div className="mt-4 grid gap-7">
                {[...grouped.entries()].map(([date, list]) => (
                  <section key={date}>
                    <h3 className="flex items-center gap-2 border-b border-line pb-2 text-sm font-extrabold text-brand-900">
                      <CalendarDays className="size-4 text-brand-500" aria-hidden />
                      {formatDate(date, locale)}
                    </h3>
                    <ul className="mt-2 divide-y divide-line">
                      {list.map((row, index) => (
                        <li key={`${row.kind}-${row.href}-${index}`} className="grid gap-2 py-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                          <div className="text-xs text-ink-500">
                            <span className="block font-bold text-brand-800">
                              {row.start}
                              {row.end ? `–${row.end}` : ""}
                            </span>
                            <span className="mt-1 inline-flex items-center gap-1">
                              <MapPin className="size-3" aria-hidden />
                              {row.room}
                            </span>
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <RoleBadge role={row.role} locale={locale} />
                              <span className="text-xs font-semibold text-ink-500">
                                {roleLabel(row.role, locale)}
                              </span>
                            </div>
                            {row.href ? (
                              <Link href={row.href} className="mt-1 block text-sm font-bold text-ink-900 hover:text-brand-700">
                                {row.title ?? (locale === "en" ? "Session" : "Phiên")}
                              </Link>
                            ) : (
                              <p className="mt-1 text-sm font-bold text-ink-900">
                                {row.title ?? ""}
                              </p>
                            )}
                            {row.lecture ? (
                              <p className="mt-1 text-sm text-ink-500">
                                <span className="font-semibold">{locale === "en" ? "Lecture: " : "Báo cáo: "}</span>
                                {row.lecture}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
