import { ImageResponse } from "next/og";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#fafafa",
          color: "#0a0a0a",
          padding: 80,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.02em" }}>Portfolio</div>
        <div style={{ fontSize: 28, marginTop: 20, color: "#525252", maxWidth: 900 }}>
          Executive portfolio, resume, and inbound CMS—Supabase and Vercel ready.
        </div>
      </div>
    ),
    { ...size },
  );
}
