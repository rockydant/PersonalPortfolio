"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Network error.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--muted)]"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--muted)]"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--muted)]"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send"}
      </button>
      {status === "ok" && <p className="text-sm text-green-600 dark:text-green-400">Thanks—your message was received.</p>}
      {status === "err" && message && (
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      )}
    </form>
  );
}
