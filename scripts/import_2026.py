"""
Import VSOT 2026 programme from the legacy programme.json into Supabase.

Source of truth: PrototypeClone/.../hoinghi2026/data/programme.js
(copied to supabase/seed/2026/programme.json).

Usage:
  python scripts/import_2026.py

Requires: psycopg 3 and DIRECT_URL in .env.local.
This script is idempotent (upsert by legacy ids / slugs).
"""

import json
import os
import re
import sys
import unicodedata
from pathlib import Path

try:
    import psycopg
except ImportError:
    print("psycopg 3 is required: pip install 'psycopg[binary]'")
    raise

ROOT = Path(__file__).resolve().parent.parent
ENV = ROOT / ".env.local"
SEED = ROOT / "supabase" / "seed" / "2026" / "programme.json"


def load_env():
    cfg = {}
    for line in ENV.read_text(encoding="utf-8").splitlines():
        m = re.match(r'^([A-Z0-9_]+)="?(.*?)"?\s*$', line)
        if m:
            cfg[m.group(1)] = m.group(2)
    return cfg


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFD", value)
    value = "".join(c for c in value if unicodedata.category(c) != "Mn")
    value = value.replace("đ", "d").replace("Đ", "D").lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value[:80] or "person"


TITLE_RE = re.compile(
    r"^(GS\.TS\.BS|GS\.TS|PGS\.TS\.BS|PGS\.TS|TS\.BS|TS\.|ThS\.BS|ThS\.|"
    r"BSNT\.|BSCKII\.|BSCKI\.|BS\.|GS|PGS|TS|ThS|BS)\s*",
    re.IGNORECASE,
)


def split_title(raw: str):
    value = str(raw or "").strip()
    m = TITLE_RE.match(value)
    if not m:
        return None, value
    name = value[m.end():].strip() or value
    return m.group(1).rstrip("."), name


TYPE_LABELS = {
    "cme": ("CME", "CME", False),
    "opening": ("Khai mạc", "Opening", False),
    "closing": ("Bế mạc", "Closing", False),
    "plenary": ("Phiên toàn thể", "Plenary", False),
    "session": ("Phiên", "Session", False),
    "symposium": ("Hội thảo chuyên đề", "Symposium", False),
    "debate": ("Tranh luận", "Debate", False),
    "meeting": ("Cuộc họp", "Meeting", False),
    "tea_break": ("Giải lao", "Tea break", True),
    "gala": ("Gala", "Gala", True),
    "welcome": ("Chào mừng", "Welcome", True),
}


