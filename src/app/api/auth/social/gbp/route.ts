import { NextRequest, NextResponse } from "next/server";
import {
  buildGoogleBusinessAuthUrl,
  GBP_OAUTH_STATE_COOKIE,
  hasGoogleBusinessOAuthConfig,
} from "@/lib/automation/google-business-profile";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  if (!hasGoogleBusinessOAuthConfig(origin)) {
    return NextResponse.redirect(
      new URL("/admin/nexus?view=connections&oauth=not-configured&provider=gbp", origin)
    );
  }

  const state = crypto.randomUUID();
  const response = NextResponse.redirect(buildGoogleBusinessAuthUrl(state, origin));

  response.cookies.set(GBP_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/api/auth/social/gbp",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });

  return response;
}
