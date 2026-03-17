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
  oauthReason?: string,
  oauthDetail?: string
) {
  const url = new URL("/admin/nexus", request.nextUrl.origin);
  url.searchParams.set("view", "connections");
  url.searchParams.set("oauth", oauthState);
  url.searchParams.set("provider", "gbp");
  if (oauthReason) {
    url.searchParams.set("oauth_reason", oauthReason);
  }
  if (oauthDetail) {
    url.searchParams.set("oauth_detail", oauthDetail);
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

  if (
    normalized.includes("quota exceeded") ||
    normalized.includes("requests per minute") ||
    normalized.includes("queries per minute") ||
    normalized.includes("mybusinessaccountmanagement.googleapis.com")
  ) {
    return "quota-blocked";
  }

  if (
    normalized.includes("service_disabled") ||
    normalized.includes("accessnotconfigured") ||
    normalized.includes("has not been used in project") ||
    normalized.includes("enable it by visiting")
  ) {
    return "service-disabled";
  }

  if (normalized.includes("nexus_config") || normalized.includes("upsert")) {
    return "persist-failed";
  }

  return "callback-failed";
}

function sanitizeGoogleBusinessOAuthDetail(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const normalized = message.replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return normalized.slice(0, 220);
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
    const oauthReason = classifyGoogleBusinessOAuthError(error);
    const oauthDetail =
      oauthReason === "callback-failed" || oauthReason === "service-disabled"
        ? sanitizeGoogleBusinessOAuthDetail(error)
        : undefined;
    console.error("Google Business OAuth callback failed", {
      oauthReason,
      detail: sanitizeGoogleBusinessOAuthDetail(error),
    });
    const response = redirectToConnections(
      request,
      "failed",
      oauthReason,
      oauthDetail || undefined
    );
    response.cookies.delete(GBP_OAUTH_STATE_COOKIE);
    return response;
  }
}
