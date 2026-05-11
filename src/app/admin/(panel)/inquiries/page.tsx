import type { Metadata } from "next";
import { setInquiryReadFormAction } from "@/app/admin/(panel)/inquiries/actions";
import { getSessionUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Inquiries",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default async function AdminInquiriesPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("contact_inquiries")
    .select("id, name, email, message, read, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contact inquiries</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Only the site owner (or any signed-in user before the site is claimed) can read messages.
        </p>
      </div>

      <ul className="space-y-4">
        {(rows ?? []).length === 0 && (
          <li className="text-sm text-[var(--muted)]">No inquiries yet.</li>
        )}
        {(rows ?? []).map((row) => (
          <li
            key={row.id as string}
            className={`rounded-xl border border-[var(--border)] p-4 ${row.read ? "opacity-80" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{row.name as string}</p>
                <p className="text-sm text-[var(--muted)]">{row.email as string}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{row.message as string}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{formatDate(row.created_at as string)}</p>
              </div>
              <form action={setInquiryReadFormAction} className="shrink-0">
                <input type="hidden" name="id" value={row.id as string} />
                <input type="hidden" name="read" value={row.read ? "false" : "true"} />
                <button
                  type="submit"
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-xs font-medium hover:bg-[var(--border)]/30"
                >
                  {row.read ? "Mark unread" : "Mark read"}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
