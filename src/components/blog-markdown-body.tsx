import { markdownToSafeHtml } from "@/lib/markdown";

type Props = {
  markdown: string;
};

export function BlogMarkdownBody({ markdown }: Props) {
  const html = markdownToSafeHtml(markdown);
  if (!html) {
    return null;
  }
  return (
    <div
      className="md-content max-w-none leading-relaxed text-[var(--foreground)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
