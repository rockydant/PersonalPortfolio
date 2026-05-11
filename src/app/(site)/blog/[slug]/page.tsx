import type { Metadata } from "next";
import { BlogMarkdownBody } from "@/components/blog-markdown-body";
import { getPublishedPostBySlug, getSiteOwnerId } from "@/lib/public-content";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ownerId = await getSiteOwnerId();
  const post = await getPublishedPostBySlug(slug, ownerId);
  if (!post) {
    return { title: "Post" };
  }
  const title = post.title as string;
  const description = (post.excerpt as string) ?? undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: (post.published_at as string) ?? undefined,
      images: [{ url: `/blog/${slug}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const ownerId = await getSiteOwnerId();
  const post = await getPublishedPostBySlug(slug, ownerId);
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <p>
        <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Blog
        </Link>
      </p>
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">{post.title as string}</h1>
        {post.published_at && (
          <p className="text-sm text-[var(--muted)]">
            {new Date(post.published_at as string).toLocaleDateString()}
          </p>
        )}
      </header>
      {post.excerpt && <p className="text-lg text-[var(--muted)]">{post.excerpt as string}</p>}
      <BlogMarkdownBody markdown={(post.body as string) ?? ""} />
    </article>
  );
}
