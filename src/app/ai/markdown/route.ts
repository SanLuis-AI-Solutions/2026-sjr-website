import { renderMarkdownForPath } from "@/lib/ai-discovery";

export const revalidate = 3600;

export function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.searchParams.get("path") || "/";
  const markdown = renderMarkdownForPath(pathname);

  if (!markdown) {
    return new Response("Not found\n", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
      vary: "Accept",
    },
  });
}
