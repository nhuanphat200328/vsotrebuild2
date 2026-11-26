import Image from "next/image";
import Link from "next/link";
import { Mail, MapPinned, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { Locale } from "@/lib/i18n/config";
import type { getDictionary } from "@/lib/i18n/dictionary";

type Dict = ReturnType<typeof getDictionary>;

export function SiteFooter({
  locale,
  dict,
  latestYear,
}: {
  locale: Locale;
  dict: Dict;
  latestYear?: string | null;
}) {
  const programmeHref = latestYear
    ? `/${locale}/hoi-nghi/${latestYear}/chuong-trinh`
    : `/${locale}/hoi-nghi`;

  return (
    <footer className="border-t border-line bg-brand-900 text-white/80">
      <Container className="grid gap-10 py-14 pb-24 md:grid-cols-2 lg:grid-cols-4 xl:pb-14">
        <div>
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3"
            aria-label="VSOT - Hội Ghép tạng Việt Nam"
          >
            <Image
              src="/media/2026/logo.gif"
              alt="Logo Hội Ghép tạng Việt Nam"
              width={44}
              height={38}
              className="h-10 w-auto bg-white/95 p-0.5"
            />
            <span className="leading-tight">
              <span className="block text-sm font-bold text-white">Hội Ghép tạng Việt Nam</span>
              <span className="block text-[11px] uppercase tracking-wide text-white/60">
                Vietnam Society of Organ Transplantation
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">{dict.about.body}</p>
        </div>

        <nav aria-label={dict.footer.about}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-300">
            {dict.footer.about}
          </h2>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <Link className="hover:text-white" href={`/${locale}`}>
                {dict.nav.home}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href={`/${locale}/hoi-nghi`}>
                {dict.nav.conference}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href={`/${locale}/tin-tuc`}>
                {dict.nav.news}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={dict.footer.conference}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-300">
            {dict.footer.conference}
          </h2>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <Link className="hover:text-white" href={programmeHref}>
                {locale === "en" ? "Scientific programme" : "Chương trình khoa học"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href={programmeHref.replace(/\?.*$/, "")}>
                {locale === "en" ? "Sessions" : "Phiên họp"}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href={`/${locale}/hoi-nghi`}>
                {locale === "en" ? "All congresses" : "Danh sách hội nghị"}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-white"
                href={`/${locale}/hoi-nghi/cac-nam-truoc`}
              >
                {locale === "en" ? "Archive overview" : "Kho lưu trữ hội nghị"}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-300">
            {dict.footer.contact}
          </h2>
          <ul className="mt-4 grid gap-3 text-sm">
            <li className="flex gap-2.5">
              <MapPinned className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden />
              <span>{dict.contact.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden />
              <a className="hover:text-white" href="tel:+84983723493">
                +84 983 723 493
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden />
              <a className="hover:text-white" href="mailto:vsot@outlook.com.vn">
                vsot@outlook.com.vn
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {dict.footer.rights}
          </p>
          <Link className="hover:text-white" href={`/${locale}/lien-he`}>
            {dict.footer.contact}
          </Link>
        </Container>
      </div>
    </footer>
  );
}
