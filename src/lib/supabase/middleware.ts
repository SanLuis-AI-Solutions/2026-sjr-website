import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/*
 * Date: 2026-02-26
 * Time: Local (CST)
 * Context/Notes: Extended middleware auth gating to protect social OAuth API routes with admin-only access.
 * Agent Name: Codex
 */

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const allowedAdminEmails = new Set(
        (process.env.ADMIN_EMAILS || "contact@sanluisai.com")
            .split(",")
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
    );

    const pathname = request.nextUrl.pathname;
    const hostname = (request.nextUrl.hostname || "").toLowerCase();
    const isAdminPath = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/admin/login";
    const isSocialOAuthPath = pathname.startsWith("/api/auth/social/");
    const wantsPreview = request.nextUrl.searchParams.get("preview") === "1";
    const hasPreviewCookie = request.cookies.get("sjr_admin_preview")?.value === "1";
    const isLocalPreviewHost = hostname === "127.0.0.1" || hostname === "localhost";
    const isDevPreview =
        process.env.NODE_ENV === "development" &&
        isLocalPreviewHost &&
        (wantsPreview || hasPreviewCookie);

    if (isDevPreview && (isAdminPath || isSocialOAuthPath)) {
        if (wantsPreview && !hasPreviewCookie) {
            response.cookies.set("sjr_admin_preview", "1", {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            });
        }
        return response;
    }

    if (isAdminPath || isSocialOAuthPath) {
        if (!user) {
            if (isSocialOAuthPath) {
                return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
            }

            if (!isLoginPage) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }
        }

        if (user && isLoginPage) {
            return NextResponse.redirect(new URL("/admin/nexus", request.url));
        }

        // Strict Email Gating (env-driven allowlist).
        if (user && !allowedAdminEmails.has((user.email || "").toLowerCase())) {
            await supabase.auth.signOut();

            if (isSocialOAuthPath) {
                return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
            }

            return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
        }
    }

    return response;
}
