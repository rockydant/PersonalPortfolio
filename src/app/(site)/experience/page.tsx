import type { Metadata } from "next";
import { getPublishedResume, getSiteOwnerId } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Experience",
};

export const revalidate = 120;

export default async function ExperiencePage() {
  const ownerId = await getSiteOwnerId();
  const bundle = await getPublishedResume(ownerId);

  return (
    <article className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Experience</h1>
      {!bundle || bundle.experience.length === 0 ? (
        <p className="text-[var(--muted)]">No published experience yet.</p>
      ) : (
        <ol className="space-y-8 border-l border-[var(--border)] pl-6">
          {bundle.experience.map((ex) => (
            <li key={ex.id} className="relative">
              <span className="absolute -left-[1.35rem] top-1.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
              <h2 className="text-lg font-semibold">
                {ex.role_title} · {ex.company}
              </h2>
              <p className="text-sm text-[var(--muted)]">
                {ex.start_date ?? "?"} — {ex.end_date ?? "Present"}
                {ex.location ? ` · ${ex.location}` : ""}
              </p>
              {ex.description && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{ex.description}</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
