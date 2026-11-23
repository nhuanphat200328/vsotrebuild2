export function absoluteUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hội Ghép tạng Việt Nam",
    alternateName: "Vietnam Society of Organ Transplantation",
    acronym: "VSOT",
    email: "vsot@outlook.com.vn",
    telephone: "+84983723493",
    address: {
      "@type": "PostalAddress",
      streetAddress: "201B Nguyễn Chí Thanh, Quận 5",
      addressLocality: "TP. Hồ Chí Minh",
      addressCountry: "VN",
    },
  };
}

export function eventJsonLd(input: {
  name: string;
  startDate: string | null;
  endDate: string | null;
  city: string | null;
  url: string;
  description: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    startDate: input.startDate ?? undefined,
    endDate: input.endDate ?? undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: input.city
      ? {
          "@type": "Place",
          name: input.city,
          address: { "@type": "PostalAddress", addressLocality: input.city, addressCountry: "VN" },
        }
      : undefined,
    description: input.description ?? undefined,
    url: input.url,
    organizer: {
      "@type": "Organization",
      name: "Hội Ghép tạng Việt Nam",
      url: absoluteUrl("/vi"),
    },
  };
}

export function personJsonLd(input: {
  name: string;
  title: string | null;
  institution: string | null;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    honorificPrefix: input.title ?? undefined,
    affiliation: input.institution
      ? { "@type": "Organization", name: input.institution }
      : undefined,
    url: input.url,
  };
}
