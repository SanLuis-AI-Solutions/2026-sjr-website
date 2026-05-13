import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import { getEnv, loadLocalEnv, toIsoDateUtc } from "./_lib.mjs";

const BASE_URL = "https://www.susiesjewelryrepair.com";

function toPath(value) {
  try {
    return new URL(value, BASE_URL).pathname || "/";
  } catch {
    return value;
  }
}

function normalizeObservedStatus(status) {
  return {
    indexed: "URL is on Google",
    "discovered-currently-not-indexed": "Discovered - currently not indexed",
    "unknown-to-google": "URL is unknown to Google",
  }[status] || status || "";
}

function toObservedStatus(coverageState) {
  return {
    "Submitted and indexed": "indexed",
    "Indexed, not submitted in sitemap": "indexed",
    "Discovered - currently not indexed": "discovered-currently-not-indexed",
    "URL is unknown to Google": "unknown-to-google",
  }[coverageState] || null;
}

function statusRank(status) {
  return {
    "unknown-to-google": 0,
    "discovered-currently-not-indexed": 1,
    indexed: 2,
  }[status] ?? -1;
}

function classifyMovement(previousStatus, coverageState, error) {
  if (error) return "inspection-error";

  const currentStatus = toObservedStatus(coverageState);
  if (!previousStatus || !currentStatus) return "unknown";

  const previousRank = statusRank(previousStatus);
  const currentRank = statusRank(currentStatus);

  if (currentRank > previousRank) return "improved";
  if (currentRank < previousRank) return "regressed";
  return "unchanged";
}

