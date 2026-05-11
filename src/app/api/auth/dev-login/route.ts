import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { safeInternalPath } from "@/lib/auth-redirect";

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

/**
 * Local development only: sign in as the user from DEV_ADMIN_EMAIL / DEV_ADMIN_PASSWORD.
 * Disabled outside NODE_ENV=development so production and `next start` never expose this path.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const email = process.env.DEV_ADMIN_EMAIL?.trim();
  const password = process.env.DEV_ADMIN_PASSWORD;
  if (!email || !password) {
    return NextResponse.json({ error: "Dev admin credentials are not set in the environment." }, { status: 503 });
  }

  let nextPath = "/admin";
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    if (body && typeof body === "object" && "next" in body) {
      nextPath = safeInternalPath(String((body as { next?: unknown }).next), "/admin");
    }
  } else {
    const formData = await request.formData().catch(() => null);
    nextPath = safeInternalPath(formData?.get("next")?.toString() ?? null, "/admin");
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(new URL(nextPath, origin));
}
