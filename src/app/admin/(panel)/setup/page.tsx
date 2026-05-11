import type { Metadata } from "next";
import { loadSetupProgress } from "@/app/admin/(panel)/setup/actions";
import { SetupWizard } from "@/components/setup-wizard";
import { getSessionUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Setup wizard",
};

export default async function AdminSetupPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const progress = await loadSetupProgress();
  const step = Math.min(Math.max(progress?.step_index ?? 0, 0), 6);

  return <SetupWizard initialStep={step} />;
}
