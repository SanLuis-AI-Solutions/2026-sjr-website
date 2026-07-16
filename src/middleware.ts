import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accept = request.headers.get("accept") || "";

    if (
        request.method === "GET" &&
        accept.includes("text/markdown") &&
        !pathname.startsWith("/_next") &&
        !pathname.startsWith("/ai") &&
        !pathname.startsWith("/api") &&
        !pathname.startsWith("/admin") &&
        !pathname.startsWith("/.well-known") &&
        !/\.[a-z0-9]+$/i.test(pathname)
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/ai/markdown";
        url.searchParams.set("path", pathname);
        return NextResponse.rewrite(url);
    }

    if (
        pathname.startsWith("/admin") ||
        pathname === "/api/v1/nexus/publish-preview" ||
        pathname === "/api/v1/nexus/publish-approve" ||
        pathname === "/api/v1/nexus/publish-now"
    ) {
        return await updateSession(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
