"""Split combined speaker strings in the 2026 programme into individual people.

Detection is deliberately conservative: a separator only splits when the next
segment starts with an academic/medical title. Thus
"Dr Nguyen Thi Hoai An, Da Nang Hospital" stays one person (the comma is an
affiliation, not a second person).

Run dry-run:
  python -u scripts/split_combined_people.py
Apply:
  python -u scripts/split_combined_people.py --apply

The source JSON and original imports are never modified. Re-running the script
after apply is a no-op because no combined parent remains published.
"""

import re
import sys
import unicodedata

import psycopg

ROOT_ENV = None
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV = ROOT / ".env.local"

TITLE = (
    r"(?:GS\.?\s*TS\.?\s*BS|GS\.?\s*TS|PGS\.?\s*TS\.?\s*BS|PGS\.?\s*TS|"
    r"TS\.?\s*BS|TS|ThS\.?\s*BS|ThS|BSNT|BSCKII|BSCKI|BSCK2|BSCK1|BSCK|BS|"
    r"Dr|Prof|Assoc|MD)"
)
SPLIT_RE = re.compile(r"\s*(?:\u2013|-|/|;|,)\s*(?=" + TITLE + r"\b)", re.I)
TITLE_RE = re.compile(r"^(" + TITLE + r")\.?\s*", re.I)


def load_env():
    cfg = {}
    for line in ENV.read_text(encoding="utf-8").splitlines():
        match = re.match(r'^([A-Z0-9_]+)="?(.*?)"?\s*$', line)
        if match:
            cfg[match.group(1)] = match.group(2)
    return cfg


def split_display(value):
    return [part.strip() for part in SPLIT_RE.split(value or "") if part.strip()]


def parse_segment(value):
    match = TITLE_RE.match(value.strip())
    if not match:
        return None, value.strip()
    return match.group(1).rstrip("."), value[match.end():].strip()


def norm(value):
    value = unicodedata.normalize("NFD", (value or "").lower())
    value = "".join(c for c in value if unicodedata.category(c) != "Mn")
    value = value.replace("đ", "d")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def slugify(value):
    value = norm(value)
    return re.sub(r"\s+", "-", value).strip("-")[:80] or "person"


def main():
    apply = "--apply" in sys.argv
    cfg = load_env()
    with psycopg.connect(cfg["DIRECT_URL"], connect_timeout=30) as conn:
        with conn.cursor() as cur:
            people = cur.execute(
                "select id, slug, full_name, display_name, title, institution, country, photo_media_id, status "
                "from people where status = 'published' and deleted_at is null order by full_name"
            ).fetchall()
            parents = []
            for person in people:
                parts = split_display(person[3] or person[2])
                if len(parts) > 1:
                    parents.append((person, parts))

            print("published people:", len(people))
            print("combined candidates:", len(parents))
            if not apply:
                for person, parts in parents:
                    print("\nPARENT", person[1], "|", person[3] or person[2])
                    for part in parts:
                        title, name = parse_segment(part)
                        matches = [
                            p for p in people
                            if p[0] != person[0] and norm(p[2]) == norm(name)
                        ]
                        print("  ->", title, "|", name, "| existing:", [p[1] for p in matches])
                print("\nDRY_RUN only. Add --apply to write.")
                return

            used_slugs = {p[1] for p in people}
            created = archived = moved = 0
            for person, parts in parents:
                parent_id, parent_slug, parent_full, parent_display, parent_title, institution, country, photo, _ = person
                segment_people = []
                for part in parts:
                    title, name = parse_segment(part)
                    if not name:
                        continue
                    existing = cur.execute(
                        "select id, slug from people where status='published' and deleted_at is null "
                        "and lower(full_name)=lower(%s) limit 1",
                        (name,),
                    ).fetchone()
                    if existing:
                        segment_people.append(existing[0])
                        continue
                    base_slug = slugify(name)
                    slug = base_slug
                    counter = 2
                    while slug in used_slugs:
                        slug = f"{base_slug}-{counter}"
                        counter += 1
                    used_slugs.add(slug)
                    row = cur.execute(
                        """
                        insert into people
                          (slug, full_name, display_name, title, institution, country, photo_media_id, status)
                        values (%s, %s, %s, %s, %s, %s, %s, 'published')
                        returning id
                        """,
                        (slug, name, part, title, institution, country, photo),
                    ).fetchone()
                    segment_people.append(row[0])
                    created += 1

                for segment_id in segment_people:
                    for table, fk in (
                        ("session_people", "session_id"),
                        ("presentation_people", "presentation_id"),
                    ):
                        rows = cur.execute(
                            f"select id, {fk}, role from public.{table} where person_id=%s",
                            (parent_id,),
                        ).fetchall()
                        for row_id, fk_id, role in rows:
                            exists = cur.execute(
                                f"select id from public.{table} where person_id=%s and {fk}=%s and role=%s",
                                (segment_id, fk_id, role),
                            ).fetchone()
                            if exists:
                                cur.execute(f"delete from public.{table} where id=%s", (row_id,))
                            else:
                                cur.execute(
                                    f"update public.{table} set person_id=%s where id=%s",
                                    (segment_id, row_id),
                                )
                                moved += 1

                # Combined parent is an artefact: no public profile, no references.
                remaining = cur.execute(
                    "select (select count(*) from session_people where person_id=%s) + "
                    "(select count(*) from presentation_people where person_id=%s)",
                    (parent_id, parent_id),
                ).fetchone()[0]
                if remaining:
                    print("WARN parent still referenced:", parent_slug, remaining)
                else:
                    cur.execute(
                        "update people set status='archived', deleted_at=now() where id=%s",
                        (parent_id,),
                    )
                    archived += 1

            if apply:
                conn.commit()
            print(
                f"created={created} moved_assignments={moved} archived_parents={archived} "
                f"applied={apply}"
            )


if __name__ == "__main__":
    main()
