"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Search, X } from "lucide-react";
import { ProgrammeGrid } from "@/components/programme/programme-grid";
import { ProgrammeList } from "@/components/programme/programme-list";
import { ProgrammeTable } from "@/components/programme/programme-table";
import type { Locale } from "@/lib/i18n/config";
import type { ProgrammeSession } from "@/lib/programme/model";
import { formatDate } from "@/lib/utils/dates";
import { matchesQuery } from "@/lib/utils/search";

export function ProgrammeResults({
  sessions,
  rooms,
  types,
  locale,
  year,
  view,
  date,
  initialQuery = "",
  initialRoom = "",
  initialType = "",
}: {
  sessions: ProgrammeSession[];
  rooms: { id: string; name_vi: string; name_en: string | null }[];
  types: { id: string; code: string; name_vi: string | null; name_en: string | null }[];
  locale: Locale;
  year: string;
  view: "list" | "grid" | "table";
  date: string;
  initialQuery?: string;
  initialRoom?: string;
  initialType?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [roomId, setRoomId] = useState(initialRoom);
  const [typeCode, setTypeCode] = useState(initialType);

  const filtered = useMemo(() => {
    return sessions.filter((session) => {
      if (roomId && session.rooms?.id !== roomId) return false;
      if (typeCode && session.session_types?.code !== typeCode) return false;
      if (!query.trim()) return true;
      return matchesQuery(
        [
          ...session.session_translations.map((t) => t.title ?? ""),
          ...session.session_translations.map((t) => t.short_title ?? ""),
          ...session.presentations.flatMap((presentation) => [
            ...presentation.presentation_translations.map((t) => t.title ?? ""),
            ...presentation.presentation_people.map(
              (person) => person.people?.display_name ?? "",
            ),
          ]),
          ...session.session_people.map((person) => person.people?.display_name ?? ""),
          session.rooms?.name_vi ?? "",
          session.rooms?.name_en ?? "",
          session.session_types?.code ?? "",
          session.session_types?.name_vi ?? "",
          session.program_number ?? "",
        ].join(" "),
        query,
      );
    });
  }, [sessions, query, roomId, typeCode]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    if (roomId) url.searchParams.set("room", roomId);
    else url.searchParams.delete("room");
    if (typeCode) url.searchParams.set("type", typeCode);
    else url.searchParams.delete("type");
    window.history.replaceState(null, "", url);
  }, [query, roomId, typeCode]);

  return (
    <>
      <div
        id="programme-search"
        className="mt-4 grid scroll-mt-24 gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-[1fr_180px_180px_auto]"
      >
        <label className="relative block">
          <span className="sr-only">{locale === "en" ? "Search" : "Tìm kiếm"}</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-500"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              locale === "en" ? "Session, presentation, speaker..." : "Phiên, báo cáo, diễn giả..."
            }
            className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-400"
          />
        </label>
        <select
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
          aria-label={locale === "en" ? "Room" : "Hội trường"}
        >
          <option value="">{locale === "en" ? "All rooms" : "Tất cả hội trường"}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {locale === "en" ? room.name_en || room.name_vi : room.name_vi}
            </option>
          ))}
        </select>
        <select
          value={typeCode}
          onChange={(event) => setTypeCode(event.target.value)}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
          aria-label={locale === "en" ? "Session type" : "Loại phiên"}
        >
          <option value="">{locale === "en" ? "All types" : "Tất cả loại phiên"}</option>
          {types.map((type) => (
            <option key={type.id} value={type.code}>
              {locale === "en" ? type.name_en || type.name_vi : type.name_vi || type.name_en}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setRoomId("");
            setTypeCode("");
          }}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-line px-3 text-sm font-bold text-ink-700 hover:bg-surface"
        >
          <X className="size-4" aria-hidden />
          {locale === "en" ? "Clear" : "Xóa"}
        </button>
      </div>

      <p className="mt-3 text-xs font-semibold text-ink-500" aria-live="polite">
        {filtered.length} {locale === "en" ? "sessions" : "phiên"}
      </p>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-sm font-semibold text-ink-700">
              {locale === "en" ? "No sessions found." : "Không tìm thấy phiên phù hợp."}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setRoomId("");
                setTypeCode("");
              }}
              className="mt-3 text-sm font-bold text-brand-700 hover:underline"
            >
              {locale === "en" ? "Clear filters" : "Xóa bộ lọc"}
            </button>
          </div>
        ) : view === "list" ? (
          <section>
            <h2 className="flex items-center gap-2 border-b-2 border-gold-500 pb-2 text-xl font-extrabold text-brand-900">
              <CalendarDays className="size-5 text-brand-500" aria-hidden />
              {formatDate(date, locale)}
            </h2>
            <div className="mt-3">
              <ProgrammeList sessions={filtered} locale={locale} year={year} />
            </div>
          </section>
        ) : view === "grid" ? (
          <ProgrammeGrid sessions={filtered} locale={locale} year={year} />
        ) : (
          <>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-brand-900">
              <MapPin className="size-5 text-brand-500" aria-hidden />
              {formatDate(date, locale)}
            </h2>
            <ProgrammeTable sessions={filtered} rooms={rooms} locale={locale} year={year} />
          </>
        )}
      </div>
    </>
  );
}

