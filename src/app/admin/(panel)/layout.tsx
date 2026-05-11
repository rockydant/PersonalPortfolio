import { AdminSignOut } from "@/components/admin-sign-out";
import { ClaimSiteBanner } from "@/components/claim-site-banner";
import { getSessionUser } from "@/lib/auth-server";
import { getSiteSettings } from "@/lib/site-settings";
import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/setup", label: "Setup wizard" },
  { href: "/admin/resume", label: "Resume CMS" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/media", label: "Media" },
] as const;

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, settings] = await Promise.all([getSessionUser(), getSiteSettings()]);
  const showClaimBanner = Boolean(user && settings && !settings.owner_user_id);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-6 md:w-56 md:border-b-0 md:border-r">
        <Link href="/" className="text-sm font-semibold text-[var(--foreground)]">
          ← Site
        </Link>
        <nav className="mt-6 flex flex-col gap-2 text-sm text-[var(--muted)]">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 hover:bg-[var(--border)]/40 hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <AdminSignOut />
      </aside>
      <div className="flex-1 px-4 py-8 md:px-10">
        {showClaimBanner && <ClaimSiteBanner />}
        {children}
      </div>
    </div>
  );
}
