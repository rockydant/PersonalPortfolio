"use server";

import { getOrCreatePrimaryResumeId } from "@/app/admin/(panel)/resume/actions";
import {
  BAO_DANG_SAMPLE_BLOG_SLUGS,
  BAO_DANG_SAMPLE_PROJECT_SLUGS,
  BAO_DANG_SAMPLE_SEED_MARKER,
} from "@/lib/sample-data/bao-dang-constants";
import {
  baoDangResumeHeadline,
  baoDangResumeSummary,
  baoDangSampleBlogPosts,
  baoDangSampleExperience,
  baoDangSampleProjects,
  baoDangSampleSkills,
} from "@/lib/sample-data/bao-dang-profile-data";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

async function requireUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function revalidatePortfolioPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/resume");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/blog");
  revalidatePath("/resume");
  revalidatePath("/experience");
  revalidatePath("/skills");
  revalidatePath("/about");
  for (const slug of BAO_DANG_SAMPLE_BLOG_SLUGS) {
    revalidatePath(`/blog/${slug}`);
  }
}

async function resumeAllowsSampleSeed(
  supabase: SupabaseClient,
  resumeVersionId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data: rv } = await supabase
    .from("resume_versions")
    .select("content")
    .eq("id", resumeVersionId)
    .maybeSingle();

  const content = (rv?.content ?? {}) as Record<string, unknown>;
  if (content._sampleSeed === BAO_DANG_SAMPLE_SEED_MARKER) {
    return { ok: true };
  }

  const [{ count: ec }, { count: sc }] = await Promise.all([
    supabase
      .from("resume_experience")
      .select("id", { count: "exact", head: true })
      .eq("resume_version_id", resumeVersionId),
    supabase
      .from("resume_skills")
      .select("id", { count: "exact", head: true })
      .eq("resume_version_id", resumeVersionId),
  ]);

  const headline = String(content.headline ?? "").trim();
  const summary = String(content.summary ?? "").trim();

  if ((ec ?? 0) === 0 && (sc ?? 0) === 0 && !headline && !summary) {
    return { ok: true };
  }

  return {
    ok: false,
    message:
      "Primary resume already has content. Remove the Bao Dang sample first, or clear your resume manually—this action will not overwrite an existing resume unless it was created by the same sample loader.",
  };
}

