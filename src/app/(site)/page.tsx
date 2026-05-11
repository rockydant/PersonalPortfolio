import { PersonaHighlights } from "@/components/persona-highlights";
import { getPublishedProjects, getSiteOwnerId } from "@/lib/public-content";
import Link from "next/link";

export const revalidate = 120;

export default async function HomePage() {
  const ownerId = await getSiteOwnerId();
  const projects = await getPublishedProjects(ownerId);
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--muted)]">
          Personal branding OS
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Build your executive portfolio on a CMS you control.
        </h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">
          Resume, projects, blog, and inbound leads—backed by Supabase, shipped on Vercel. Use the
          admin setup wizard when you are ready to go live.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/resume"
          className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90"
        >
          View resume
        </Link>
        <Link
          href="/admin"
          className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--border)]/30"
        >
          Admin
        </Link>
      </div>

      {featured.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            Featured projects
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {featured.map((p) => (
              <li key={p.id as string} className="rounded-xl border border-[var(--border)] p-4">
                <h3 className="font-semibold">{p.title as string}</h3>
                {p.summary && (
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{p.summary as string}</p>
                )}
                <Link
                  href="/projects"
                  className="mt-3 inline-block text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                >
                  View all projects
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PersonaHighlights />
    </div>
  );
}
