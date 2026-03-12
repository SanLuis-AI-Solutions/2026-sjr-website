import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api/v1/nexus/sync (exempting sync endpoint if it uses its own API key)
         * Feel free to modify this pattern to include more paths.
         */
        "/admin/:path*",
        "/api/v1/nexus/publish-preview",
        "/api/v1/nexus/publish-approve",
        "/api/v1/nexus/publish-now",
    ],
};
