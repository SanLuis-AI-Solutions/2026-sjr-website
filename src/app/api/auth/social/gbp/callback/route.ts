import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleBusinessCode,
  fetchGoogleBusinessLocationContext,
  GBP_OAUTH_STATE_COOKIE,
  persistGoogleBusinessConnection,
} from "@/lib/automation/google-business-profile";

export const dynamic = "force-dynamic";

function redirectToConnections(
  request: NextRequest,
  oauthState: string,
  oauthReason?: string
) {
  const url = new URL("/admin/nexus", request.nextUrl.origin);
  url.searchParams.set("view", "connections");
  url.searchParams.set("oauth", oauthState);
  url.searchParams.set("provider", "gbp");
  if (oauthReason) {
    url.searchParams.set("oauth_reason", oauthReason);
  }
  return NextResponse.redirect(url);
}

function classifyGoogleBusinessOAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const normalized = message.toLowerCase();

  if (normalized.includes("no accessible google business profile locations")) {
    return "no-location";
  }

  if (
    normalized.includes("permission_denied") ||
    normalized.includes("insufficient") ||
    normalized.includes("not authorized") ||
    normalized.includes("forbidden")
  ) {
    return "permission-denied";
  }

  if (
    normalized.includes("invalid_grant") ||
    normalized.includes("invalid_request") ||
    normalized.includes("token")
  ) {
    return "token-exchange";
  }

  if (normalized.includes("nexus_config") || normalized.includes("upsert")) {
    return "persist-failed";
  }

  return "callback-failed";
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")?.trim() || "";
  const code = request.nextUrl.searchParams.get("code")?.trim() || "";
  const oauthError = request.nextUrl.searchParams.get("error")?.trim() || "";
  const cookieState = request.cookies.get(GBP_OAUTH_STATE_COOKIE)?.value?.trim() || "";

  if (oauthError) {
    const response = redirectToConnections(request, "denied", oauthError);
    response.cookies.delete(GBP_OAUTH_STATE_COOKIE);
    return response;
  }

  if (!state || !cookieState || state !== cookieState || !code) {
    const response = redirectToConnections(request, "failed", "state-mismatch");
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
  } catch (error) {
    const response = redirectToConnections(
      request,
      "failed",
      classifyGoogleBusinessOAuthError(error)
    );
    response.cookies.delete(GBP_OAUTH_STATE_COOKIE);
    return response;
  }
}
