import { type NextRequest, NextResponse } from "next/server";
import { safeInternalPath } from "@/lib/auth-redirect";
import { updateSession } from "@/lib/supabase/middleware";

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const c of from.cookies.getAll()) {
    to.cookies.set(c.name, c.value);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseConfigured) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const returnTo = `${pathname}${request.nextUrl.search}`;
      url.searchParams.set("next", safeInternalPath(returnTo, "/admin"));
      const redirectRes = NextResponse.redirect(url);
      copyCookies(response, redirectRes);
      return redirectRes;
    }
  }

  if (pathname === "/admin/login" && user) {
    const next = safeInternalPath(request.nextUrl.searchParams.get("next"), "/admin");
    const url = request.nextUrl.clone();
    url.pathname = next;
    url.search = "";
    const redirectRes = NextResponse.redirect(url);
    copyCookies(response, redirectRes);
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
