import { marked } from "marked";
import sanitizeHtml, { type IOptions } from "sanitize-html";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const sanitizeOptions: IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "h1",
    "h2",
    "h3",
    "h4",
    "img",
    "pre",
    "code",
    "hr",
    "span",
    "del",
    "ins",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    code: ["class"],
    td: ["colspan", "rowspan", "align"],
    th: ["colspan", "rowspan", "align"],
    table: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (_tag, attribs) => ({
      tagName: "a",
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
  },
};

/** Renders GitHub-flavored Markdown to a safe HTML fragment for `dangerouslySetInnerHTML`. */
export function markdownToSafeHtml(markdown: string): string {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return "";
  }
  const raw = marked.parse(trimmed, { async: false }) as string;
  return sanitizeHtml(raw, sanitizeOptions);
}
