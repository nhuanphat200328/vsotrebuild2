import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProgrammeTable } from "@/components/programme/programme-table";
import { getProgrammeData } from "@/lib/programme/data";
import { formatDate } from "@/lib/utils/dates";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function AtAGlancePage({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale: rawLocale, year } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const data = await getProgrammeData(year);
  if (!data) notFound();

  return (
    <div className="bg-surface pb-20">
      <Container className="py-9">
        <Link
          href={`/${locale}/hoi-nghi/${year}/chuong-trinh`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {locale === "en" ? "Back to programme" : "Quay lại chương trình"}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">
          {locale === "en" ? "Programme at a glance" : "Tổng quan chương trình"}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-ink-500">
          {locale === "en"
            ? "A compact room-by-time overview. Open any block for full session details."
            : "Tổng quan theo hội trường và thời gian. Chọn một phiên để xem chi tiết."}
        </p>

        <div className="mt-8 grid gap-8">
          {data.dates.map((date) => {
            const sessions = data.sessions.filter(
              (session) => session.conference_dates?.date === date.date,
            );
            if (sessions.length === 0) return null;
            return (
              <section key={date.id}>
                <h2 className="mb-3 text-lg font-extrabold text-brand-900">
                  {formatDate(date.date, locale)}
                </h2>
                <ProgrammeTable sessions={sessions} rooms={data.rooms} locale={locale} year={year} />
              </section>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

