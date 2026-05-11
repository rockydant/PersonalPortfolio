import { getPublishedPostBySlug, getSiteOwnerId } from "@/lib/public-content";
import { ImageResponse } from "next/og";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const ownerId = await getSiteOwnerId();
  const post = await getPublishedPostBySlug(slug, ownerId);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            background: "#fafafa",
            color: "#737373",
            fontSize: 36,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          Post not found
        </div>
      ),
      { ...size },
    );
  }

  const title = (post.title as string).slice(0, 100);
  const excerpt = ((post.excerpt as string) || "").slice(0, 220);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          background: "#fafafa",
          color: "#0a0a0a",
          padding: 72,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        {excerpt ? (
          <div style={{ fontSize: 26, color: "#525252", marginTop: 28, maxWidth: 1020, lineHeight: 1.35 }}>
            {excerpt}
          </div>
        ) : null}
        <div style={{ fontSize: 18, color: "#a3a3a3", marginTop: 36 }}>Blog</div>
      </div>
    ),
    { ...size },
  );
}
