import { getAiServiceCatalog } from "@/lib/ai-discovery";

export const revalidate = 3600;

export function GET() {
  return Response.json(getAiServiceCatalog(), {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
