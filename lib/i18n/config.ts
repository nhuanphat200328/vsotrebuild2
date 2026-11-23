export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/");
  parts[1] = nextLocale;
  return parts.join("/") || `/${nextLocale}`;
}
