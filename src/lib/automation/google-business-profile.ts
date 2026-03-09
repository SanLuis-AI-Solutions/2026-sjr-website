import { google } from "googleapis";
import type {
  NexusConfigPlatform,
  NexusConfigRow,
} from "@/lib/automation/nexus-config";
import { getNexusConfig, upsertNexusConfig } from "@/lib/automation/nexus-config";

const GBP_PLATFORM: NexusConfigPlatform = "gbp";
const GBP_SCOPE = "https://www.googleapis.com/auth/business.manage";

export const GBP_OAUTH_STATE_COOKIE = "sjr_social_oauth_state_gbp";

export type GoogleBusinessLocationContext = {
  accountResourceName: string;
  accountName: string;
  locationName: string;
  locationResourceName: string;
  locationTitle: string | null;
  mapsUri: string | null;
  newReviewUri: string | null;
  placeId: string | null;
  websiteUri: string | null;
  storeCode: string | null;
};

type GoogleBusinessTokenContext = {
  accessToken: string;
  locationResourceName: string;
  config: NexusConfigRow | null;
  source: "oauth" | "env";
};

type GoogleBusinessPostInput = {
  title: string;
  excerpt: string;
  canonicalUrl: string;
  imageUrl?: string | null;
};

function trimToNull(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function resolveGoogleBusinessOAuthEnv(origin?: string) {
  return {
    clientId:
      trimToNull(process.env.NEXUS_GBP_CLIENT_ID) ||
      trimToNull(process.env.GOOGLE_OAUTH_CLIENT_ID),
    clientSecret:
      trimToNull(process.env.NEXUS_GBP_CLIENT_SECRET) ||
      trimToNull(process.env.GOOGLE_OAUTH_CLIENT_SECRET),
    baseUrl: trimToNull(process.env.NEXUS_OAUTH_BASE_URL) || trimToNull(origin),
  };
}

function resolveGoogleBusinessLocationFromPayload(payload: Record<string, unknown>) {
  const value =
    typeof payload.locationResourceName === "string"
      ? payload.locationResourceName
      : typeof payload.locationName === "string" && typeof payload.accountResourceName === "string"
        ? `${payload.accountResourceName}/${payload.locationName}`
        : null;

  return trimToNull(value);
}

function resolveGoogleBusinessLocationFromEnv() {
  return (
    trimToNull(process.env.NEXUS_GBP_LOCATION_NAME) ||
    trimToNull(process.env.NEXUS_GBP_LOCATION_RESOURCE)
  );
}

function normalizeExpiryDate(expiryDate?: number | null) {
  if (!expiryDate) return null;
  const iso = new Date(expiryDate).toISOString();
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

function isExpiringSoon(expiresAt?: string | null) {
  if (!expiresAt) return true;
  const timestamp = Date.parse(expiresAt);
  if (Number.isNaN(timestamp)) return true;
  return timestamp <= Date.now() + 60_000;
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function buildPostSummary(input: GoogleBusinessPostInput) {
  return truncate(
    [input.title.trim(), input.excerpt.trim()].filter(Boolean).join("\n\n"),
    1400
  );
}

export function hasGoogleBusinessOAuthConfig(origin?: string) {
  const env = resolveGoogleBusinessOAuthEnv(origin);
  return Boolean(env.clientId && env.clientSecret && env.baseUrl);
}

export function getGoogleBusinessRedirectUri(origin?: string) {
  const env = resolveGoogleBusinessOAuthEnv(origin);
  if (!env.baseUrl) {
    throw new Error("Missing NEXUS_OAUTH_BASE_URL or request origin for Google Business callback.");
  }
  return new URL("/api/auth/social/gbp/callback", env.baseUrl).toString();
}

function createGoogleBusinessOAuthClient(opts?: {
  origin?: string;
  requireRedirectUri?: boolean;
}) {
  const requireRedirectUri = opts?.requireRedirectUri ?? true;
  const env = resolveGoogleBusinessOAuthEnv(opts?.origin);
  if (!env.clientId || !env.clientSecret) {
    throw new Error("Google Business OAuth client credentials are missing.");
  }

  return new google.auth.OAuth2(
    env.clientId,
    env.clientSecret,
    requireRedirectUri ? getGoogleBusinessRedirectUri(opts?.origin) : undefined
  );
}

export function buildGoogleBusinessAuthUrl(state: string, origin?: string) {
  const client = createGoogleBusinessOAuthClient({ origin, requireRedirectUri: true });
  return client.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: [GBP_SCOPE],
    state,
  });
}

export async function exchangeGoogleBusinessCode(code: string, origin?: string) {
  const client = createGoogleBusinessOAuthClient({ origin, requireRedirectUri: true });
  const { tokens } = await client.getToken({
    code,
    redirect_uri: getGoogleBusinessRedirectUri(origin),
  });
  client.setCredentials(tokens);
  return { client, tokens };
}

export async function fetchGoogleBusinessLocationContext(
  client: InstanceType<typeof google.auth.OAuth2>
): Promise<GoogleBusinessLocationContext> {
  const accountApi = google.mybusinessaccountmanagement({
    version: "v1",
    auth: client,
  });
  const businessInfoApi = google.mybusinessbusinessinformation({
    version: "v1",
    auth: client,
  });

  const accountsResponse = await accountApi.accounts.list({ pageSize: 20 });
  const accounts = accountsResponse.data.accounts || [];

  for (const account of accounts) {
    if (!account.name) continue;

    const locationsResponse = await businessInfoApi.accounts.locations.list({
      parent: account.name,
      orderBy: "title",
      pageSize: 100,
      readMask:
        "name,title,storeCode,metadata.mapsUri,metadata.newReviewUri,metadata.placeId,websiteUri",
    });

    const location = (locationsResponse.data.locations || []).find((item) => item.name);
    if (!location?.name) continue;

    return {
      accountResourceName: account.name,
      accountName: account.accountName || account.name,
      locationName: location.name,
      locationResourceName: `${account.name}/${location.name}`,
      locationTitle: location.title || null,
      mapsUri: location.metadata?.mapsUri || null,
      newReviewUri: location.metadata?.newReviewUri || null,
      placeId: location.metadata?.placeId || null,
      websiteUri: location.websiteUri || null,
      storeCode: location.storeCode || null,
    };
  }

  throw new Error("No accessible Google Business Profile locations were found for this account.");
}

export async function persistGoogleBusinessConnection(opts: {
  tokens: {
    access_token?: string | null;
    refresh_token?: string | null;
    token_type?: string | null;
    scope?: string | null;
    expiry_date?: number | null;
  };
  location: GoogleBusinessLocationContext;
}) {
  const existing = await getNexusConfig(GBP_PLATFORM);

  await upsertNexusConfig({
    platform: GBP_PLATFORM,
    access_token: opts.tokens.access_token || existing?.access_token || null,
    refresh_token: opts.tokens.refresh_token || existing?.refresh_token || null,
    token_type: opts.tokens.token_type || existing?.token_type || "Bearer",
    scope: opts.tokens.scope || existing?.scope || GBP_SCOPE,
    expires_at: normalizeExpiryDate(opts.tokens.expiry_date) || existing?.expires_at || null,
    payload: {
      ...(existing?.payload || {}),
      accountName: opts.location.accountName,
      accountResourceName: opts.location.accountResourceName,
      locationName: opts.location.locationName,
      locationResourceName: opts.location.locationResourceName,
      locationTitle: opts.location.locationTitle,
      mapsUri: opts.location.mapsUri,
      newReviewUri: opts.location.newReviewUri,
      placeId: opts.location.placeId,
      storeCode: opts.location.storeCode,
      websiteUri: opts.location.websiteUri,
      connectedAt: new Date().toISOString(),
      connectedVia: "oauth",
    },
  });
}

async function resolveGoogleBusinessAccessToken(): Promise<GoogleBusinessTokenContext | null> {
  const config = await getNexusConfig(GBP_PLATFORM);
  const persistedLocation =
    config && config.payload ? resolveGoogleBusinessLocationFromPayload(config.payload) : null;

  if (config?.refresh_token && persistedLocation) {
    const client = createGoogleBusinessOAuthClient({ requireRedirectUri: false });
    client.setCredentials({
      access_token: config.access_token || undefined,
      refresh_token: config.refresh_token,
      token_type: config.token_type || undefined,
      scope: config.scope || undefined,
      expiry_date: config.expires_at ? Date.parse(config.expires_at) : undefined,
    });

    const tokenResponse = await client.getAccessToken();
    const accessToken =
      (typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token) ||
      client.credentials.access_token ||
      "";

    if (!accessToken) {
      throw new Error("Google Business access token refresh did not return a usable token.");
    }

    if (
      accessToken !== config.access_token ||
      isExpiringSoon(config.expires_at) ||
      normalizeExpiryDate(client.credentials.expiry_date || null) !== config.expires_at
    ) {
      await upsertNexusConfig({
        platform: GBP_PLATFORM,
        access_token: accessToken,
        refresh_token: config.refresh_token,
        token_type: client.credentials.token_type || config.token_type || "Bearer",
        scope: client.credentials.scope || config.scope || GBP_SCOPE,
        expires_at:
          normalizeExpiryDate(client.credentials.expiry_date || null) || config.expires_at || null,
        payload: config.payload || {},
      });
    }

    return {
      accessToken,
      locationResourceName: persistedLocation,
      config,
      source: "oauth",
    };
  }

  const envAccessToken = trimToNull(process.env.NEXUS_GBP_ACCESS_TOKEN);
  const envLocation = resolveGoogleBusinessLocationFromEnv();

  if (envAccessToken && envLocation) {
    return {
      accessToken: envAccessToken,
      locationResourceName: envLocation,
      config,
      source: "env",
    };
  }

  return null;
}

export async function publishGoogleBusinessPost(input: GoogleBusinessPostInput) {
  const auth = await resolveGoogleBusinessAccessToken();
  if (!auth) {
    return {
      platform: GBP_PLATFORM,
      status: "skipped" as const,
      reason: "missing_gbp_connection",
    };
  }

  const requestBody = {
    languageCode: "en-US",
    summary: buildPostSummary(input),
    topicType: "STANDARD",
    callToAction: {
      actionType: "LEARN_MORE",
      url: input.canonicalUrl,
    },
    ...(input.imageUrl
      ? {
          media: [
            {
              mediaFormat: "PHOTO",
              sourceUrl: input.imageUrl,
            },
          ],
        }
      : {}),
  };

  const response = await fetch(
    `https://mybusiness.googleapis.com/v4/${auth.locationResourceName}/localPosts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    }
  );

  const rawBody = await response.text();
  const parsedBody = rawBody ? safeJsonParse(rawBody) : null;

  if (!response.ok) {
    return {
      platform: GBP_PLATFORM,
      status: "failed" as const,
      reason: `gbp_post_failed:${response.status}`,
      payload:
        parsedBody && typeof parsedBody === "object"
          ? { response: parsedBody }
          : rawBody
            ? { response: rawBody }
            : undefined,
    };
  }

  const body =
    parsedBody && typeof parsedBody === "object"
      ? (parsedBody as Record<string, unknown>)
      : {};

  return {
    platform: GBP_PLATFORM,
    status: "sent" as const,
    externalId: typeof body.name === "string" ? body.name : undefined,
    externalUrl: typeof body.searchUrl === "string" ? body.searchUrl : undefined,
    payload: {
      source: auth.source,
      response: body,
    },
  };
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}
