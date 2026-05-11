"use client";

import { createBlogPostFormAction } from "@/app/admin/(panel)/blog/actions";
import { initialBlogCreateState } from "@/app/admin/(panel)/blog/create-blog-state";
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
      {pending ? "Saving…" : "Create post"}
    </button>
  );
}

export function CreateBlogPostForm() {
  const [state, formAction] = useFormState(createBlogPostFormAction, initialBlogCreateState);

  return (
    <form action={formAction} className="grid max-w-xl gap-3 rounded-xl border border-[var(--border)] p-4">
      <div>
        <label htmlFor="nb-title" className={labelClass}>
          Title
        </label>
        <input id="nb-title" name="title" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="nb-slug" className={labelClass}>
          Slug (optional)
        </label>
        <input id="nb-slug" name="slug" className={inputClass} />
      </div>
      <div>
        <label htmlFor="nb-excerpt" className={labelClass}>
          Excerpt (plain text)
        </label>
        <textarea id="nb-excerpt" name="excerpt" rows={2} className={inputClass} />
      </div>
      <div>
        <label htmlFor="nb-body" className={labelClass}>
          Body (Markdown)
        </label>
        <textarea id="nb-body" name="body" rows={10} className={inputClass} />
      </div>
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
          Post created. You can add another or open an item in the list to edit.
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
