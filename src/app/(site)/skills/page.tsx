import type { Metadata } from "next";
import type { ResumeBundle } from "@/lib/public-content";
import { getPublishedResume, getSiteOwnerId } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Skills",
};

export const revalidate = 120;

export default async function SkillsPage() {
  const ownerId = await getSiteOwnerId();
  const bundle = await getPublishedResume(ownerId);

  const map = new Map<string, ResumeBundle["skills"]>();
  if (bundle) {
    for (const sk of bundle.skills) {
      const key = sk.category ?? "";
      const list = map.get(key) ?? [];
      list.push(sk);
      map.set(key, list);
    }
  }

  return (
    <article className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Skills</h1>
      {!bundle || bundle.skills.length === 0 ? (
        <p className="text-[var(--muted)]">No published skills yet.</p>
      ) : (
        <div className="space-y-8">
          {Array.from(map.entries()).map(([cat, items]) => (
            <section key={cat || "_"}>
              {cat ? (
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">{cat}</h2>
              ) : null}
              <ul className="flex flex-wrap gap-2">
                {items.map((sk) => (
                  <li
                    key={sk.id}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-sm"
                  >
                    <span className="font-medium">{sk.name}</span>
                    {sk.proficiency ? (
                      <span className="text-[var(--muted)]"> · {sk.proficiency}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
