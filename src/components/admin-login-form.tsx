"use client";

import { createClient } from "@/lib/supabase/browser";
import { safeInternalPath } from "@/lib/auth-redirect";
import { useState } from "react";

type Props = {
  nextPath: string;
  supabaseConfigured: boolean;
};

function authCallbackUrl(nextPath: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  const origin =
    typeof window !== "undefined" ? fromEnv || window.location.origin : fromEnv;
  const next = safeInternalPath(nextPath, "/admin");
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export function AdminLoginForm({ nextPath, supabaseConfigured }: Props) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  if (!supabaseConfigured) {
    return (
      <div className="space-y-3 text-sm text-[var(--muted)]">
        <p>
          Set <code className="rounded bg-[var(--border)] px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-[var(--border)] px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to
          enable sign-in. Without them, the proxy skips admin auth so you can preview the UI
          locally.
        </p>
      </div>
    );
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setBusy("email");
    const supabase = createClient();
    const redirectTo = authCallbackUrl(nextPath);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });
    setBusy(null);
    if (error) {
      setMessage({ kind: "err", text: error.message });
      return;
    }
    setMessage({
      kind: "ok",
      text: "Check your email for the sign-in link.",
    });
  }

  async function oauth(provider: "github" | "google") {
    setMessage(null);
    setBusy(provider);
    const supabase = createClient();
    const redirectTo = authCallbackUrl(nextPath);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    setBusy(null);
    if (error) {
      setMessage({ kind: "err", text: error.message });
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={sendMagicLink} className="space-y-3">
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">
            Email (magic link)
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--muted)]"
          />
        </div>
        <button
          type="submit"
          disabled={busy !== null}
          className="w-full rounded-full bg-[var(--accent)] py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50"
        >
          {busy === "email" ? "Sending…" : "Send magic link"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-[var(--background)] px-2 text-[var(--muted)]">Or continue with</span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => oauth("github")}
          className="rounded-full border border-[var(--border)] py-2.5 text-sm font-medium transition-colors hover:bg-[var(--border)]/30 disabled:opacity-50"
        >
          {busy === "github" ? "Redirecting…" : "GitHub"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => oauth("google")}
          className="rounded-full border border-[var(--border)] py-2.5 text-sm font-medium transition-colors hover:bg-[var(--border)]/30 disabled:opacity-50"
        >
          {busy === "google" ? "Redirecting…" : "Google"}
        </button>
      </div>

      {message && (
        <p
          className={`text-sm ${message.kind === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {message.text}
        </p>
      )}

      <p className="text-xs text-[var(--muted)]">
        In Supabase: enable Email (magic link) and the GitHub / Google providers. Under Authentication
        → URL configuration, add this app&apos;s origin and{" "}
        <code className="rounded bg-[var(--border)] px-1">/auth/callback</code> to Redirect URLs.
        For production, set <code className="rounded bg-[var(--border)] px-1">NEXT_PUBLIC_SITE_URL</code>{" "}
        so email links use the correct host.
      </p>
    </div>
  );
}
