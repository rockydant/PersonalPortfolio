"use server";

import { getOrCreatePrimaryResume } from "@/lib/resume/get-or-create-primary-resume";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getOrCreatePrimaryResumeId(): Promise<string | null> {
  const r = await getOrCreatePrimaryResume();
  return r.ok ? r.id : null;
}

export async function updateResumeVersionAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  if (!userId) {
    return;
  }
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const title = String(formData.get("title") ?? "").trim() || "Resume";
  const headline = String(formData.get("headline") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const is_published = formData.get("is_published") === "on";
  const is_primary = formData.get("is_primary") === "on";

  const supabase = await createClient();

  if (is_primary) {
    await supabase
      .from("resume_versions")
      .update({ is_primary: false })
      .eq("user_id", userId)
      .neq("id", id);
  }

  const { error } = await supabase
    .from("resume_versions")
    .update({
      title,
      is_published,
      is_primary,
      content: { headline, summary },
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return;
  }
  revalidatePath("/admin/resume");
  revalidatePath("/resume");
  revalidatePath("/experience");
  revalidatePath("/skills");
}

export async function addExperienceAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  if (!userId) {
    return;
  }
  const resume_version_id = String(formData.get("resume_version_id") ?? "");
  if (!resume_version_id) {
    return;
  }

  const supabase = await createClient();
  const { data: rv } = await supabase
    .from("resume_versions")
    .select("id")
    .eq("id", resume_version_id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!rv) {
    return;
  }

  const company = String(formData.get("company") ?? "").trim();
  const role_title = String(formData.get("role_title") ?? "").trim();
  if (!company || !role_title) {
    return;
  }
  const { count } = await supabase
    .from("resume_experience")
    .select("id", { count: "exact", head: true })
    .eq("resume_version_id", resume_version_id);

  const sort_order = count ?? 0;

  const { error } = await supabase.from("resume_experience").insert({
    resume_version_id,
    company,
    role_title,
    location: String(formData.get("location") ?? "").trim() || null,
    start_date: String(formData.get("start_date") ?? "").trim() || null,
    end_date: String(formData.get("end_date") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    sort_order,
  });

  if (error) {
    return;
  }
  revalidatePath("/admin/resume");
  revalidatePath("/resume");
  revalidatePath("/experience");
}

export async function deleteExperienceFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteExperienceAction(id);
  }
}

export async function deleteExperienceAction(id: string): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "Not signed in." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("resume_experience").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/resume");
  revalidatePath("/resume");
  revalidatePath("/experience");
  return {};
}

export async function addSkillAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  if (!userId) {
    return;
  }
  const resume_version_id = String(formData.get("resume_version_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!resume_version_id || !name) {
    return;
  }

  const supabase = await createClient();
  const { data: rv } = await supabase
    .from("resume_versions")
    .select("id")
    .eq("id", resume_version_id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!rv) {
    return;
  }
  const { count } = await supabase
    .from("resume_skills")
    .select("id", { count: "exact", head: true })
    .eq("resume_version_id", resume_version_id);

  const sort_order = count ?? 0;

  const { error } = await supabase.from("resume_skills").insert({
    resume_version_id,
    category: String(formData.get("category") ?? "").trim() || null,
    name,
    proficiency: String(formData.get("proficiency") ?? "").trim() || null,
    sort_order,
  });

  if (error) {
    return;
  }
  revalidatePath("/admin/resume");
  revalidatePath("/skills");
}

export async function deleteSkillFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteSkillAction(id);
  }
}

export async function deleteSkillAction(id: string): Promise<{ error?: string }> {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "Not signed in." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("resume_skills").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/resume");
  revalidatePath("/skills");
  return {};
}
