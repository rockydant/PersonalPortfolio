import type { Metadata } from "next";
import { DashboardBaoDangSampleCard } from "@/components/dashboard-bao-dang-sample-card";
import { getSessionUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  const [
    { count: inquiriesTotal },
    { count: inquiriesUnread },
    { count: postsPublished },
    { count: projectsPublished },
    { count: resumeVersions },
  ] = await Promise.all([
    supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
    supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("read", false),
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("published", true),
    supabase
      .from("portfolio_projects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("published", true),
    supabase.from("resume_versions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const cards = [
    { label: "Inquiries (unread)", value: inquiriesUnread ?? "—" },
    { label: "Inquiries (total)", value: inquiriesTotal ?? "—" },
    { label: "Published posts", value: postsPublished ?? "—" },
    { label: "Published projects", value: projectsPublished ?? "—" },
    { label: "Resume versions", value: resumeVersions ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Counts respect Supabase RLS. Claim the site to scope contact inquiries to your account.
        </p>
        <p className="mt-3">
          <Link
            href="/admin/analytics"
            className="text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
          >
            Analytics →
          </Link>
          <span className="text-sm text-[var(--muted)]"> · inquiry trends and Vercel traffic notes</span>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm"
          >
            <p className="text-sm text-[var(--muted)]">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>

      <DashboardBaoDangSampleCard />
    </div>
  );
}
