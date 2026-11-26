"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { RoleBadge } from "@/components/programme/role-badge";
import type { FacultyPerson, FacultyRole } from "@/lib/faculty/data";
import type { Locale } from "@/lib/i18n/config";
import { matchesQuery } from "@/lib/utils/search";

const ROLE_LABELS: Record<FacultyRole, { vi: string; en: string }> = {
  chair: { vi: "Chủ tọa", en: "Chair" },
  discussant: { vi: "Thảo luận", en: "Discussant" },
  presenter: { vi: "Báo cáo", en: "Presenter" },
};

function roleLabel(role: FacultyRole, locale: Locale) {
  return locale === "en" ? ROLE_LABELS[role].en : ROLE_LABELS[role].vi;
}

export function FacultyDirectory({
  people,
  locale,
  year,
  initialQuery = "",
  initialRoles = [],
}: {
  people: FacultyPerson[];
  locale: Locale;
  year: string;
  initialQuery?: string;
  initialRoles?: FacultyRole[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [roles, setRoles] = useState<FacultyRole[]>(initialRoles);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return people.filter((person) => {
      if (roles.length && !person.roles.some((role) => roles.includes(role))) return false;
      if (!query.trim()) return true;
      return matchesQuery(
        [
          person.full_name,
          person.display_name,
          person.institution,
          person.country,
          person.title,
          person.roles.map((role) => `${role} ${roleLabel(role, "vi")} ${roleLabel(role, "en")}`).join(" "),
        ]
          .filter(Boolean)
          .join(" "),
        query,
      );
    });
  }, [people, query, roles]);

  const pageSize = 40;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const current = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const base = `/${locale}/hoi-nghi/${year}/dien-gia`;

  function toggleRole(role: FacultyRole) {
    setPage(1);
    setRoles((current) =>
      current.includes(role) ? current.filter((item) => item !== role) : [...current, role],
    );
  }

  return (
    <div>
      <div className="mt-4 grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">{locale === "en" ? "Search faculty" : "Tìm kiếm diễn giả"}</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-500"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={
              locale === "en" ? "Name, institution, country..." : "Tên, đơn vị, quốc gia..."
            }
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-400"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {(["chair", "discussant", "presenter"] as const).map((role) => (
            <label
              key={role}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700"
            >
              <input
                type="checkbox"
                checked={roles.includes(role)}
                onChange={() => toggleRole(role)}
                className="size-4 rounded border-line"
              />
              {roleLabel(role, locale)}
            </label>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-500" aria-live="polite">
        {filtered.length} {locale === "en" ? "people" : "người"}
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
        {current.length === 0 ? (
          <p className="p-8 text-sm text-ink-500">
            {locale === "en" ? "No faculty found." : "Không tìm thấy diễn giả."}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {current.map((person) => (
              <li
                key={person.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="order-1 flex min-w-0 flex-col gap-2 sm:order-none sm:flex-row sm:items-start sm:gap-3">
                  <div className="order-2 flex w-14 shrink-0 flex-wrap gap-1 sm:order-1">
                    {person.roles.map((role) => (
                      <RoleBadge key={role} role={role} locale={locale} />
                    ))}
                  </div>
                  <div className="order-1 min-w-0 sm:order-2">
                    <Link
                      href={`${base}/${person.slug}`}
                      className="text-sm font-bold text-ink-900 hover:text-brand-700"
                    >
                      {person.display_name || person.full_name}
                    </Link>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                      {[person.institution, person.country].filter(Boolean).join(" · ") ||
                        (locale === "en" ? "Affiliation being updated" : "Đơn vị đang cập nhật")}
                    </p>
                  </div>
                </div>
                <div className="order-2 flex w-full shrink-0 flex-wrap items-center gap-3 pl-0 sm:order-none sm:w-auto">
                  <span className="max-sm:order-2 text-xs text-ink-500">
                    {person.presentationCount > 0
                      ? `${person.presentationCount} ${locale === "en" ? "abstracts" : "báo cáo"}`
                      : ""}
                  </span>
                  <Link
                    href={`${base}/${person.slug}`}
                    className="max-sm:order-1 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700 max-sm:px-4 max-sm:py-2"
                  >
                    {locale === "en" ? "Profile" : "Hồ sơ"}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pageCount > 1 ? (
        <nav className="mt-5 flex flex-wrap items-center gap-1.5" aria-label="Faculty pages">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((target) => (
            <button
              key={target}
              type="button"
              onClick={() => setPage(target)}
              className={`rounded-md border px-3 py-1.5 text-xs font-bold ${
                target === safePage
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line bg-white text-ink-700 hover:border-brand-300"
              }`}
            >
              {target}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
