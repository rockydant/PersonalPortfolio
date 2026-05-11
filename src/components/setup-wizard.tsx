"use client";

import { saveSetupProgress } from "@/app/admin/(panel)/setup/actions";
import { useMemo, useState, useTransition } from "react";

const STEPS = [
  "Personal Identity",
  "Brand Settings",
  "Resume Setup",
  "Project Setup",
  "Blog Setup",
  "Contact Setup",
  "Launch Checklist",
] as const;

type Props = {
  initialStep: number;
};

export function SetupWizard({ initialStep }: Props) {
  const safeInitial = Math.min(Math.max(initialStep, 0), STEPS.length - 1);
  const [step, setStep] = useState(safeInitial);
  const [pending, startTransition] = useTransition();
  const label = STEPS[step];
  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  function persist(next: number) {
    startTransition(async () => {
      await saveSetupProgress(next, {});
    });
  }

  function goBack() {
    const next = Math.max(0, step - 1);
    setStep(next);
    persist(next);
  }

  function goNext() {
    const next = Math.min(STEPS.length - 1, step + 1);
    setStep(next);
    persist(next);
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
          Setup wizard
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{label}</h1>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Step {step + 1} of {STEPS.length}
          {pending ? " · saving…" : " · progress saved to your account"}
        </p>
      </div>

      <div className="min-h-[120px] rounded-xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
        {step === 0 && <p>Name, headline, and social links for your public profile.</p>}
        {step === 1 && <p>Logo, colors, typography tokens, and default SEO title template.</p>}
        {step === 2 && <p>Primary resume version, experience rows, and skills taxonomy.</p>}
        {step === 3 && <p>Featured GitHub projects, summaries, and publication toggles.</p>}
        {step === 4 && <p>Blog channels, default author, and first post outline.</p>}
        {step === 5 && <p>Contact routing, spam protection, and notification preferences.</p>}
        {step === 6 && (
          <ul className="list-inside list-disc space-y-2">
            <li>Set production env vars and `NEXT_PUBLIC_SITE_URL`.</li>
            <li>Claim the site in admin so inquiries route to you.</li>
            <li>Run Supabase migrations and verify RLS in the dashboard.</li>
            <li>Smoke-test magic link + OAuth sign-in on production.</li>
          </ul>
        )}
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          disabled={step === 0 || pending}
          onClick={goBack}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          disabled={step >= STEPS.length - 1 || pending}
          onClick={goNext}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