export async function seedBaoDangSampleDataAction(): Promise<{ ok: boolean; message: string }> {
  const userId = await requireUserId();
  if (!userId) {
    return { ok: false, message: "You must be signed in." };
  }

  const supabase = await createClient();
  const resumeId = await getOrCreatePrimaryResumeId();
  if (!resumeId) {
    return { ok: false, message: "Could not create or load a primary resume version." };
  }

  const gate = await resumeAllowsSampleSeed(supabase, resumeId);
  if (!gate.ok) {
    return { ok: false, message: gate.message };
  }

  const ts = new Date().toISOString();

  await supabase
    .from("portfolio_projects")
    .delete()
    .eq("user_id", userId)
    .in("slug", [...BAO_DANG_SAMPLE_PROJECT_SLUGS]);

  await supabase
    .from("blog_posts")
    .delete()
    .eq("user_id", userId)
    .in("slug", [...BAO_DANG_SAMPLE_BLOG_SLUGS]);

  for (const p of baoDangSampleProjects) {
    const { error } = await supabase.from("portfolio_projects").insert({
      user_id: userId,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      body: p.body,
      github_url: p.github_url,
      featured: p.featured,
      sort_order: p.sort_order,
      published: p.published,
      updated_at: ts,
    });
    if (error) {
      return { ok: false, message: error.message };
    }
  }

  for (const b of baoDangSampleBlogPosts) {
    const { error } = await supabase.from("blog_posts").insert({
      user_id: userId,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      body: b.body,
      published: b.published,
      published_at: b.published ? ts : null,
      updated_at: ts,
    });
    if (error) {
      return { ok: false, message: error.message };
    }
  }

  await supabase.from("resume_experience").delete().eq("resume_version_id", resumeId);
  await supabase.from("resume_skills").delete().eq("resume_version_id", resumeId);

  await supabase
    .from("resume_versions")
    .update({ is_primary: false })
    .eq("user_id", userId)
    .neq("id", resumeId);

  const { error: rvError } = await supabase
    .from("resume_versions")
    .update({
      title: "Primary resume",
      is_primary: true,
      is_published: true,
      content: {
        headline: baoDangResumeHeadline,
        summary: baoDangResumeSummary,
        _sampleSeed: BAO_DANG_SAMPLE_SEED_MARKER,
      },
      updated_at: ts,
    })
    .eq("id", resumeId)
    .eq("user_id", userId);

  if (rvError) {
    return { ok: false, message: rvError.message };
  }

  for (const ex of baoDangSampleExperience) {
    const { error } = await supabase.from("resume_experience").insert({
      resume_version_id: resumeId,
      company: ex.company,
      role_title: ex.role_title,
      location: ex.location,
      start_date: ex.start_date,
      end_date: ex.end_date,
      description: ex.description,
      sort_order: ex.sort_order,
    });
    if (error) {
      return { ok: false, message: error.message };
    }
  }

  for (const sk of baoDangSampleSkills) {
    const { error } = await supabase.from("resume_skills").insert({
      resume_version_id: resumeId,
      category: sk.category,
      name: sk.name,
      proficiency: sk.proficiency,
      sort_order: sk.sort_order,
    });
    if (error) {
      return { ok: false, message: error.message };
    }
  }

  const { data: prof } = await supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle();
  const displayName = (prof as { display_name: string | null } | null)?.display_name?.trim();
  if (!displayName) {
    await supabase.from("profiles").update({ display_name: "Bao Dang", updated_at: ts }).eq("id", userId);
  }

  revalidatePortfolioPaths();
  return {
    ok: true,
    message:
      "Sample data loaded from the Bao Dang profile pack (repo markdown). Projects, one blog post, and primary resume are published; remove sample when you want a clean slate.",
  };
}

export async function removeBaoDangSampleDataAction(): Promise<{ ok: boolean; message: string }> {
  const userId = await requireUserId();
  if (!userId) {
    return { ok: false, message: "You must be signed in." };
  }

  const supabase = await createClient();
  const ts = new Date().toISOString();

  await supabase
    .from("portfolio_projects")
    .delete()
    .eq("user_id", userId)
    .in("slug", [...BAO_DANG_SAMPLE_PROJECT_SLUGS]);

  await supabase
    .from("blog_posts")
    .delete()
    .eq("user_id", userId)
    .in("slug", [...BAO_DANG_SAMPLE_BLOG_SLUGS]);

  const { data: versions } = await supabase
    .from("resume_versions")
    .select("id, content")
    .eq("user_id", userId);

  const marked = versions?.find(
    (v) => (v.content as Record<string, unknown> | null)?._sampleSeed === BAO_DANG_SAMPLE_SEED_MARKER,
  );

  if (marked?.id) {
    await supabase.from("resume_experience").delete().eq("resume_version_id", marked.id);
    await supabase.from("resume_skills").delete().eq("resume_version_id", marked.id);
    await supabase
      .from("resume_versions")
      .update({
        content: {},
        is_published: false,
        updated_at: ts,
      })
      .eq("id", marked.id)
      .eq("user_id", userId);
  }

  const { data: prof } = await supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle();
  const dn = (prof as { display_name: string | null } | null)?.display_name?.trim();
  if (dn === "Bao Dang") {
    await supabase.from("profiles").update({ display_name: null, updated_at: ts }).eq("id", userId);
  }

  revalidatePortfolioPaths();
  return {
    ok: true,
    message:
      "Removed sample projects, sample blog post, and sample-tagged resume rows. Profile display name was cleared only if it was still exactly “Bao Dang”.",
  };
}
