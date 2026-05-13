import { createClient } from "@/lib/supabase/server";

export type GetOrCreatePrimaryResumeResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

/**
 * Resolves the signed-in user's primary resume version id, or inserts a new primary row.
 * Lives outside `"use server"` files so other server modules can call it without action-boundary quirks.
 */
export async function getOrCreatePrimaryResume(): Promise<GetOrCreatePrimaryResumeResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { ok: false, message: `Auth error: ${userError.message}` };
  }
  if (!user?.id) {
    return { ok: false, message: "Not signed in. Refresh the page and sign in again." };
  }

  const userId = user.id;

  const { data: primary, error: primaryError } = await supabase
    .from("resume_versions")
    .select("id")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .maybeSingle();

  if (primaryError) {
    return {
      ok: false,
      message: `Could not read primary resume: ${primaryError.message}. If multiple rows are marked primary, fix them in Supabase (Table editor → resume_versions).`,
    };
  }
  if (primary?.id) {
    return { ok: true, id: primary.id as string };
  }

  const { data: first, error: firstError } = await supabase
    .from("resume_versions")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstError) {
    return { ok: false, message: `Could not list resume versions: ${firstError.message}` };
  }
  if (first?.id) {
    return { ok: true, id: first.id as string };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("resume_versions")
    .insert({
      user_id: userId,
      title: "Primary resume",
      is_primary: true,
      is_published: false,
      content: {},
    })
    .select("id")
    .single();

  if (insertError) {
    return {
      ok: false,
      message: `Could not create resume row: ${insertError.message}. Confirm migrations are applied and RLS policies exist for resume_versions (see supabase/migrations).`,
    };
  }
  if (!inserted?.id) {
    return { ok: false, message: "Insert returned no row id." };
  }

  return { ok: true, id: inserted.id as string };
}
