import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleBusinessCode,
  fetchGoogleBusinessLocationContext,
  GBP_OAUTH_STATE_COOKIE,
  persistGoogleBusinessConnection,
} from "@/lib/automation/google-business-profile";

export const dynamic = "force-dynamic";

function redirectToConnections(request: NextRequest, oauthState: string) {
  return NextResponse.redirect(
    new URL(`/admin/nexus?view=connections&oauth=${oauthState}&provider=gbp`, request.nextUrl.origin)
  );
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")?.trim() || "";
  const code = request.nextUrl.searchParams.get("code")?.trim() || "";
  const oauthError = request.nextUrl.searchParams.get("error")?.trim() || "";
  const cookieState = request.cookies.get(GBP_OAUTH_STATE_COOKIE)?.value?.trim() || "";

  if (oauthError) {
    const response = redirectToConnections(request, "denied");
    response.cookies.delete(GBP_OAUTH_STATE_COOKIE);
    return response;
  }

  if (!state || !cookieState || state !== cookieState || !code) {
    const response = redirectToConnections(request, "failed");
    response.cookies.delete(GBP_OAUTH_STATE_COOKIE);
    return response;
  }

  try {
    const { client, tokens } = await exchangeGoogleBusinessCode(code, request.nextUrl.origin);
    const location = await fetchGoogleBusinessLocationContext(client);

    await persistGoogleBusinessConnection({
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        scope: tokens.scope,
        expiry_date: tokens.expiry_date ?? null,
      },
      location,
    });

    const response = redirectToConnections(request, "connected");
    response.cookies.delete(GBP_OAUTH_STATE_COOKIE);
    return response;
  } catch {
    const response = redirectToConnections(request, "failed");
    response.cookies.delete(GBP_OAUTH_STATE_COOKIE);
    return response;
  }
}
