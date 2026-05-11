"use server";

import {
  initialProjectCreateState,
  type ProjectCreateState,
} from "@/app/admin/(panel)/projects/create-project-state";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function createProjectFormAction(
  _prevState: ProjectCreateState,
  formData: FormData,
): Promise<ProjectCreateState> {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "You must be signed in.", ok: false };
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "Title is required.", ok: false };
  }
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const github_url = String(formData.get("github_url") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;

  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_projects").insert({
    user_id: userId,
    title,
    slug,
    summary,
    body,
    github_url,
    featured,
    published,
    sort_order,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message, ok: false };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { ...initialProjectCreateState, ok: true };
}

export async function updateProjectAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  if (!userId) {
    return;
  }
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return;
  }
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const github_url = String(formData.get("github_url") ?? "").trim() || null;
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_projects")
    .update({
      title,
      slug,
      summary,
      body,
      github_url,
      featured,
      published,
      sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return;
  }
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function deleteProjectAction(id: string): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "Not signed in." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_projects").delete().eq("id", id).eq("user_id", userId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return {};
}

export async function deleteProjectFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const res = await deleteProjectAction(id);
  if (!res.error) {
    redirect("/admin/projects");
  }
}
