"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { LegacySite } from "@/lib/archive/data";
import type { Locale } from "@/lib/i18n/config";

export function ConferenceTimeline({
  sites,
  locale,
}: {
  sites: LegacySite[];
  locale: Locale;
}) {
  const sorted = [...sites]
    .filter((site) => site.year && site.entry_path)
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (sorted.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = ref.current;
    if (!element) return;
    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [sorted.length]);

  if (sorted.length === 0) return null;

  return (
    <div
      ref={ref}
      className={`conference-timeline ${armed ? "is-armed" : ""} ${active ? "is-active" : ""}`}
      style={{ "--timeline-count": sorted.length } as CSSProperties}
    >
      <ol className="timeline-items" aria-label={locale === "en" ? "Past congresses" : "Hội nghị các năm"}>
        {sorted.map((site, index) => (
          <li
            key={site.slug}
            className="timeline-item"
            style={{ "--timeline-delay": `${index * 150}ms` } as CSSProperties}
          >
            <a
              href={site.entry_path ?? "#"}
              className="timeline-link"
              aria-label={`${site.year} — ${site.title ?? "VSOT"}`}
            >
              <span className="timeline-card">
                <span className="timeline-year">{site.year}</span>
              </span>
              <span className="timeline-dot" aria-hidden />
            </a>
          </li>
        ))}
      </ol>
      <div className="timeline-rail" aria-hidden>
        <span className="timeline-line" />
        <span className="timeline-arrow" />
      </div>
    </div>
  );
}
