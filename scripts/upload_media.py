"""
Upload managed public assets to Supabase Storage (bucket: media-public).

Usage:
  python -u scripts/upload_media.py

Reads credentials from .env.local only. Never prints key values.
Idempotent: uses x-upsert, so re-running replaces the same object path.
"""

import mimetypes
import pathlib
import re
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENV = ROOT / ".env.local"
BUCKET = "media-public"

FILES = {
    "public/media/2026/kv.png": "conference-2026/branding/kv.png",
    "public/media/2026/logo.gif": "conference-2026/branding/logo.gif",
    "public/media/2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx": "conference-2026/templates/template-16x9-hoi-nghi-khoa-hoc-thuong-nien.pptx",
    "public/media/2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx": "conference-2026/templates/template-16x9-trung-tam-dieu-phoi-hien-tang.pptx",
    "public/media/2026/templates/template-poster-9x16.pptx": "conference-2026/templates/template-poster-9x16.pptx",
    "public/media/2026/invitations/thu-moi-dien-tu-vsot-2026.pdf": "conference-2026/invitations/thu-moi-dien-tu-vsot-2026.pdf",
    "public/media/2026/invitations/thu-moi-galadinner.jpg": "conference-2026/invitations/thu-moi-galadinner.jpg",
    "public/media/2026/documents/abs-tong-hop.pdf": "conference-2026/abstracts/abs-tong-hop.pdf",
    "public/media/2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf": "conference-2026/news/tuan-le-hien-ghep-mo-tang-2026.pdf",
    "public/media/2026/news/thong-bao-ho-so-record-vn.pdf": "conference-2026/news/thong-bao-ho-so-record-vn.pdf",
    "public/media/2026/news/thong-bao-1.pdf": "conference-2026/news/thong-bao-1.pdf",
    "public/media/2026/news/thong-bao-2.pdf": "conference-2026/news/thong-bao-2.pdf",
    "public/media/2026/news/thu-moi-tai-tro.pdf": "conference-2026/news/thu-moi-tai-tro.pdf",
    "public/archive/2023/chuong-trinh-vsot-2023.pdf": "conference-2023/documents/chuong-trinh-vsot-2023.pdf",
    "public/legacy/2025/CTKH.pdf": "conference-2025/documents/CTKH.pdf",
}


def load_env():
    cfg = {}
    for line in ENV.read_text(encoding="utf-8").splitlines():
        m = re.match(r'^([A-Z0-9_]+)="?(.*?)"?\s*$', line)
        if m:
            cfg[m.group(1)] = m.group(2)
    return cfg


def main():
    cfg = load_env()
    base = cfg["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = cfg["SUPABASE_SERVICE_ROLE_KEY"]
    if not base or not key:
        print("Missing Supabase URL or service key in .env.local")
        sys.exit(1)

    uploaded = 0
    for local, remote in FILES.items():
        path = ROOT / local
        if not path.is_file():
            print("MISSING", local)
            continue
        data = path.read_bytes()
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        url = f"{base}/storage/v1/object/{BUCKET}/{remote}"
        request = urllib.request.Request(
            url,
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
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                print("OK", response.status, remote, len(data), "bytes")
                uploaded += 1
        except urllib.error.HTTPError as exc:
            print("FAIL", exc.code, remote, exc.read()[:200])
        except Exception as exc:  # noqa: BLE001
            print("FAIL", remote, type(exc).__name__)

    print("uploaded", uploaded, "of", len(FILES))


if __name__ == "__main__":
    main()
