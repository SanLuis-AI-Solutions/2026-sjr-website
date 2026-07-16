import { getAiSiteGuideMarkdown } from "@/lib/ai-discovery";

export const revalidate = 3600;

export function GET() {
  return new Response(getAiSiteGuideMarkdown(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
