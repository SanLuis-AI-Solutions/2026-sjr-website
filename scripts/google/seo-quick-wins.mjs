import fs from "node:fs";
import path from "node:path";
import { createGoogleClients, getEnv, loadLocalEnv, toIsoDateUtc } from "./_lib.mjs";

function toNum(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function formatInt(value) {
  return toNum(value).toLocaleString("en-US");
}

function formatPct(value) {
  return `${(toNum(value) * 100).toFixed(2)}%`;
}

function deriveDateRange(daysBack = 28) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (daysBack - 1));
  return {
    startDate: toIsoDateUtc(start),
    endDate: toIsoDateUtc(end),
  };
}

function extractPath(pageUrl) {
  if (!pageUrl) return "";
  try {
    return new URL(pageUrl).pathname || "/";
  } catch {
    return pageUrl;
  }
}

async function main() {
  const localEnv = loadLocalEnv();
  const { webmasters } = await createGoogleClients(localEnv);
  const { startDate, endDate } = deriveDateRange(28);
  const targetSite =
    getEnv(localEnv, "SEARCH_CONSOLE_PROPERTY") || "https://www.susiesjewelryrepair.com/";

  const response = await webmasters.searchanalytics.query({
    siteUrl: targetSite,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query", "page"],
      rowLimit: 250,
      searchType: "web",
    },
  });

  const rows = (response.data.rows || []).map((row) => ({
    query: row.keys?.[0] || "",
    page: row.keys?.[1] || "",
    path: extractPath(row.keys?.[1] || ""),
    clicks: toNum(row.clicks),
    impressions: toNum(row.impressions),
    ctr: toNum(row.ctr),
    position: toNum(row.position),
  }));

  const quickWins = rows
    .filter((row) => row.position >= 6 && row.position <= 20)
    .sort((a, b) => {
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      if (b.impressions !== a.impressions) return b.impressions - a.impressions;
      return a.position - b.position;
    })
    .slice(0, 20);

  const topCtrCandidates = quickWins.slice(0, 5);
  const pageRollup = Object.values(
    quickWins.reduce((acc, row) => {
      const key = row.path;
      if (!acc[key]) {
        acc[key] = {
          path: row.path,
          clicks: 0,
          impressions: 0,
          bestPosition: row.position,
          keywordCount: 0,
        };
      }
      acc[key].clicks += row.clicks;
      acc[key].impressions += row.impressions;
      acc[key].bestPosition = Math.min(acc[key].bestPosition, row.position);
      acc[key].keywordCount += 1;
      return acc;
    }, {}),
  ).sort((a, b) => {
    if (b.clicks !== a.clicks) return b.clicks - a.clicks;
    if (b.impressions !== a.impressions) return b.impressions - a.impressions;
    return a.bestPosition - b.bestPosition;
  });

  const snapshot = {
    generatedAt: new Date().toISOString(),
    searchConsoleProperty: targetSite,
    range: { startDate, endDate },
    quickWins,
    topCtrCandidates,
    pageRollup,
  };

  const markdown = [
    "# SEO Quick Wins",
    "",
    `- Generated: ${snapshot.generatedAt}`,
    `- Search Console property: ${targetSite}`,
    `- Date range: ${startDate} to ${endDate}`,
    `- Rule: keywords with average position between 6 and 20`,
    "",
    "## Top 20 Quick-Win Keywords",
    "",
    "| Query | Page | Clicks | Impressions | CTR | Avg Position |",
    "| --- | --- | --- | --- | --- | --- |",
    ...quickWins.map(
      (row) =>
        `| ${row.query} | ${row.path} | ${formatInt(row.clicks)} | ${formatInt(row.impressions)} | ${formatPct(row.ctr)} | ${row.position.toFixed(2)} |`,
    ),
    "",
    "## Top 5 CTR Rewrite Candidates",
    "",
    "| Query | Page | Clicks | Impressions | CTR | Avg Position |",
    "| --- | --- | --- | --- | --- | --- |",
    ...topCtrCandidates.map(
      (row) =>
        `| ${row.query} | ${row.path} | ${formatInt(row.clicks)} | ${formatInt(row.impressions)} | ${formatPct(row.ctr)} | ${row.position.toFixed(2)} |`,
    ),
    "",
    "## Quick-Win Pages By Aggregate Opportunity",
    "",
    "| Page | Quick-Win Keywords | Clicks | Impressions | Best Position |",
    "| --- | --- | --- | --- | --- |",
    ...pageRollup.map(
      (row) =>
        `| ${row.path} | ${formatInt(row.keywordCount)} | ${formatInt(row.clicks)} | ${formatInt(row.impressions)} | ${row.bestPosition.toFixed(2)} |`,
    ),
    "",
  ].join("\n");

  const healthDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(healthDir, { recursive: true });
  fs.writeFileSync(
    path.join(healthDir, "seo-quick-wins-latest.json"),
    JSON.stringify(snapshot, null, 2),
    "utf8",
  );

  const docsDir = path.join(process.cwd(), "Docs");
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, "SEO_QUICK_WINS.md"), markdown, "utf8");

  console.log("SEO_QUICK_WINS_OK .health/seo-quick-wins-latest.json");
  console.log("SEO_QUICK_WINS_OK Docs/SEO_QUICK_WINS.md");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
