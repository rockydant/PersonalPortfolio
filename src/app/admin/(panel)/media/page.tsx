import type { Metadata } from "next";
import { MediaLibrary } from "@/components/media-library";
import { getSessionUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Media library",
};

export default async function AdminMediaPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  return <MediaLibrary userId={user.id} />;
}
