import { ResumePdfDocument } from "@/lib/resume-pdf-document";
import { getPublishedResume, getSiteOwnerId } from "@/lib/public-content";
import { renderToBuffer } from "@react-pdf/renderer";

export const runtime = "nodejs";

export async function GET() {
  const ownerId = await getSiteOwnerId();
  const bundle = await getPublishedResume(ownerId);

  if (!bundle) {
    return new Response("No published resume available.", { status: 404 });
  }

  const buffer = await renderToBuffer(<ResumePdfDocument bundle={bundle} />);
  const body = new Uint8Array(buffer);

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
