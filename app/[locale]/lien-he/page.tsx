import { Mail, MapPinned, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { submitContact } from "./actions";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="bg-surface py-12">
      <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">VSOT</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {locale === "en" ? "Contact us" : "Liên hệ"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            {locale === "en"
              ? "Send a message to the Vietnam Society of Organ Transplantation."
              : "Gửi thông tin liên hệ tới Hội Ghép tạng Việt Nam."}
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-xl border border-line bg-white p-4">
              <MapPinned className="size-5 text-brand-500" aria-hidden />
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink-500">
                {locale === "en" ? "Address" : "Địa chỉ"}
              </p>
              <p className="mt-1 text-sm text-ink-700">
                201B Nguyễn Chí Thanh, Quận 5, TP. Hồ Chí Minh
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white p-4">
              <Phone className="size-5 text-brand-500" aria-hidden />
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink-500">
                {locale === "en" ? "Phone" : "Điện thoại"}
              </p>
              <p className="mt-1 text-sm text-ink-700">(+84) 8 38 554 138</p>
              <p className="text-sm text-ink-700">+84 983 723 493</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-4">
              <Mail className="size-5 text-brand-500" aria-hidden />
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink-500">Email</p>
              <a
                href="mailto:vsot@outlook.com.vn"
                className="mt-1 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                vsot@outlook.com.vn
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          {sent ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              {locale === "en"
                ? "Your message has been sent. Thank you."
                : "Đã gửi thông tin. Xin cảm ơn bạn."}
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error === "invalid"
                ? locale === "en"
                  ? "Please check the required fields (message at least 10 characters)."
                  : "Vui lòng kiểm tra các trường bắt buộc (nội dung tối thiểu 10 ký tự)."
                : locale === "en"
                  ? "Unable to send your message. Please try again later."
                  : "Không thể gửi thông tin. Vui lòng thử lại sau."}
            </div>
          ) : null}

          <form action={submitContact} className="grid gap-4">
            <input type="hidden" name="locale" value={locale} />
            <div className="hidden" aria-hidden="true">
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold text-ink-700">
                {locale === "en" ? "Full name" : "Họ và tên"} *
                <input
                  name="full_name"
                  required
                  minLength={2}
                  maxLength={200}
                  className="h-11 rounded-lg border border-line px-3 text-sm font-normal outline-none focus:border-brand-400"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-ink-700">
                Email *
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={300}
                  className="h-11 rounded-lg border border-line px-3 text-sm font-normal outline-none focus:border-brand-400"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-ink-700">
                {locale === "en" ? "Phone" : "Điện thoại"}
                <input
                  name="phone"
                  maxLength={50}
                  className="h-11 rounded-lg border border-line px-3 text-sm font-normal outline-none focus:border-brand-400"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-ink-700">
                {locale === "en" ? "Organization" : "Đơn vị công tác"}
                <input
                  name="organization"
                  maxLength={300}
                  className="h-11 rounded-lg border border-line px-3 text-sm font-normal outline-none focus:border-brand-400"
                />
              </label>
            </div>

            <label className="grid gap-1.5 text-sm font-bold text-ink-700">
              {locale === "en" ? "Subject" : "Chủ đề"}
              <input
                name="subject"
                maxLength={300}
                className="h-11 rounded-lg border border-line px-3 text-sm font-normal outline-none focus:border-brand-400"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-bold text-ink-700">
              {locale === "en" ? "Message" : "Nội dung"} *
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                className="rounded-lg border border-line p-3 text-sm font-normal outline-none focus:border-brand-400"
              />
            </label>

            <button className="h-11 rounded-lg bg-brand-600 text-sm font-bold text-white hover:bg-brand-700">
              {locale === "en" ? "Send message" : "Gửi thông tin"}
            </button>
            <p className="text-xs text-ink-500">
              {locale === "en"
                ? "Your details are stored securely and used only to respond to your enquiry."
                : "Thông tin được lưu trữ để phản hồi yêu cầu của bạn."}
            </p>
          </form>
        </div>
      </Container>
    </div>
  );
}
