"use server";

import {
  initialBlogCreateState,
  type BlogCreateState,
} from "@/app/admin/(panel)/blog/create-blog-state";
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

export async function createBlogPostFormAction(
  _prevState: BlogCreateState,
  formData: FormData,
): Promise<BlogCreateState> {
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
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const published_at = published ? new Date().toISOString() : null;

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").insert({
    user_id: userId,
    title,
    slug,
    excerpt,
    body,
    published,
    published_at,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message, ok: false };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { ...initialBlogCreateState, ok: true };
}

export async function updateBlogPostAction(formData: FormData): Promise<void> {
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
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const body = String(formData.get("body") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const published_at = published ? new Date().toISOString() : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt,
      body,
      published,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return;
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPostAction(id: string): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "Not signed in." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id).eq("user_id", userId);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}

export async function deleteBlogPostFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const res = await deleteBlogPostAction(id);
  if (!res.error) {
    redirect("/admin/blog");
  }
}
