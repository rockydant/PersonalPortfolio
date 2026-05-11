const blocks = [
  {
    title: "Executive portfolio",
    body: "Positioning for board-facing narratives, operating scale, and cross-functional leadership—aligned with how searchers look for CTO and VP Engineering profiles.",
    keywords: "Executive portfolio · leadership narrative · operating cadence",
  },
  {
    title: "CTO & technical depth",
    body: "Architecture decisions, platform strategy, and delivery credibility surfaced through projects and writing so technical due-diligence reads your strengths quickly.",
    keywords: "CTO portfolio · platform strategy · engineering leadership",
  },
  {
    title: "AI consultant lens",
    body: "Responsible adoption, model lifecycle, and productized AI services—framed for buyers comparing fractional AI leadership and implementation partners.",
    keywords: "AI consultant SEO · applied AI · productized services",
  },
] as const;

export function PersonaHighlights() {
  return (
    <section className="border-t border-[var(--border)] pt-12">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
        Positioning lanes
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Keyword-oriented blocks you can echo in hero copy, meta descriptions, and LinkedIn—without
        locking the site to a single persona.
      </p>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {blocks.map((b) => (
          <li key={b.title} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
            <h3 className="text-base font-semibold tracking-tight">{b.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{b.body}</p>
            <p className="mt-4 text-xs text-[var(--foreground)]/80">{b.keywords}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
