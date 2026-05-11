import type { Metadata } from "next";
import { getPublishedResume, getSiteOwnerId } from "@/lib/public-content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume",
};

export const revalidate = 120;

export default async function ResumePage() {
  const ownerId = await getSiteOwnerId();
  const bundle = await getPublishedResume(ownerId);

  if (!bundle) {
    return (
      <article className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Resume</h1>
        <p className="leading-relaxed text-[var(--muted)]">
          {ownerId
            ? "Publish a resume version from the admin resume CMS to display it here."
            : "Claim the site and publish your resume to show it on this page."}
        </p>
      </article>
    );
  }

  const { headline, summary } = bundle.version.content ?? {};

  return (
    <article className="max-w-2xl space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">{bundle.version.title}</h1>
          <Link
            href="/api/resume/pdf"
            className="shrink-0 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--border)]/30"
          >
            Download PDF
          </Link>
        </div>
        {headline && <p className="text-xl text-[var(--muted)]">{headline}</p>}
      </header>
      {summary && <p className="leading-relaxed whitespace-pre-wrap">{summary}</p>}
    </article>
  );
}
