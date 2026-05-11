import type { Metadata } from "next";
import { getPublishedBlogPosts, getSiteOwnerId } from "@/lib/public-content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
};

export const revalidate = 120;

export default async function BlogPage() {
  const ownerId = await getSiteOwnerId();
  const posts = await getPublishedBlogPosts(ownerId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-2 text-[var(--muted)]">Notes, essays, and technical write-ups.</p>
      </div>
      <ul className="space-y-4">
        {posts.length === 0 && (
          <li className="text-sm text-[var(--muted)]">No published posts yet.</li>
        )}
        {posts.map((post) => (
          <li key={post.id as string} className="border-b border-[var(--border)] pb-4">
            <Link href={`/blog/${post.slug}`} className="group block">
              <h2 className="text-lg font-semibold tracking-tight group-hover:underline">
                {post.title as string}
              </h2>
              {post.excerpt && (
                <p className="mt-1 text-sm text-[var(--muted)]">{post.excerpt as string}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
