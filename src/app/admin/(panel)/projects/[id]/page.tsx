import type { Metadata } from "next";
import {
  deleteProjectFormAction,
  updateProjectAction,
} from "@/app/admin/(panel)/projects/actions";
import { getSessionUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import { inputClass, labelClass } from "@/components/form-field-classes";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Edit project" };
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
        <Link href="/admin/projects" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← All projects
        </Link>
      </div>

      <form action={updateProjectAction} className="space-y-3">
        <input type="hidden" name="id" value={id} />
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={project.title as string}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug
          </label>
          <input id="slug" name="slug" defaultValue={project.slug as string} className={inputClass} />
        </div>
        <div>
          <label htmlFor="summary" className={labelClass}>
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={2}
            defaultValue={(project.summary as string) ?? ""}
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
            rows={6}
            defaultValue={(project.body as string) ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="github_url" className={labelClass}>
            GitHub URL
          </label>
          <input
            id="github_url"
            name="github_url"
            type="url"
            defaultValue={(project.github_url as string) ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="sort_order" className={labelClass}>
            Sort order
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={project.sort_order as number}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={Boolean(project.featured)}
            className="rounded border-[var(--border)]"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={Boolean(project.published)}
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

      <form action={deleteProjectFormAction} className="border-t border-[var(--border)] pt-6">
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-sm text-red-600 underline-offset-2 hover:underline dark:text-red-400"
        >
          Delete project
        </button>
      </form>
    </div>
  );
}
