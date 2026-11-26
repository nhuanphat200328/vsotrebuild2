"""Replace archive headers with the shared VSOT header (year-aware).

Run: python -u scripts/sync_legacy_header.py
Only public/legacy/** is touched; source reference sites are read-only.
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEGACY = ROOT / "public" / "legacy"


def years():
    values = [
        p.name
        for p in LEGACY.iterdir()
        if p.is_dir() and re.fullmatch(r"20\d{2}", p.name)
    ]
    return sorted(values, reverse=True)


def year_menu(current, all_years, mobile=False):
    links = []
    for year in all_years:
        cls = ' class="vsot-current"' if year == current else ""
        label = f"Kho lưu trữ {year}"
        links.append(
            f'<a href="/legacy/{year}/index.html"{cls}>{label}</a>'
        )
    if mobile:
        return "\n".join(links)
    return "\n".join(links)


def header(year, all_years):
    year_links = year_menu(year, all_years)
    mobile_year_links = year_menu(year, all_years, mobile=True)
    return f"""<header class="vsot-archive-header">
  <div class="vsot-archive-topbar">
    <div class="vsot-archive-container">
      <p>201B Nguyễn Chí Thanh, Quận 5, TP. Hồ Chí Minh</p>
      <div class="vsot-archive-topbar-links">
        <a href="tel:+84983723493">+84 983 723 493</a>
        <a href="mailto:vsot@outlook.com.vn">vsot@outlook.com.vn</a>
      </div>
    </div>
  </div>
  <div class="vsot-archive-container vsot-archive-bar">
    <a class="vsot-archive-brand" href="/vi" aria-label="Hội Ghép tạng Việt Nam">
      <img src="/media/2026/logo.gif" alt="Logo Hội Ghép tạng Việt Nam" width="48" height="42">
      <span><strong>Hội Ghép tạng Việt Nam</strong><small>Vietnam Society of Organ Transplantation</small></span>
    </a>
    <nav class="vsot-archive-nav" aria-label="Điều hướng chính">
      <a href="/vi">Trang chủ</a>
      <div class="vsot-menu-item">
        <button class="vsot-nav-toggle" type="button" aria-expanded="false" aria-haspopup="true">Hội nghị</button>
        <div class="vsot-menu">
          <a href="/legacy/{year}/index.html" class="vsot-current">Kho lưu trữ {year}</a>
        </div>
      </div>
      <div class="vsot-menu-item">
        <button class="vsot-nav-toggle" type="button" aria-expanded="false" aria-haspopup="true">Hội nghị các năm</button>
        <div class="vsot-menu">
          {year_links}
        </div>
      </div>
      <a href="/vi/tin-tuc">Tin tức</a>
      <a href="/vi/lien-he">Liên hệ</a>
    </nav>
    <div class="vsot-header-actions">
      <a class="vsot-header-contact" href="/vi/lien-he">Liên hệ</a>
    </div>
    <button class="vsot-mobile-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="vsot-mobile-menu">☰</button>
  </div>
  <div class="vsot-mobile-menu" id="vsot-mobile-menu" data-open="false">
    <div class="vsot-archive-container">
      <a href="/vi">Trang chủ</a>
      <div class="vsot-mobile-group">
        <button class="vsot-mobile-group-toggle" type="button" aria-expanded="false">Hội nghị <span aria-hidden="true">⌄</span></button>
        <div class="vsot-mobile-group-menu">
          <a href="/legacy/{year}/index.html">Kho lưu trữ {year}</a>
        </div>
      </div>
      <div class="vsot-mobile-group">
        <button class="vsot-mobile-group-toggle" type="button" aria-expanded="false">Hội nghị các năm <span aria-hidden="true">⌄</span></button>
        <div class="vsot-mobile-group-menu">
          {mobile_year_links}
        </div>
      </div>
      <a href="/vi/tin-tuc">Tin tức</a>
      <a href="/vi/lien-he">Liên hệ</a>
    </div>
  </div>
</header>
<script defer src="/legacy/shared/site-chrome.js"></script>"""


def main():
    all_years = years()
    changed = 0
    files = [
        p
        for p in LEGACY.rglob("*")
        if p.is_file() and p.suffix.lower() in (".html", ".htm") and p.parent.name != "shared"
    ]
    for path in files:
        year = next((part for part in path.parts if re.fullmatch(r"20\d{2}", part)), "")
        if not year:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        text = re.sub(
            r'<header class="vsot-archive-header">.*?</header>\s*(?:<script[^>]+site-chrome\.js[^>]*></script>)?',
            "",
            text,
            flags=re.S | re.I,
        )
        text = re.sub(
            r'<div class="full-containter full-header">.*?</div>\s*(?=<div|</body>)',
            "",
            text,
            flags=re.S | re.I,
        )
        new_header = header(year, all_years)
        text = re.sub(r"(<body[^>]*>)", r"\1\n" + new_header, text, count=1, flags=re.I)
        path.write_text(text, encoding="utf-8", newline="")
        changed += 1
    print("headers updated:", changed, "years:", ",".join(all_years))


if __name__ == "__main__":
    main()
