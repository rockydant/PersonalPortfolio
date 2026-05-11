import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AdminAnalyticsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString();

  const supabase = await createClient();
  const [{ count: inquiries30 }, { count: inquiriesUnread }, { data: recent }] = await Promise.all(
    [
      supabase
        .from("contact_inquiries")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sinceIso),
      supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("read", false),
      supabase
        .from("contact_inquiries")
        .select("id, created_at")
        .order("created_at", { ascending: false })
        .limit(12),
    ],
  );

  const vercelProject =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          In-app metrics cover inquiries stored in Supabase. Web traffic and Web Vitals come from
          Vercel when this app is deployed with the official instrumentation packages.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--muted)]">Inquiries (last 30 days)</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{inquiries30 ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] p-4">
          <p className="text-sm text-[var(--muted)]">Inquiries (unread)</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{inquiriesUnread ?? "—"}</p>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Recent inquiry timestamps
        </h2>
        <ul className="mt-3 space-y-1 font-mono text-xs text-[var(--muted)]">
          {(recent ?? []).length === 0 && <li>No inquiries yet.</li>}
          {(recent ?? []).map((r) => (
            <li key={r.id as string}>{new Date(r.created_at as string).toISOString()}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--border)]/10 p-4 text-sm">
        <h2 className="font-semibold text-[var(--foreground)]">Vercel Analytics and Speed Insights</h2>
        <p className="mt-2 text-[var(--muted)]">
          This repo includes <code className="rounded bg-[var(--border)] px-1">@vercel/analytics</code>{" "}
          and <code className="rounded bg-[var(--border)] px-1">@vercel/speed-insights</code> in the
          root layout. After deployment, open your Vercel project → Analytics / Speed Insights to
          review visitors and Core Web Vitals.
        </p>
        {vercelProject ? (
          <p className="mt-3">
            <Link
              href={`https://vercel.com/`}
              className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              Open Vercel dashboard
            </Link>{" "}
            <span className="text-[var(--muted)]">(production host hint: {vercelProject})</span>
          </p>
        ) : (
          <p className="mt-3 text-[var(--muted)]">
            Set <code className="rounded bg-[var(--border)] px-1">NEXT_PUBLIC_SITE_URL</code> for
            production metadata; deploy on Vercel to activate pageview collection.
          </p>
        )}
      </section>
    </div>
  );
}
