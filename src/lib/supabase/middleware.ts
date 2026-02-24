import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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
                    cookiesToSet.forEach(({ name, value, options }) =>
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

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const isLoginPage = request.nextUrl.pathname === "/admin/login";

        if (!user && !isLoginPage) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        if (user && isLoginPage) {
            return NextResponse.redirect(new URL("/admin/nexus", request.url));
        }

        // Strict Email Gating
        if (user && user.email !== "contact@sanluisai.com") {
            // Sign out unauthorized user
            await supabase.auth.signOut();
            return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
        }
    }

    return response;
}
