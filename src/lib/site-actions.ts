"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimSiteAction(): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "You must be signed in." };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update({ owner_user_id: user.id, updated_at: new Date().toISOString() })
    .eq("id", "default")
    .is("owner_user_id", null)
    .select("id");

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data?.length) {
    return { ok: false, message: "Site is already claimed by another account." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/resume");
  revalidatePath("/projects");
  revalidatePath("/blog");
  return { ok: true };
}
