import { getAiTxt } from "@/lib/ai-discovery";

export const revalidate = 3600;

export function GET() {
  return new Response(getAiTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
