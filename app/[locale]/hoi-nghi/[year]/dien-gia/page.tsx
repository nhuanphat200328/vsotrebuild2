import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { RoleBadge } from "@/components/programme/role-badge";
import { FacultyDirectory } from "@/components/faculty/faculty-directory";
import { getConferenceByYear } from "@/lib/programme/data";
import { getFacultyForConference, type FacultyRole } from "@/lib/faculty/data";
import { isLocale, type Locale } from "@/lib/i18n/config";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, year } = await params;
  return {
    title: rawLocale === "en" ? `Faculty ${year}` : `Diễn giả ${year}`,
    description:
      rawLocale === "en"
        ? "Chairs, discussants and presenters at the congress."
        : "Chủ tọa, thảo luận viên và báo cáo viên tại hội nghị.",
    alternates: { canonical: `/${rawLocale}/hoi-nghi/${year}/dien-gia` },
  };
}

function arrayValue(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function FacultyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; year: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale: rawLocale, year } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const conference = await getConferenceByYear(year);
  if (!conference) notFound();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const allowedRoles: FacultyRole[] = ["chair", "discussant", "presenter"];
  const roles = arrayValue(sp.role).filter((role): role is FacultyRole =>
    allowedRoles.includes(role as FacultyRole),
  );

  const people = await getFacultyForConference(conference.id);

  return (
    <div className="bg-surface pb-20">
      <Container className="py-9">
        <Link
          href={`/${locale}/hoi-nghi/${year}`}
          className="text-sm font-semibold text-brand-700 hover:underline"
        >
          ← {locale === "en" ? "Back to congress" : "Quay lại hội nghị"}
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">
          {locale === "en" ? "Faculty" : "Diễn giả"}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {locale === "en"
            ? "Chairs, discussants and presenters at the congress."
            : "Chủ tọa, thảo luận viên và báo cáo viên tại hội nghị."}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 rounded-xl border border-line bg-white px-4 py-3 text-xs font-semibold text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <RoleBadge role="chair" locale={locale} /> {locale === "en" ? "Chair" : "Chủ tọa"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RoleBadge role="discussant" locale={locale} /> {locale === "en" ? "Discussant" : "Thảo luận"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RoleBadge role="presenter" locale={locale} /> {locale === "en" ? "Presenter" : "Báo cáo viên"}
          </span>
        </div>

        <FacultyDirectory
          people={people}
          locale={locale}
          year={year}
          initialQuery={q}
          initialRoles={roles}
        />
      </Container>
    </div>
  );
}
