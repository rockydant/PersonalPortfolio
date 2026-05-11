import type { Metadata } from "next";
import { getPublishedProjects, getSiteOwnerId } from "@/lib/public-content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
};

export const revalidate = 120;

export default async function ProjectsPage() {
  const ownerId = await getSiteOwnerId();
  const projects = await getPublishedProjects(ownerId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-2 text-[var(--muted)]">
          {ownerId
            ? "Shipped work and experiments from the CMS."
            : "Claim the site in admin and publish projects to show them here."}
        </p>
      </div>
      <ul className="space-y-6">
        {projects.length === 0 && (
          <li className="text-sm text-[var(--muted)]">No published projects yet.</li>
        )}
        {projects.map((p) => (
          <li key={p.id as string} className="rounded-xl border border-[var(--border)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {p.featured && (
                  <span className="mb-1 inline-block rounded-full bg-[var(--border)] px-2 py-0.5 text-xs font-medium">
                    Featured
                  </span>
                )}
                <h2 className="text-xl font-semibold tracking-tight">{p.title as string}</h2>
                {p.summary && <p className="mt-2 max-w-prose text-sm text-[var(--muted)]">{p.summary as string}</p>}
              </div>
              {p.github_url && (
                <Link
                  href={p.github_url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                >
                  GitHub
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
