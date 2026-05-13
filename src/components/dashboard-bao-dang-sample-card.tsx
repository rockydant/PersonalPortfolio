"use client";

import {
  removeBaoDangSampleDataAction,
  seedBaoDangSampleDataAction,
} from "@/lib/sample-data/bao-dang-sample-actions";
import { useState, useTransition } from "react";

export function DashboardBaoDangSampleCard() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function run(fn: () => Promise<{ ok: boolean; message: string }>) {
    setMessage(null);
    startTransition(() => {
      void (async () => {
        const r = await fn();
        setMessage({ kind: r.ok ? "ok" : "err", text: r.message });
      })();
    });
  }

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        Sample profile (Bao Dang)
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Load curated projects, a blog post, and resume content derived from{" "}
        <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs">bao-dang.md</code> in this
        repository. Your separate PDF resume is not imported; use it as the printable reference. Only
        rows tagged for this sample are removed on cleanup.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(seedBaoDangSampleDataAction)}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] disabled:opacity-50"
        >
          {pending ? "Working…" : "Load sample data"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(removeBaoDangSampleDataAction)}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--border)]/30 disabled:opacity-50"
        >
          Remove sample data
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.kind === "ok" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
