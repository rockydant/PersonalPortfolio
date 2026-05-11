"use client";

import { claimSiteAction } from "@/lib/site-actions";
import { useState, useTransition } from "react";

export function ClaimSiteBanner() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClaim() {
    setMessage(null);
    startTransition(async () => {
      const res = await claimSiteAction();
      if (res.ok) {
        window.location.reload();
        return;
      }
      setMessage(res.message);
    });
  }

  return (
    <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-sm">
      <p className="font-medium text-amber-800 dark:text-amber-200">Claim this site</p>
      <p className="mt-1 text-[var(--muted)]">
        The first signed-in account can claim ownership to manage contact inquiries and scope public
        resume content to you.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={onClaim}
        className="mt-2 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? "Claiming…" : "I am the site owner"}
      </button>
      {message && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{message}</p>}
    </div>
  );
}
