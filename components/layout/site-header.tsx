"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Home,
  Mail,
  MapPinned,
  Menu,
  Phone,
  Search,
  Users,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/lib/i18n/config";
import type { getDictionary } from "@/lib/i18n/dictionary";

type Dict = ReturnType<typeof getDictionary>;

export function SiteHeader({
  locale,
  dict,
  latestYear,
}: {
  locale: Locale;
  dict: Dict;
  latestYear?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [conferenceOpen, setConferenceOpen] = useState(false);
  const [mobileConferenceOpen, setMobileConferenceOpen] = useState(false);

  const programmeHref = latestYear
    ? `/${locale}/hoi-nghi/${latestYear}/chuong-trinh`
    : `/${locale}/hoi-nghi`;
  const facultyHref = latestYear
    ? `/${locale}/hoi-nghi/${latestYear}/dien-gia`
    : `/${locale}/hoi-nghi`;

  const navItems = [
    { label: locale === "en" ? "Home" : "Trang chủ", href: `/${locale}` },
    { label: locale === "en" ? "Congresses" : "Hội nghị", href: `/${locale}/hoi-nghi` },
    { label: locale === "en" ? "Programme" : "Chương trình", href: programmeHref },
    { label: locale === "en" ? "Faculty" : "Diễn giả", href: facultyHref },
    { label: locale === "en" ? "News" : "Tin tức", href: `/${locale}/tin-tuc` },
    { label: locale === "en" ? "Contact" : "Liên hệ", href: `/${locale}/lien-he` },
  ];

  const conferenceLinks = latestYear
    ? [
        { label: locale === "en" ? "Programme" : "Chương trình", href: programmeHref },
        {
          label: locale === "en" ? "At a glance" : "Tổng quan",
          href: `/${locale}/hoi-nghi/${latestYear}/chuong-trinh/tong-quan`,
        },
        { label: locale === "en" ? "Faculty" : "Diễn giả", href: facultyHref },
        {
          label: locale === "en" ? `Congress ${latestYear}` : `Hội nghị ${latestYear}`,
          href: `/${locale}/hoi-nghi/${latestYear}`,
        },
      ]
    : [];
  const conferenceActive = pathname.includes("/chuong-trinh") || pathname.includes("/dien-gia");
  const otherLocale = locale === "vi" ? "en" : "vi";
  const switchHref = pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${otherLocale}`);

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-white/95 backdrop-blur">
        <div className="hidden border-b border-line/60 bg-brand-900 text-xs text-white/75 lg:block">
          <Container className="flex h-9 items-center justify-between gap-6">
            <p className="flex items-center gap-2">
              <MapPinned className="size-3.5 text-gold-300" aria-hidden />
              {dict.contact.address}
            </p>
            <div className="flex items-center gap-5">
              <Link
                href={switchHref}
                className="rounded border border-white/25 px-1.5 py-0.5 font-bold uppercase tracking-wide text-white/80 hover:bg-white/10 hover:text-white"
                hrefLang={otherLocale}
                aria-label={otherLocale === "en" ? "Switch to English" : "Chuyển sang tiếng Việt"}
              >
                {otherLocale}
              </Link>
              <a className="flex items-center gap-1.5 hover:text-white" href="tel:+84983723493">
                <Phone className="size-3.5 text-gold-300" aria-hidden />
                +84 983 723 493
              </a>
              <a
                className="flex items-center gap-1.5 hover:text-white"
                href="mailto:vsot@outlook.com.vn"
              >
                <Mail className="size-3.5 text-gold-300" aria-hidden />
                vsot@outlook.com.vn
              </a>
            </div>
          </Container>
        </div>

        <Container className="flex h-[72px] items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="flex min-w-0 items-center gap-3"
            aria-label="VSOT - Hội Ghép tạng Việt Nam"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-700 text-sm font-extrabold tracking-tight text-white shadow-sm">
              VSOT
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[15px] font-bold text-ink-900 sm:text-base">
                Hội Ghép tạng Việt Nam
              </span>
              <span className="block truncate text-[11px] font-medium uppercase tracking-wide text-ink-500">
                Vietnam Society of Organ Transplantation
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {navItems.map((item) =>
              item.href === `/${locale}/hoi-nghi` ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setConferenceOpen(true)}
                  onMouseLeave={() => setConferenceOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-brand-50 hover:text-brand-700",
                      conferenceActive ? "bg-brand-50 text-brand-700" : "text-ink-700",
                    )}
                    aria-expanded={conferenceOpen}
                    aria-haspopup="true"
                    aria-controls="desktop-conference-menu"
                  >
                    {item.label}
                    <ChevronDown className="size-4" aria-hidden />
                  </Link>
                  <div
                    id="desktop-conference-menu"
                    className={cn(
                      "absolute left-0 top-full z-50 min-w-56 rounded-xl border border-line bg-white p-1.5 shadow-xl shadow-ink-900/10",
                      conferenceOpen ? "block" : "hidden",
                    )}
                  >
                    {conferenceLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setConferenceOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-brand-50 hover:text-brand-700",
                    isActive(item.href) ? "bg-brand-50 text-brand-700" : "text-ink-700",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/lien-he`}
              className="hidden rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 sm:inline-flex"
            >
              {locale === "en" ? "Contact" : "Liên hệ"}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink-700 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Đóng menu" : "Mở menu"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>

        <div
          id="mobile-menu"
          className={cn("border-t border-line bg-white xl:hidden", open ? "block" : "hidden")}
        >
          <Container className="grid gap-1 py-3">
            {navItems.map((item) =>
              item.href === `/${locale}/hoi-nghi` ? (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() => setMobileConferenceOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink-700 hover:bg-brand-50"
                    aria-expanded={mobileConferenceOpen}
                    aria-controls="mobile-conference-menu"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn("size-4 transition", mobileConferenceOpen ? "rotate-180" : "")}
                      aria-hidden
                    />
                  </button>
                  {mobileConferenceOpen ? (
                    <div
                      id="mobile-conference-menu"
                      className="ml-3 grid gap-1 border-l border-line pl-3"
                    >
                      {conferenceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-brand-50"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 hover:bg-brand-50"
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href={switchHref}
              onClick={() => setOpen(false)}
              className="rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-brand-700"
              hrefLang={otherLocale}
            >
              {otherLocale === "en" ? "English" : "Tiếng Việt"}
            </Link>
          </Container>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] xl:hidden"
        aria-label="Mobile"
      >
        <div className="grid grid-cols-5">
          {[
            { icon: Home, label: locale === "en" ? "Home" : "Trang chủ", href: `/${locale}` },
            {
              icon: CalendarDays,
              label: locale === "en" ? "Programme" : "Chương trình",
              href: programmeHref,
            },
            { icon: Users, label: locale === "en" ? "Faculty" : "Diễn giả", href: facultyHref },
            {
              icon: Search,
              label: locale === "en" ? "Search" : "Tìm kiếm",
              href: `${programmeHref}#programme-search`,
            },
            { icon: Mail, label: locale === "en" ? "Contact" : "Liên hệ", href: `/${locale}/lien-he` },
          ].map((item) => {
            const active = isActive(item.href.split("#")[0]);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex min-h-[54px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[10px] font-bold",
                  active ? "text-brand-700" : "text-ink-500",
                )}
              >
                <item.icon className="size-[18px]" aria-hidden />
                <span className="truncate">{item.label}</span>
                <span
                  className={cn(
                    "h-[3px] w-6 rounded-full",
                    active ? "bg-gold-500" : "bg-transparent",
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