function formatStatusCounts(rows) {
  return Object.entries(
    rows.reduce((acc, row) => {
      const key = row.coverageState || row.error || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => a[0].localeCompare(b[0]));
}

function formatMovementCounts(rows) {
  return Object.entries(
    rows.reduce((acc, row) => {
      const key = row.movement || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => a[0].localeCompare(b[0]));
}

function toMovementLabel(movement) {
  return {
    improved: "Improved",
    unchanged: "Unchanged",
    regressed: "Regressed",
    unknown: "Unknown",
    "inspection-error": "Inspection error",
  }[movement] || movement || "Unknown";
}

function buildMarkdown(snapshot) {
  const improvedRows = snapshot.rows.filter((row) => row.movement === "improved");
  const regressedRows = snapshot.rows.filter((row) => row.movement === "regressed");

  return [
    "# GSC Indexing Status",
    "",
    `- Generated: ${snapshot.generatedAt}`,
    `- Search Console property: ${snapshot.searchConsoleProperty}`,
    `- Checked URLs: ${snapshot.rows.length}`,
    `- Scope: ${snapshot.scope}`,
    "",
    "## Status Counts",
    "",
    ...snapshot.counts.map(([status, count]) => `- ${status}: ${count}`),
    "",
    "## Movement Since Manifest",
    "",
    ...snapshot.movementCounts.map(([movement, count]) => `- ${toMovementLabel(movement)}: ${count}`),
    "",
    improvedRows.length > 0 ? "### Improved URLs" : null,
    improvedRows.length > 0 ? "" : null,
    ...improvedRows.map(
      (row) =>
        `- \`${row.path}\`: ${row.previousStatusLabel} -> ${row.coverageState || "Unknown"}`,
    ),
    improvedRows.length > 0 ? "" : null,
    regressedRows.length > 0 ? "### Regressed URLs" : null,
    regressedRows.length > 0 ? "" : null,
    ...regressedRows.map(
      (row) =>
        `- \`${row.path}\`: ${row.previousStatusLabel} -> ${row.coverageState || "Unknown"}`,
    ),
    regressedRows.length > 0 ? "" : null,
    "## URL Inspection Results",
    "",
    "| URL | Previous Manifest Status | Current Coverage State | Movement | Sitemap Sources | Referring URLs |",
    "| --- | --- | --- | --- | --- | --- |",
    ...snapshot.rows.map(
      (row) =>
        `| \`${row.path}\` | ${row.previousStatusLabel} | ${row.coverageState || row.error || "Unknown"} | ${toMovementLabel(row.movement)} | ${row.sitemapCount} | ${row.referringUrlCount} |`,
    ),
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

async function main() {
  const localEnv = loadLocalEnv();
  const targetSite =
    getEnv(localEnv, "SEARCH_CONSOLE_PROPERTY") || "https://www.susiesjewelryrepair.com/";
  const manifestPath = path.join(process.cwd(), "Docs", "INDEXING_MANIFEST.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const includeAll = process.argv.includes("--all");
  const routes = includeAll
    ? manifest.routes
    : manifest.routes.filter((route) => route.observedStatus !== "indexed");

  const auth = new google.auth.JWT({
    email: getEnv(localEnv, "GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: getEnv(localEnv, "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  await auth.authorize();

  const searchconsole = google.searchconsole({ version: "v1", auth });
  const rows = [];
  for (const route of routes) {
    const inspectionUrl = new URL(route.url || route.path, BASE_URL).toString();
    try {
      const response = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl, siteUrl: targetSite },
      });
      const indexStatus = response.data.inspectionResult?.indexStatusResult || {};
      rows.push({
        path: toPath(inspectionUrl),
        url: inspectionUrl,
        previousStatus: route.observedStatus,
        previousStatusLabel: normalizeObservedStatus(route.observedStatus),
        currentStatus: toObservedStatus(indexStatus.coverageState || ""),
        movement: classifyMovement(route.observedStatus, indexStatus.coverageState || ""),
        verdict: indexStatus.verdict || "",
        coverageState: indexStatus.coverageState || "",
        pageFetchState: indexStatus.pageFetchState || "",
        sitemapCount: (indexStatus.sitemap || []).length,
        referringUrlCount: (indexStatus.referringUrls || []).length,
        inspectionResultLink: response.data.inspectionResult?.inspectionResultLink || "",
      });
    } catch (error) {
      rows.push({
        path: toPath(inspectionUrl),
        url: inspectionUrl,
        previousStatus: route.observedStatus,
        previousStatusLabel: normalizeObservedStatus(route.observedStatus),
        currentStatus: null,
        movement: classifyMovement(route.observedStatus, "", error),
        sitemapCount: 0,
        referringUrlCount: 0,
        error: error?.message || String(error),
      });
    }
  }

  const generatedAt = new Date().toISOString();
  const snapshot = {
    generatedAt,
    searchConsoleProperty: targetSite,
    scope: includeAll ? "all manifest URLs" : "unresolved manifest URLs",
    counts: formatStatusCounts(rows),
    movementCounts: formatMovementCounts(rows),
    rows,
  };

  const healthDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(healthDir, { recursive: true });
  const stamp = toIsoDateUtc(new Date());
  const datedJson = path.join(healthDir, `indexing-status-${stamp}.json`);
  const datedMd = path.join(healthDir, `indexing-status-${stamp}.md`);
  const latestJson = path.join(healthDir, "indexing-status-latest.json");
  const latestMd = path.join(healthDir, "indexing-status-latest.md");

  fs.writeFileSync(datedJson, JSON.stringify(snapshot, null, 2), "utf8");
  fs.writeFileSync(datedMd, buildMarkdown(snapshot), "utf8");
  fs.writeFileSync(latestJson, JSON.stringify(snapshot, null, 2), "utf8");
  fs.writeFileSync(latestMd, buildMarkdown(snapshot), "utf8");

  console.log(`INDEXING_STATUS_OK ${datedJson}`);
  console.log(`INDEXING_STATUS_OK ${datedMd}`);
  console.log(`INDEXING_STATUS_OK ${latestJson}`);
  console.log(`INDEXING_STATUS_OK ${latestMd}`);
}

main().catch((error) => {
  console.error("INDEXING_STATUS_FAIL", error?.message || error);
  process.exit(1);
});
