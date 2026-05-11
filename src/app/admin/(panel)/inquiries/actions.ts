"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function setInquiryReadAction(
  id: string,
  read: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not signed in." };
  }

  const { error } = await supabase.from("contact_inquiries").update({ read }).eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return {};
}

export async function setInquiryReadFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const read = formData.get("read") === "true";
  if (!id) {
    return;
  }
  await setInquiryReadAction(id, read);
}