def main():
    cfg = load_env()
    url = cfg["DIRECT_URL"]
    data = json.loads(SEED.read_text(encoding="utf-8"))
    people_by_name = {}
    used_slugs = set()

    with psycopg.connect(url, connect_timeout=30) as conn:
        conn.execute("set local statement_timeout = '300s'")
        with conn.cursor() as cur:
            cur.execute(
                """
                insert into public.conferences
                  (slug, year, status, start_date, end_date, city, country,
                   theme_vi, landing_config)
                values ('2026', 2026, 'published', '2026-10-13', '2026-10-17',
                        'Đà Nẵng', 'Vietnam', %s,
                        '{"programmeSource":"legacy programme.js"}'::jsonb)
                on conflict (slug) do update set
                  status = excluded.status,
                  start_date = excluded.start_date,
                  end_date = excluded.end_date,
                  city = excluded.city,
                  theme_vi = excluded.theme_vi
                returning id
                """,
                (data["meta"].get("title"),),
            )
            conference_id = cur.fetchone()[0]

            cur.execute(
                """
                insert into public.conference_translations
                  (conference_id, locale, name, short_name, intro, status)
                values
                  (%s, 'vi', %s, 'VSOT 2026', %s, 'published'),
                  (%s, 'en', 'VSOT 2026', 'VSOT 2026', null, 'missing')
                on conflict (conference_id, locale) do update set
                  name = excluded.name,
                  short_name = excluded.short_name,
                  intro = excluded.intro
                """,
                (
                    conference_id,
                    data["meta"].get("event") or "VSOT 2026",
                    data["meta"].get("title"),
                    conference_id,
                ),
            )

            date_ids = {}
            for index, day in enumerate(data["days"]):
                cur.execute(
                    """
                    insert into public.conference_dates
                      (conference_id, date, label_vi, label_en, kind, sort)
                    values (%s, %s, %s, %s, %s, %s)
                    on conflict (conference_id, date) do update set
                      label_vi = excluded.label_vi,
                      label_en = excluded.label_en,
                      kind = excluded.kind,
                      sort = excluded.sort
                    returning id
                    """,
                    (
                        conference_id,
                        day["date"],
                        day.get("label"),
                        day.get("labelShort"),
                        day.get("kind", "scientific"),
                        index,
                    ),
                )
                date_ids[day["date"]] = cur.fetchone()[0]

            room_ids = {}
            for index, room in enumerate(data["rooms"]):
                cur.execute(
                    """
                    insert into public.rooms
                      (conference_id, code, name_vi, name_en, sort)
                    values (%s, %s, %s, %s, %s)
                    on conflict (conference_id, code) do update set
                      name_vi = excluded.name_vi,
                      name_en = excluded.name_en,
                      sort = excluded.sort
                    returning id
                    """,
                    (
                        conference_id,
                        room["id"],
                        room.get("vi") or room.get("short") or room["id"],
                        room.get("en") or room.get("short") or room["id"],
                        index,
                    ),
                )
                room_ids[room["id"]] = cur.fetchone()[0]

            type_ids = {}
            for code, (vi, en, is_break) in TYPE_LABELS.items():
                cur.execute(
                    """
                    insert into public.session_types
                      (code, name_vi, name_en, is_break)
                    values (%s, %s, %s, %s)
                    on conflict (code) do update set
                      name_vi = excluded.name_vi,
                      name_en = excluded.name_en,
                      is_break = excluded.is_break
                    returning id
                    """,
                    (code, vi, en, is_break),
                )
                type_ids[code] = cur.fetchone()[0]

            def get_person(raw):
                value = str(raw or "").strip()
                if not value:
                    return None
                if value in people_by_name:
                    return people_by_name[value]
                title, name = split_title(value)
                slug = slugify(name) or "person"
                if slug in used_slugs:
                    i = 2
                    while f"{slug}-{i}" in used_slugs:
                        i += 1
                    slug = f"{slug}-{i}"
                used_slugs.add(slug)
                cur.execute(
                    """
                    insert into public.people
                      (slug, full_name, display_name, title, status)
                    values (%s, %s, %s, %s, 'published')
                    on conflict (slug) do update set
                      full_name = excluded.full_name,
                      display_name = excluded.display_name,
                      title = excluded.title
                    returning id
                    """,
                    (slug, name, value, title),
                )
                person_id = cur.fetchone()[0]
                people_by_name[value] = person_id
                return person_id

            session_count = presentation_count = assignment_count = 0

            for day in data["days"]:
                date_id = date_ids[day["date"]]
                for index, session in enumerate(day["sessions"]):
                    cur.execute(
                        """
                        insert into public.sessions
                          (conference_id, date_id, room_id, session_type_id,
                           start_time, end_time, status, sort, legacy_sid,
                           is_separator)
                        values (%s, %s, %s, %s, %s, %s, 'published', %s, %s, %s)
                        on conflict (conference_id, legacy_sid) do update set
                          date_id = excluded.date_id,
                          room_id = excluded.room_id,
                          session_type_id = excluded.session_type_id,
                          start_time = excluded.start_time,
                          end_time = excluded.end_time,
                          sort = excluded.sort,
                          is_separator = excluded.is_separator
                        returning id
                        """,
                        (
                            conference_id,
                            date_id,
                            room_ids.get(session.get("roomId")),
                            type_ids.get(session.get("type"), type_ids["session"]),
                            session["start"],
                            session["end"],
                            index,
                            session["sid"],
                            TYPE_LABELS.get(session.get("type"), (None, None, False))[2],
                        ),
                    )
                    session_id = cur.fetchone()[0]
                    session_count += 1

                    title_vi = session.get("titleVi") or session.get("title")
                    title_en = session.get("titleEn")
                    for locale, title, short, status in (
                        ("vi", title_vi, session.get("titleViShort") or title_vi, "published" if title_vi else "missing"),
                        ("en", title_en, session.get("titleEnShort") or title_en, "published" if title_en else "missing"),
                    ):
                        cur.execute(
                            """
                            insert into public.session_translations
                              (session_id, locale, title, short_title, status)
                            values (%s, %s, %s, %s, %s)
                            on conflict (session_id, locale) do update set
                              title = excluded.title,
                              short_title = excluded.short_title,
                              status = excluded.status
                            """,
                            (session_id, locale, title, short, status),
                        )

                    for sort_index, chair in enumerate(session.get("chairs") or []):
                        person_id = get_person(chair)
                        if not person_id:
                            continue
                        cur.execute(
                            """
                            insert into public.session_people
                              (session_id, person_id, role, sort)
                            values (%s, %s, 'chair', %s)
                            on conflict (session_id, person_id, role) do update
                              set sort = excluded.sort
                            """,
                            (session_id, person_id, sort_index),
                        )
                        assignment_count += 1

                    for sort_index, discussant in enumerate(session.get("discussants") or []):
                        person_id = get_person(discussant)
                        if not person_id:
                            continue
                        cur.execute(
                            """
                            insert into public.session_people
                              (session_id, person_id, role, sort)
                            values (%s, %s, 'discussant', %s)
                            on conflict (session_id, person_id, role) do update
                              set sort = excluded.sort
                            """,
                            (session_id, person_id, sort_index),
                        )
                        assignment_count += 1

                    for sort_index, presentation in enumerate(session.get("presentations") or []):
                        legacy_pid = presentation.get("pid") or f"{session['sid']}-p{sort_index}"
                        cur.execute(
                            """
                            insert into public.presentations
                              (session_id, start_time, end_time, sort,
                               presentation_type, legacy_pid, status)
                            values (%s, %s, %s, %s, %s, %s, 'published')
                            on conflict (session_id, legacy_pid) do update set
                              start_time = excluded.start_time,
                              end_time = excluded.end_time,
                              sort = excluded.sort,
                              presentation_type = excluded.presentation_type
                            returning id
                            """,
                            (
                                session_id,
                                presentation.get("start") or None,
                                presentation.get("end") or None,
                                sort_index,
                                presentation.get("type"),
                                legacy_pid,
                            ),
                        )
                        presentation_id = cur.fetchone()[0]
                        presentation_count += 1

                        title = str(presentation.get("title") or "").strip()
                        cur.execute(
                            """
                            insert into public.presentation_translations
                              (presentation_id, locale, title, status)
                            values
                              (%s, 'vi', %s, %s),
                              (%s, 'en', null, 'missing')
                            on conflict (presentation_id, locale) do update set
                              title = excluded.title,
                              status = excluded.status
                            """,
                            (
                                presentation_id,
                                title or None,
                                "published" if title else "missing",
                                presentation_id,
                            ),
                        )

                        person_id = get_person(presentation.get("speaker"))
                        if not person_id:
                            continue
                        cur.execute(
                            """
                            insert into public.presentation_people
                              (presentation_id, person_id, role, sort)
                            values (%s, %s, 'presenter', 0)
                            on conflict (presentation_id, person_id, role) do nothing
                            """,
                            (presentation_id, person_id),
                        )
                        assignment_count += 1

                        if presentation.get("affiliation"):
                            cur.execute(
                                """
                                update public.people
                                set institution = %s
                                where id = %s and institution is null
                                """,
                                (presentation["affiliation"], person_id),
                            )

            conn.commit()
            print(
                json.dumps(
                    {
                        "conference_id": str(conference_id),
                        "dates": len(data["days"]),
                        "rooms": len(data["rooms"]),
                        "sessions": session_count,
                        "presentations": presentation_count,
                        "people": len(people_by_name),
                        "assignments": assignment_count,
                    },
                    ensure_ascii=False,
                    indent=2,
                )
            )


if __name__ == "__main__":
    main()
