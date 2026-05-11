import type { Metadata } from "next";
import { getSiteOwnerId } from "@/lib/public-content";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About",
};

export const revalidate = 120;

export default async function AboutPage() {
  const ownerId = await getSiteOwnerId();
  let displayName: string | null = null;
  if (ownerId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", ownerId)
      .maybeSingle();
    displayName = (data as { display_name: string | null } | null)?.display_name ?? null;
  }

  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      {displayName && <p className="text-lg font-medium text-[var(--foreground)]">{displayName}</p>}
      <p className="leading-relaxed text-[var(--muted)]">
        Personal narrative and positioning—ideal for executive, CTO, and AI consultant SEO
        angles—can be extended with CMS-driven copy on this page once you wire additional fields.
      </p>
    </article>
  );
}
