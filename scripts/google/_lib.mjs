import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";

function parseDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

export function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  return parseDotEnv(envPath);
}

export function getEnv(localEnv, key, fallback = "") {
  return process.env[key] || localEnv[key] || fallback;
}

export function requireEnv(localEnv, keys) {
  const missing = keys.filter((k) => !getEnv(localEnv, k));
  if (missing.length > 0) {
    throw new Error(`Missing required keys: ${missing.join(", ")}`);
  }
}

export async function createGoogleClients(localEnv) {
  requireEnv(localEnv, [
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  ]);

  const auth = new google.auth.JWT({
    email: getEnv(localEnv, "GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: getEnv(localEnv, "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/analytics.edit",
    ],
  });

  await auth.authorize();

  return {
    auth,
    webmasters: google.webmasters({ version: "v3", auth }),
    analyticsAdmin: google.analyticsadmin({ version: "v1beta", auth }),
    analyticsData: google.analyticsdata({ version: "v1beta", auth }),
  };
}

export function toIsoDateUtc(date) {
  return date.toISOString().slice(0, 10);
}

export function getDateRange(daysBack = 7) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (daysBack - 1));
  return {
    startDate: toIsoDateUtc(start),
    endDate: toIsoDateUtc(end),
  };
}

export async function resolveGa4Targets(analyticsAdmin) {
  const summaries = await analyticsAdmin.accountSummaries.list({ pageSize: 200 });
  const accounts = summaries.data.accountSummaries || [];

  const firstAccount = accounts[0];
  const firstProperty = firstAccount?.propertySummaries?.[0];

  const accountId = (firstAccount?.name || "").split("/")[1] || "";
  const propertyId = (firstProperty?.property || "").split("/")[1] || "";

  let measurementId = "";
  if (firstProperty?.property) {
    try {
      const streams = await analyticsAdmin.properties.dataStreams.list({
        parent: firstProperty.property,
      });
      const webStream = (streams.data.dataStreams || []).find(
        (s) => s.type === "WEB_DATA_STREAM" && s.webStreamData?.measurementId
      );
      measurementId = webStream?.webStreamData?.measurementId || "";
    } catch {
      measurementId = "";
    }
  }

  return {
    accounts,
    accountId,
    propertyId,
    measurementId,
  };
}
