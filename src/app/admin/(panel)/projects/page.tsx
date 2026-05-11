import type { Metadata } from "next";
import { CreateProjectForm } from "@/app/admin/(panel)/projects/create-project-form";
import { getSessionUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function AdminProjectsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("portfolio_projects")
    .select("id, title, slug, published, featured, sort_order, updated_at")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Published projects appear on the public site when marked published.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          New project
        </h2>
        <CreateProjectForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Your projects
        </h2>
        <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {(projects ?? []).length === 0 && (
            <li className="px-4 py-6 text-sm text-[var(--muted)]">No projects yet.</li>
          )}
          {(projects ?? []).map((p) => (
            <li key={p.id as string} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="font-medium">{p.title as string}</p>
                <p className="text-xs text-[var(--muted)]">
                  /{p.slug as string}
                  {p.published ? " · published" : " · draft"}
                  {p.featured ? " · featured" : ""}
                </p>
              </div>
              <Link
                href={`/admin/projects/${p.id}`}
                className="text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
