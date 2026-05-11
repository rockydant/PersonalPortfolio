import { createClient } from "@/lib/supabase/server";

export async function getSiteOwnerId(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("owner_user_id")
    .eq("id", "default")
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  const row = data as { owner_user_id: string | null };
  return row.owner_user_id ?? null;
}

export async function getPublishedProjects(ownerId: string | null) {
  const supabase = await createClient();
  let q = supabase
    .from("portfolio_projects")
    .select("id, title, slug, summary, github_url, featured, sort_order, updated_at")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (ownerId) {
    q = q.eq("user_id", ownerId);
  }
  const { data } = await q;
  return data ?? [];
}

export async function getPublishedBlogPosts(ownerId: string | null) {
  const supabase = await createClient();
  let q = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, published_at, updated_at")
    .eq("published", true)
    .order("updated_at", { ascending: false });
  if (ownerId) {
    q = q.eq("user_id", ownerId);
  }
  const { data } = await q;
  return data ?? [];
}

export async function getPublishedPostBySlug(slug: string, ownerId: string | null) {
  const supabase = await createClient();
  let q = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, body, published_at, updated_at")
    .eq("published", true)
    .eq("slug", slug);
  if (ownerId) {
    q = q.eq("user_id", ownerId);
  }
  const { data } = await q.maybeSingle();
  return data;
}

type ResumeContent = {
  headline?: string;
  summary?: string;
};

export type ResumeBundle = {
  version: {
    id: string;
    title: string;
    content: ResumeContent;
    updated_at: string;
  };
  experience: Array<{
    id: string;
    company: string;
    role_title: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    sort_order: number;
  }>;
  skills: Array<{
    id: string;
    category: string | null;
    name: string;
    proficiency: string | null;
    sort_order: number;
  }>;
};

export async function getPublishedResume(ownerId: string | null): Promise<ResumeBundle | null> {
  if (!ownerId) {
    return null;
  }
  const supabase = await createClient();
  const { data: version } = await supabase
    .from("resume_versions")
    .select("id, title, content, updated_at")
    .eq("user_id", ownerId)
    .eq("is_published", true)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!version) {
    return null;
  }

  const vid = version.id as string;

  const [{ data: experience }, { data: skills }] = await Promise.all([
    supabase
      .from("resume_experience")
      .select(
        "id, company, role_title, location, start_date, end_date, description, sort_order",
      )
      .eq("resume_version_id", vid)
      .order("sort_order", { ascending: true }),
    supabase
      .from("resume_skills")
      .select("id, category, name, proficiency, sort_order")
      .eq("resume_version_id", vid)
      .order("sort_order", { ascending: true }),
  ]);

  return {
    version: {
      id: vid,
      title: version.title as string,
      content: (version.content as ResumeContent) ?? {},
      updated_at: version.updated_at as string,
    },
    experience: (experience ?? []) as ResumeBundle["experience"],
    skills: (skills ?? []) as ResumeBundle["skills"],
  };
}
