import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-2 text-[var(--muted)]">
          Messages are stored in `contact_inquiries` when Supabase is configured.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
