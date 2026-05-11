"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function loadSetupProgress(): Promise<{
  step_index: number;
  payload: Record<string, unknown>;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("setup_progress")
    .select("step_index, payload")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    return { step_index: 0, payload: {} };
  }

  return {
    step_index: data.step_index as number,
    payload: (data.payload as Record<string, unknown>) ?? {},
  };
}

export async function saveSetupProgress(
  stepIndex: number,
  payload: Record<string, unknown>,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not signed in." };
  }

  const { error } = await supabase.from("setup_progress").upsert(
    {
      user_id: user.id,
      step_index: stepIndex,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/setup");
  return {};
}
