import type { Locale } from "@/lib/i18n/config";

export function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDateOnly(value));
}

export function formatShortDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(parseDateOnly(value));
}

export function formatWeekday(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", {
    weekday: "short",
    timeZone: "UTC",
  }).format(parseDateOnly(value));
}
