import type { Metadata } from "next";
import {
  deleteBlogPostFormAction,
  updateBlogPostAction,
} from "@/app/admin/(panel)/blog/actions";
import { getSessionUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import { inputClass, labelClass } from "@/components/form-field-classes";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Edit post" };
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
        <Link href="/admin/blog" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← All posts
        </Link>
      </div>

      <form action={updateBlogPostAction} className="space-y-3">
        <input type="hidden" name="id" value={id} />
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post.title as string}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug
          </label>
          <input id="slug" name="slug" defaultValue={post.slug as string} className={inputClass} />
        </div>
        <div>
          <label htmlFor="excerpt" className={labelClass}>
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={(post.excerpt as string) ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="body" className={labelClass}>
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={10}
            defaultValue={(post.body as string) ?? ""}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={Boolean(post.published)}
            className="rounded border-[var(--border)]"
          />
          Published
        </label>
        <button
          type="submit"
          className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--background)]"
        >
          Save changes
        </button>
      </form>

      <form action={deleteBlogPostFormAction} className="border-t border-[var(--border)] pt-6">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-sm text-red-600 underline-offset-2 hover:underline dark:text-red-400"
        >
          Delete post
        </button>
      </form>
    </div>
  );
}
