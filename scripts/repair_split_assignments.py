"""Repair presentation/session assignments for split people.

The first split pass moved a combined person's assignment to only the first
segment. This script reconstructs every assignment from the read-only
programme source and attaches all split people to the same presentation/session.
Idempotent.

Dry-run: python -u scripts/repair_split_assignments.py
Apply:   python -u scripts/repair_split_assignments.py --apply
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

import psycopg

ROOT = Path(__file__).resolve().parent.parent
ENV = ROOT / ".env.local"
SOURCE = ROOT.parent / "PrototypeClone" / "public_html" / "hoinghi2026" / "data" / "programme.json"

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


def norm(value):
    value = unicodedata.normalize("NFD", (value or "").lower())
    value = "".join(c for c in value if unicodedata.category(c) != "Mn")
    value = value.replace("đ", "d")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def segments(value):
    return [part.strip() for part in SPLIT_RE.split(value or "") if part.strip()]


def person_name(part):
    match = TITLE_RE.match(part.strip())
    return part[match.end():].strip() if match else part.strip()


def main():
    apply = "--apply" in sys.argv
    cfg = load_env()
    data = json.loads(SOURCE.read_text(encoding="utf-8"))

    source_presentations = {}
    source_sessions = {}
    for day in data["days"]:
        for session in day["sessions"]:
            sid = session["sid"]
            for presenter in (session.get("chairs") or []):
                source_sessions.setdefault(norm(presenter), []).append((sid, "chair"))
            for discussant in (session.get("discussants") or []):
                source_sessions.setdefault(norm(discussant), []).append((sid, "discussant"))
            for presentation in session.get("presentations") or []:
                speaker = presentation.get("speaker")
                if speaker:
                    source_presentations.setdefault(norm(speaker), []).append(presentation.get("pid"))

    with psycopg.connect(cfg["DIRECT_URL"], connect_timeout=30) as conn:
        with conn.cursor() as cur:
            parents = cur.execute(
                "select id, slug, display_name from people "
                "where status='archived' and deleted_at is not null and display_name is not null "
                "order by display_name"
            ).fetchall()
            inserts = 0
            for parent_id, parent_slug, display in parents:
                parts = segments(display)
                if len(parts) < 2:
                    continue
                person_ids = []
                for part in parts:
                    name = person_name(part)
                    row = cur.execute(
                        "select id from people where status='published' and deleted_at is null "
                        "and lower(full_name)=lower(%s) order by created_at limit 1",
                        (name,),
                    ).fetchone()
                    if not row:
                        print("WARN missing person", name, "from", parent_slug)
                        continue
                    person_ids.append((name, row[0]))

                pids = source_presentations.get(norm(display), [])
                sids = source_sessions.get(norm(display), [])
                print("PARENT", parent_slug, "segments", len(person_ids), "presentations", len(pids), "sessions", len(sids))
                for pid in pids:
                    presentation = cur.execute(
                        "select id from presentations where legacy_pid=%s", (pid,)
                    ).fetchone()
                    if not presentation:
                        print("WARN presentation missing", pid)
                        continue
                    for order, (name, person_id) in enumerate(person_ids):
                        if not apply:
                            print("  would add presentation", pid, "->", name)
                            continue
                        cur.execute(
                            "insert into presentation_people (presentation_id, person_id, role, sort) "
                            "values (%s, %s, 'presenter', %s) on conflict do nothing",
                            (presentation[0], person_id, order),
                        )
                        inserts += 1
                        print("  add presentation", pid, "->", name)

                for sid, role in sids:
                    session = cur.execute(
                        "select id from sessions where legacy_sid=%s", (sid,)
                    ).fetchone()
                    if not session:
                        print("WARN session missing", sid)
                        continue
                    for order, (name, person_id) in enumerate(person_ids):
                        if not apply:
                            print("  would add session", sid, role, "->", name)
                            continue
                        cur.execute(
                            "insert into session_people (session_id, person_id, role, sort) "
                            "values (%s, %s, %s, %s) on conflict do nothing",
                            (session[0], person_id, role, order),
                        )
                        inserts += 1
                        print("  add session", sid, role, "->", name)

        if apply:
            conn.commit()
        print("assignment inserts:", inserts, "applied" if apply else "dry-run")


if __name__ == "__main__":
    main()
