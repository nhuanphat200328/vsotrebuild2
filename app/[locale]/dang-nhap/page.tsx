import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Container } from "@/components/ui/container";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { loginAction } from "./actions";
import { safeNextPath } from "@/lib/auth/next-path";

export default async function LoginPage({
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
  const next = safeNextPath(sp.next);
  const error = typeof sp.error === "string" ? sp.error : null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <div className="bg-surface py-16">
      <Container className="max-w-lg">
        <div className="rounded-2xl border border-line bg-white p-7 shadow-sm sm:p-9">
          <div className="grid size-11 place-items-center rounded-xl bg-brand-600 text-white">
            <LockKeyhole className="size-5" aria-hidden />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900">
            {locale === "en" ? "Administration sign in" : "Đăng nhập quản trị"}
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {locale === "en"
              ? "Accounts are created by invitation only."
              : "Tài khoản chỉ được tạo qua lời mời của quản trị viên."}
          </p>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error === "missing"
                ? locale === "en"
                  ? "Please enter email and password."
                  : "Vui lòng nhập email và mật khẩu."
                : locale === "en"
                  ? "Invalid email or password."
                  : "Email hoặc mật khẩu không đúng."}
            </p>
          ) : null}

          <form action={loginAction} className="mt-6 grid gap-4">
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="locale" value={locale} />
            <label className="grid gap-1.5 text-sm font-bold text-ink-700">
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="h-11 rounded-lg border border-line px-3 text-sm font-normal outline-none focus:border-brand-400"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-ink-700">
              {locale === "en" ? "Password" : "Mật khẩu"}
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="h-11 rounded-lg border border-line px-3 text-sm font-normal outline-none focus:border-brand-400"
              />
            </label>
            <button className="mt-2 h-11 rounded-lg bg-brand-600 text-sm font-bold text-white hover:bg-brand-700">
              {locale === "en" ? "Sign in" : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-500">
            <Link href={`/${locale}`} className="font-semibold text-brand-700 hover:underline">
              {locale === "en" ? "Back to website" : "Về trang chủ"}
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
