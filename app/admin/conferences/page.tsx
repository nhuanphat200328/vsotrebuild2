import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/require";

export default async function AdminConferencesPage() {
  const { access } = await requirePermission("conference.read", "/admin/conferences");
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("conferences")
    .select("id, slug, year, status, city, conference_translations(locale, name)")
    .order("year", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Hội nghị</h1>
          <p className="mt-1 text-sm text-ink-500">Quản lý hội nghị và chương trình khoa học.</p>
        </div>
        {access.permissions.has("conference.write") ? (
          <span className="text-xs font-semibold text-ink-500">
            Tạo hội nghị: dùng migration/seed (chưa có form).
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(data ?? []).map((conference) => {
          const vi = (conference.conference_translations as unknown as { locale: string; name: string | null }[]).find(
            (t) => t.locale === "vi",
          );
          return (
            <article key={conference.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
                <CalendarDays className="size-4" aria-hidden />
                {conference.year}
                <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] normal-case text-ink-500">
                  {conference.status}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-extrabold text-ink-900">
                {vi?.name ?? `VSOT ${conference.year}`}
              </h2>
              <p className="mt-1 text-sm text-ink-500">{conference.city ?? ""}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/admin/conferences/${conference.id}/programme`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-700"
                >
                  Programme Builder
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
                <Link
                  href={`/vi/hoi-nghi/${conference.slug}`}
                  className="rounded-lg border border-line px-3.5 py-2 text-xs font-bold text-ink-700 hover:bg-surface"
                >
                  Xem public
                </Link>
              </div>
            </article>
          );
        })}
        {(data ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-white p-8 text-sm text-ink-500">
            Chưa có hội nghị.
          </p>
        ) : null}
      </div>
    </div>
  );
}
