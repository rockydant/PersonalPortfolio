/** Prevent open redirects: only same-origin relative paths. */
export function safeInternalPath(next: string | null | undefined, fallback = "/admin"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}
