"use client";

import { createProjectFormAction } from "@/app/admin/(panel)/projects/actions";
import {
  initialProjectCreateState,
} from "@/app/admin/(panel)/projects/create-project-state";
import { inputClass, labelClass } from "@/components/form-field-classes";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] disabled:opacity-50"
    >
      {pending ? "Creating…" : "Create"}
    </button>
  );
}

export function CreateProjectForm() {
  const [state, formAction] = useFormState(createProjectFormAction, initialProjectCreateState);

  return (
    <form action={formAction} className="grid max-w-xl gap-3 rounded-xl border border-[var(--border)] p-4">
      <div>
        <label htmlFor="np-title" className={labelClass}>
          Title
        </label>
        <input id="np-title" name="title" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-slug" className={labelClass}>
          Slug (optional)
        </label>
        <input id="np-slug" name="slug" className={inputClass} placeholder="auto from title" />
      </div>
      <div>
        <label htmlFor="np-summary" className={labelClass}>
          Summary
        </label>
        <textarea id="np-summary" name="summary" rows={2} className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-body" className={labelClass}>
          Body
        </label>
        <textarea id="np-body" name="body" rows={4} className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-gh" className={labelClass}>
          GitHub URL
        </label>
        <input id="np-gh" name="github_url" type="url" className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-sort" className={labelClass}>
          Sort order
        </label>
        <input id="np-sort" name="sort_order" type="number" defaultValue={0} className={inputClass} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" className="rounded border-[var(--border)]" />
        Featured
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" className="rounded border-[var(--border)]" />
        Published
      </label>
      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="text-sm text-green-700 dark:text-green-400" role="status">
          Project created. Add another or edit from the list below.
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
