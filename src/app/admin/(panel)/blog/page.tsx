import type { Metadata } from "next";
import { CreateBlogPostForm } from "@/app/admin/(panel)/blog/create-blog-post-form";
import { getSessionUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function AdminBlogPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published, published_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Body supports GitHub-flavored Markdown (sanitized on the public post page). Publish when
          ready.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          New post
        </h2>
        <CreateBlogPostForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Posts
        </h2>
        <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {(posts ?? []).length === 0 && (
            <li className="px-4 py-6 text-sm text-[var(--muted)]">No posts yet.</li>
          )}
          {(posts ?? []).map((p) => (
            <li key={p.id as string} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="font-medium">{p.title as string}</p>
                <p className="text-xs text-[var(--muted)]">
                  /blog/{p.slug as string}
                  {p.published ? " · published" : " · draft"}
                </p>
              </div>
              <Link
                href={`/admin/blog/${p.id}`}
                className="text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
