"""
Copy, upload and map VSOT 2026 presentation abstracts.

Source (read-only):
  ../PrototypeClone/public_html/hoinghi2026/data/abstracts.json
  ../PrototypeClone/public_html/hoinghi2026/abstracts/*.html|pdf

Destination:
  public/media/2026/abstracts/<file>
  Supabase Storage: media-public/conference-2026/abstracts/library/<file>
  DB: presentations.abstract_* columns (matched by legacy_pid)

Only manifest entries with status=matched and a date-style pid are mapped.
Poster entries (ghep-than-*, ghep-gan-*) are reported but not mapped because
the current DB programme stores session presentations only.
"""

import json
import mimetypes
import pathlib
import re
import shutil
import sys
import urllib.error
import urllib.request

import psycopg

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENV = ROOT / ".env.local"
MANIFEST = ROOT / "supabase" / "seed" / "2026" / "abstracts.json"
SOURCE_ROOT = ROOT.parent / "PrototypeClone" / "public_html" / "hoinghi2026"
PUBLIC_DIR = ROOT / "public" / "media" / "2026" / "abstracts"
BUCKET = "media-public"
STORAGE_PREFIX = "conference-2026/abstracts/library"


def load_env():
    cfg = {}
    for line in ENV.read_text(encoding="utf-8").splitlines():
        m = re.match(r'^([A-Z0-9_]+)="?(.*?)"?\s*$', line)
        if m:
            cfg[m.group(1)] = m.group(2)
    return cfg


def upload(base, key, remote, data, mime):
    req = urllib.request.Request(
        f"{base}/storage/v1/object/{BUCKET}/{remote}",
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {key}",
            "apikey": key,
            "Content-Type": mime,
            "x-upsert": "true",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as response:
        return response.status


def main():
    cfg = load_env()
    base = cfg["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = cfg["SUPABASE_SERVICE_ROLE_KEY"]
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))["byPresentation"]

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    mapped = []
    posters = []
    missing = []

    with psycopg.connect(cfg["DIRECT_URL"], connect_timeout=30) as conn:
        with conn.cursor() as cur:
            titles = dict(cur.execute(
                "select legacy_pid, coalesce(pt.title, p.legacy_pid) "
                "from public.presentations p "
                "left join public.presentation_translations pt "
                "  on pt.presentation_id = p.id and pt.locale = 'vi' "
                "where p.legacy_pid is not null"
            ).fetchall())

            for pid, entry in sorted(manifest.items()):
                if entry.get("status") != "matched":
                    continue
                files = [f for f in entry.get("files", []) if f.get("path")]
                if not files:
                    continue
                if not re.match(r"^2026-\d{2}-\d{2}-", pid):
                    posters.append((pid, files[0]["path"]))
                    continue
                if pid not in titles:
                    missing.append((pid, "not in DB"))
                    continue
                file_info = files[0]
                source = SOURCE_ROOT / file_info["path"]
                if not source.is_file():
                    missing.append((pid, file_info["path"]))
                    continue
                name = source.name
                local = PUBLIC_DIR / name
                shutil.copyfile(source, local)
                mime = mimetypes.guess_type(name)[0] or "application/octet-stream"
                remote = f"{STORAGE_PREFIX}/{name}"
                status = upload(base, key, remote, source.read_bytes(), mime)
                cur.execute(
                    """
                    update public.presentations
                    set abstract_file_path = %s,
                        abstract_storage_bucket = %s,
                        abstract_storage_path = %s,
                        abstract_format = %s,
                        abstract_source_file = %s
                    where legacy_pid = %s
                    """,
                    (
                        f"/media/2026/abstracts/{name}",
                        BUCKET,
                        remote,
                        source.suffix.lstrip(".").upper(),
                        file_info.get("source"),
                        pid,
                    ),
                )
                mapped.append((pid, titles.get(pid), file_info["path"], status))
        conn.commit()

    lines = [
        "# ABSTRACT MAPPING REPORT",
        "",
        "Nguồn: `PrototypeClone/public_html/hoinghi2026/data/abstracts.json`",
        "và thư mục `abstracts/` (chỉ đọc). File đã copy sang",
        "`public/media/2026/abstracts/` và Storage `media-public/conference-2026/abstracts/library/`.",
        "",
        "## Tổng hợp",
        "",
        f"- Tổng bài trong manifest: {len(manifest)}",
        f"- Bài đã map vào DB: {len(mapped)}",
        f"- File thiếu / không có presentation: {len(missing)}",
        f"- Poster có abstract nhưng chưa có presentation trong DB: {len(posters)}",
        "",
        "## Mapping đã xác định",
        "",
        "| Presentation ID | Tiêu đề | File abstract | Upload |",
        "|---|---|---|---|",
    ]
    for pid, title, path, status in mapped:
        title = (title or "").replace("|", "\\|")
        lines.append(f"| `{pid}` | {title} | `{path}` | {status} |")
    lines += ["", "## Poster chưa map (không có presentation trong DB)", "", "| Poster ID | File |", "|---|---|"]
    for pid, path in posters:
        lines.append(f"| `{pid}` | `{path}` |")
    lines += ["", "## File thiếu / lỗi", ""]
    for pid, path in missing:
        lines.append(f"- `{pid}` — `{path}`")

    (ROOT / "docs" / "ABSTRACT_MAPPING_REPORT.md").write_text(
        "\n".join(lines) + "\n", encoding="utf-8", newline=""
    )
    print(
        json.dumps(
            {
                "manifest": len(manifest),
                "mapped": len(mapped),
                "posters": len(posters),
                "missing": len(missing),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
