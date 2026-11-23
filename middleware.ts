import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOCALES = new Set(["vi", "en"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/vi", request.url));
  }

  const isAdmin = pathname.startsWith("/admin");
  const isRootArchive = pathname.startsWith("/hoi-nghi");
  let locale = "vi";

  if (!isAdmin && !isRootArchive) {
    const segment = pathname.split("/")[1] ?? "";
    if (!LOCALES.has(segment)) {
      const url = request.nextUrl.clone();
      url.pathname = `/vi${pathname}`;
      return NextResponse.redirect(url);
    }
    locale = segment;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-vsot-locale", locale);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdmin && !user) {
    const login = request.nextUrl.clone();
    login.pathname = "/vi/dang-nhap";
    login.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|archive|.*\\..*).*)",
  ],
};
