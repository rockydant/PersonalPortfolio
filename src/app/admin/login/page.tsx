import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { safeInternalPath } from "@/lib/auth-redirect";

export const metadata: Metadata = {
  title: "Admin login",
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = safeInternalPath(params.next, "/admin");
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const devQuickLoginAvailable =
    process.env.NODE_ENV === "development" &&
    Boolean(process.env.DEV_ADMIN_EMAIL?.trim()) &&
    Boolean(process.env.DEV_ADMIN_PASSWORD);

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-[var(--muted)]">
          Use a one-time email link or sign in with GitHub or Google. All three can stay enabled in
          Supabase so you can choose per session.
        </p>
        {params.error === "config" && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Supabase environment variables are missing. Add them and try again.
          </p>
        )}
      </div>
      <AdminLoginForm
        nextPath={nextPath}
        supabaseConfigured={supabaseConfigured}
        devQuickLoginAvailable={devQuickLoginAvailable}
      />
    </div>
  );
}
