import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign-in error",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Could not sign you in</h1>
      <p className="text-sm text-[var(--muted)]">
        The auth link may have expired, or the code was invalid. Try again from the admin login
        page and confirm redirect URLs in the Supabase dashboard include this site&apos;s{" "}
        <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs">/auth/callback</code> URL.
      </p>
      <Link
        href="/admin/login"
        className="inline-block rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)]"
      >
        Back to login
      </Link>
    </div>
  );
}
