"""Replace the old v1 header/footer in copied archive pages with the VSOT chrome.

Only files under demo ver2/public/legacy are modified. Source sites are read-only.
Run: python -u scripts/sync_legacy_chrome.py
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEGACY = ROOT / "public" / "legacy"

HEADER = """<header class="vsot-archive-header">
  <div class="vsot-archive-container vsot-archive-bar">
    <a class="vsot-archive-brand" href="/vi" aria-label="Hội Ghép tạng Việt Nam">
      <img src="/media/2026/logo.gif" alt="Logo Hội Ghép tạng Việt Nam" width="44" height="38">
      <span><strong>Hội Ghép tạng Việt Nam</strong><small>Vietnam Society of Organ Transplantation</small></span>
    </a>
    <nav class="vsot-archive-nav" aria-label="Điều hướng chính">
      <a href="/vi">Trang chủ</a>
      <a href="/vi/hoi-nghi">Hội nghị</a>
      <a href="/vi/hoi-nghi/cac-nam-truoc">Hội nghị các năm</a>
      <a href="/vi/tin-tuc">Tin tức</a>
      <a href="/vi/lien-he">Liên hệ</a>
    </nav>
  </div>
  <div class="vsot-archive-note"><div class="vsot-archive-container">Kho lưu trữ hội nghị VSOT</div></div>
</header>
"""

FOOTER = """<footer class="vsot-archive-footer">
  <div class="vsot-archive-container">
    <div class="vsot-archive-footer-grid">
      <div>
        <img class="vsot-archive-footer-logo" src="/media/2026/logo.gif" alt="Logo Hội Ghép tạng Việt Nam" width="56" height="49">
        <h2>Hội Ghép tạng Việt Nam</h2>
        <p>Hội Ghép tạng Việt Nam (VSOT) là tổ chức xã hội nghề nghiệp của những người làm công tác ghép tạng tại Việt Nam.</p>
      </div>
      <div>
        <h2>Về VSOT</h2>
        <ul>
          <li><a href="/vi">Trang chủ</a></li>
          <li><a href="/vi/hoi-nghi">Hội nghị</a></li>
          <li><a href="/vi/tin-tuc">Tin tức</a></li>
        </ul>
      </div>
      <div>
        <h2>Hội nghị</h2>
        <ul>
          <li><a href="/vi/hoi-nghi/2026">Hội nghị 2026</a></li>
          <li><a href="/vi/hoi-nghi/cac-nam-truoc">Kho lưu trữ</a></li>
        </ul>
      </div>
      <div>
        <h2>Liên hệ</h2>
        <p>201B Nguyễn Chí Thanh, Quận 5, TP. Hồ Chí Minh<br>
        <a href="tel:+84983723493">+84 983 723 493</a><br>
        <a href="mailto:vsot@outlook.com.vn">vsot@outlook.com.vn</a></p>
      </div>
    </div>
    <div class="vsot-archive-copy">© Hội Ghép tạng Việt Nam. Kho lưu trữ hội nghị được bảo toàn.</div>
  </div>
</footer>
"""

CHROME_LINK = '<link rel="stylesheet" href="/legacy/shared/site-chrome.css">'


def remove_balanced_div(text, start):
    depth = 0
    for match in re.finditer(r"<div\b|</div>", text[start:], re.I):
        depth += 1 if match.group(0).lower().startswith("<div") else -1
        if depth == 0:
            return start, start + match.end()
    return start, start


def clean_page(text):
    start = text.find('<div class="full-containter full-header">')
    if start != -1:
        a, b = remove_balanced_div(text, start)
        text = text[:a] + text[b:]
    text = re.sub(r'<footer class="full-containter footer">.*?</footer>', "", text, flags=re.S | re.I)
    text = re.sub(r'<link[^>]+header-footer-2026\.css[^>]*>', "", text, flags=re.I)
    text = re.sub(r'<link[^>]+legacy-shell\.css[^>]*>', "", text, flags=re.I)
    return text


def inject(text):
    if "site-chrome.css" not in text:
        text = text.replace("</head>", CHROME_LINK + "\n</head>", 1)
    if "vsot-archive-header" not in text:
        text = re.sub(r"(<body[^>]*>)", r"\1\n" + HEADER, text, count=1, flags=re.I)
    if "vsot-archive-footer" not in text:
        text = text.replace("</body>", FOOTER + "\n</body>", 1)
    return text


def page_2023():
    title = "Chương trình hội nghị VSOT 2023"
    return f"""<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="Kho lưu trữ hiện chỉ còn file PDF chương trình hội nghị VSOT 2023.">
<link rel="stylesheet" href="/legacy/shared/site-chrome.css">
</head>
<body>
{HEADER}
<main class="vsot-archive-main">
  <div class="vsot-archive-container">
    <p class="vsot-archive-kicker">Kho lưu trữ hội nghị</p>
    <h1>{title}</h1>
    <p>Kho lưu trữ hiện chỉ còn file PDF chương trình. Không có website HTML gốc cho năm 2023.</p>
    <p><a class="vsot-archive-button" href="/archive/2023/chuong-trinh-vsot-2023.pdf" target="_blank" rel="noreferrer">Mở chương trình PDF</a></p>
    <div class="vsot-archive-pdf">
      <iframe src="/archive/2023/chuong-trinh-vsot-2023.pdf" title="Chương trình hội nghị VSOT 2023" loading="lazy"></iframe>
    </div>
  </div>
</main>
{FOOTER}
</body>
</html>
"""


def main():
    changed = 0
    files = [p for p in LEGACY.rglob("*") if p.is_file() and p.suffix.lower() in (".html", ".htm")]
    for path in files:
        if path.parent.name == "shared":
            continue
        if path.parent.name == "2023" and path.name == "index.html":
            path.write_text(page_2023(), encoding="utf-8", newline="")
            changed += 1
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        updated = inject(clean_page(text))
        if updated != text:
            path.write_text(updated, encoding="utf-8", newline="")
            changed += 1
    print("archive pages updated:", changed, "of", len(files))


if __name__ == "__main__":
    main()
