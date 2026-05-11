"use client";

import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onSignOut() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push("/admin/login");
      router.refresh();
      return;
    }
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setBusy(false);
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onSignOut}
      className="mt-8 w-full rounded-md border border-[var(--border)] px-2 py-2 text-left text-sm text-[var(--muted)] transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--foreground)] disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
