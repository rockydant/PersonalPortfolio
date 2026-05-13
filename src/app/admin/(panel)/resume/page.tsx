import type { Metadata } from "next";
import {
  addExperienceAction,
  addSkillAction,
  deleteExperienceFormAction,
  deleteSkillFormAction,
  updateResumeVersionAction,
} from "@/app/admin/(panel)/resume/actions";
import { getSessionUser } from "@/lib/auth-server";
import { getOrCreatePrimaryResume } from "@/lib/resume/get-or-create-primary-resume";
import { createClient } from "@/lib/supabase/server";
import { inputClass, labelClass } from "@/components/form-field-classes";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Resume CMS",
};

type ResumeContent = { headline?: string; summary?: string };

export default async function AdminResumePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const resumeResult = await getOrCreatePrimaryResume();
  if (!resumeResult.ok) {
    return (
      <p className="max-w-xl text-sm leading-relaxed text-red-600 dark:text-red-400">
        {resumeResult.message}
      </p>
    );
  }
  const resumeId = resumeResult.id;

  const supabase = await createClient();
  const [{ data: version }, { data: experience }, { data: skills }] = await Promise.all([
    supabase.from("resume_versions").select("*").eq("id", resumeId).single(),
    supabase
      .from("resume_experience")
      .select("*")
      .eq("resume_version_id", resumeId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("resume_skills")
      .select("*")
      .eq("resume_version_id", resumeId)
      .order("sort_order", { ascending: true }),
  ]);

  if (!version) {
    return <p className="text-sm text-[var(--muted)]">Resume version missing.</p>;
  }

  const content = (version.content as ResumeContent) ?? {};

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resume CMS</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Publish when ready; public pages use the published primary resume for the site owner.
        </p>
      </div>

      <section className="max-w-xl space-y-3 rounded-xl border border-[var(--border)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Resume version
        </h2>
        <form action={updateResumeVersionAction} className="space-y-3">
          <input type="hidden" name="id" value={resumeId} />
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input id="title" name="title" defaultValue={version.title as string} className={inputClass} />
          </div>
          <div>
            <label htmlFor="headline" className={labelClass}>
              Headline
            </label>
            <input
              id="headline"
              name="headline"
              defaultValue={content.headline ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="summary" className={labelClass}>
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={4}
              defaultValue={content.summary ?? ""}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_primary"
              defaultChecked={Boolean(version.is_primary)}
              className="rounded border-[var(--border)]"
            />
            Primary resume
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={Boolean(version.is_published)}
              className="rounded border-[var(--border)]"
            />
            Published on public site
          </label>
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)]"
          >
            Save resume
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Experience
        </h2>
        <ul className="space-y-3">
          {(experience ?? []).map((ex) => (
            <li
              key={ex.id as string}
              className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-[var(--border)] p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {(ex.role_title as string) ?? ""} · {ex.company as string}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {(ex.start_date as string) ?? "?"} — {(ex.end_date as string) ?? "Present"}
                  {ex.location ? ` · ${ex.location}` : ""}
                </p>
                {ex.description && (
                  <p className="mt-2 whitespace-pre-wrap text-[var(--muted)]">{ex.description as string}</p>
                )}
              </div>
              <form action={deleteExperienceFormAction}>
                <input type="hidden" name="id" value={ex.id as string} />
                <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form action={addExperienceAction} className="grid max-w-xl gap-2 rounded-xl border border-dashed border-[var(--border)] p-4">
          <input type="hidden" name="resume_version_id" value={resumeId} />
          <p className="text-sm font-medium">Add role</p>
          <input name="company" placeholder="Company" required className={inputClass} />
          <input name="role_title" placeholder="Title" required className={inputClass} />
          <input name="location" placeholder="Location" className={inputClass} />
          <div className="grid grid-cols-2 gap-2">
            <input name="start_date" type="date" className={inputClass} />
            <input name="end_date" type="date" className={inputClass} />
          </div>
          <textarea name="description" placeholder="Description" rows={3} className={inputClass} />
          <button
            type="submit"
            className="w-fit rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
          >
            Add experience
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {(skills ?? []).map((sk) => (
            <li
              key={sk.id as string}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-sm"
            >
              <span>
                {(sk.category as string) ? `${sk.category}: ` : ""}
                <strong>{sk.name as string}</strong>
                {(sk.proficiency as string) ? ` · ${sk.proficiency}` : ""}
              </span>
              <form action={deleteSkillFormAction}>
                <input type="hidden" name="id" value={sk.id as string} />
                <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                  ×
                </button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addSkillAction} className="grid max-w-md gap-2 rounded-xl border border-dashed border-[var(--border)] p-4">
          <input type="hidden" name="resume_version_id" value={resumeId} />
          <p className="text-sm font-medium">Add skill</p>
          <input name="category" placeholder="Category (optional)" className={inputClass} />
          <input name="name" placeholder="Skill name" required className={inputClass} />
          <input name="proficiency" placeholder="Proficiency (optional)" className={inputClass} />
          <button
            type="submit"
            className="w-fit rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
          >
            Add skill
          </button>
        </form>
      </section>
    </div>
  );
}
