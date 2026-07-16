import { getAiSummary } from "@/lib/ai-discovery";

export const revalidate = 3600;

export function GET() {
  return Response.json(getAiSummary(), {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
