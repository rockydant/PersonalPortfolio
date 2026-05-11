import { createClient } from "@/lib/supabase/server";

export type SiteSettingsRow = {
  id: string;
  owner_user_id: string | null;
};

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("id, owner_user_id")
    .eq("id", "default")
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data as SiteSettingsRow;
}
