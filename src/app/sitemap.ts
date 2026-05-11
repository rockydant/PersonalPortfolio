import { createClient } from "@/lib/supabase/server";
import { getSiteOwnerId } from "@/lib/public-content";
import type { MetadataRoute } from "next";

const staticPaths = [
  "",
  "/resume",
  "/projects",
  "/experience",
  "/skills",
  "/blog",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return entries;
  }

  try {
    const ownerId = await getSiteOwnerId();
    const supabase = await createClient();
    let q = supabase.from("blog_posts").select("slug, updated_at").eq("published", true);
    if (ownerId) {
      q = q.eq("user_id", ownerId);
    }
    const { data: posts } = await q;
    for (const post of posts ?? []) {
      entries.push({
        url: `${base}/blog/${post.slug as string}`,
        lastModified: new Date((post.updated_at as string) ?? now),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // ignore sitemap dynamic failures when DB unreachable
  }

  return entries;
}
