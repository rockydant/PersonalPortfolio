"use client";

import { createClient } from "@/lib/supabase/browser";
import { PORTFOLIO_MEDIA_BUCKET } from "@/lib/storage";
import { useCallback, useEffect, useMemo, useState } from "react";

type FileRow = { name: string; id?: string | null };

export function MediaLibrary({ userId }: { userId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setMessage(null);
    const { data, error } = await supabase.storage.from(PORTFOLIO_MEDIA_BUCKET).list(userId, {
      limit: 100,
    });
    if (error) {
      setMessage(error.message);
      setFiles([]);
      return;
    }
    const rows = (data ?? []).filter((f) => f.name && f.name !== ".emptyFolderPlaceholder");
    setFiles(rows as FileRow[]);
  }, [userId, supabase]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    setBusy(true);
    setMessage(null);
    const safe = file.name.replace(/[^\w.\-()+ ]/g, "_");
    const path = `${userId}/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from(PORTFOLIO_MEDIA_BUCKET).upload(path, file, {
      upsert: false,
      contentType: file.type || undefined,
    });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    await refresh();
  }

  async function onRemove(name: string) {
    if (!confirm(`Delete ${name}?`)) {
      return;
    }
    setBusy(true);
    const path = `${userId}/${name}`;
    const { error } = await supabase.storage.from(PORTFOLIO_MEDIA_BUCKET).remove([path]);
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Media library</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Files upload to the{" "}
          <code className="rounded bg-[var(--border)] px-1 text-xs">{PORTFOLIO_MEDIA_BUCKET}</code>{" "}
          bucket under your user id. Run the latest Supabase migration so the bucket and policies
          exist.
        </p>
      </div>

      <div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--border)]/30">
          <input
            type="file"
            className="sr-only"
            disabled={busy}
            onChange={(ev) => void onUpload(ev)}
          />
          {busy ? "Working…" : "Upload file"}
        </label>
      </div>

      {message && <p className="text-sm text-red-600 dark:text-red-400">{message}</p>}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.length === 0 && !message && (
          <li className="text-sm text-[var(--muted)]">No files in your folder yet.</li>
        )}
        {files.map((f) => {
          const name = f.name as string;
          const fullPath = `${userId}/${name}`;
          const { data } = supabase.storage.from(PORTFOLIO_MEDIA_BUCKET).getPublicUrl(fullPath);
          const url = data.publicUrl;
          const isImg = /\.(png|jpe?g|gif|webp|svg)$/i.test(name);

          return (
            <li key={name} className="overflow-hidden rounded-xl border border-[var(--border)]">
              {isImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 items-center justify-center bg-[var(--border)]/30 text-xs text-[var(--muted)]">
                  File
                </div>
              )}
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium" title={name}>
                  {name}
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[var(--foreground)] underline-offset-2 hover:underline"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onRemove(name)}
                    className="text-xs text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
