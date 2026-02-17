import fs from "node:fs";
import path from "node:path";
import {
  createGoogleClients,
  getDateRange,
  getEnv,
  loadLocalEnv,
  resolveGa4Targets,
} from "./_lib.mjs";

function formatMetricValue(value) {
  if (!value) return "0";
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-US");
  if (String(value).includes(".")) return n.toFixed(2);
  return String(n);
}

function mdTable(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return [head, sep, body].join("\n");
}

async function main() {
  const localEnv = loadLocalEnv();
  const { webmasters, analyticsAdmin, analyticsData } = await createGoogleClients(localEnv);
  const { startDate, endDate } = getDateRange(7);

  const targetSite =
    getEnv(localEnv, "SEARCH_CONSOLE_PROPERTY") || "https://www.susiesjewelryrepair.com/";

  const { accountId, propertyId, measurementId } = await resolveGa4Targets(analyticsAdmin);
  const targetPropertyId = getEnv(localEnv, "GA4_PROPERTY_ID", propertyId);
  if (!targetPropertyId) {
    throw new Error("GA4_PROPERTY_ID is missing and could not be auto-detected.");
  }

  const [gscSummary, gscTopQueries, gscTopPages] = await Promise.all([
    webmasters.searchanalytics.query({
      siteUrl: targetSite,
      requestBody: { startDate, endDate, rowLimit: 1 },
    }),
    webmasters.searchanalytics.query({
      siteUrl: targetSite,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 10,
      },
    }),
    webmasters.searchanalytics.query({
      siteUrl: targetSite,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 10,
      },
    }),
  ]);

  const [gaSummary, gaDaily] = await Promise.all([
    analyticsData.properties.runReport({
      property: `properties/${targetPropertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "newUsers" },
          { name: "engagedSessions" },
          { name: "screenPageViews" },
        ],
      },
    }),
    analyticsData.properties.runReport({
      property: `properties/${targetPropertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date", orderType: "ALPHANUMERIC" } }],
        limit: 31,
      },
    }),
  ]);

  const gscSummaryRow = gscSummary.data.rows?.[0];
  const gscSummaryRows = gscSummary.data.rows || [];
  const gscTotalClicks = gscSummaryRows.reduce((sum, row) => sum + (row.clicks || 0), 0);
  const gscTotalImpressions = gscSummaryRows.reduce(
    (sum, row) => sum + (row.impressions || 0),
    0
  );
  const gscAvgCtr =
    gscSummaryRows.length > 0
      ? gscSummaryRows.reduce((sum, row) => sum + (row.ctr || 0), 0) / gscSummaryRows.length
      : 0;
  const gscAvgPosition =
    gscSummaryRows.length > 0
      ? gscSummaryRows.reduce((sum, row) => sum + (row.position || 0), 0) / gscSummaryRows.length
      : 0;

  const gaSummaryMetrics = gaSummary.data.rows?.[0]?.metricValues || [];
  const metric = (index) => gaSummaryMetrics[index]?.value || "0";

  const queryRows = (gscTopQueries.data.rows || []).map((row) => [
    row.keys?.[0] || "(unknown)",
    formatMetricValue(row.clicks),
    formatMetricValue(row.impressions),
    `${((row.ctr || 0) * 100).toFixed(2)}%`,
    (row.position || 0).toFixed(2),
  ]);

  const pageRows = (gscTopPages.data.rows || []).map((row) => [
    row.keys?.[0] || "(unknown)",
    formatMetricValue(row.clicks),
    formatMetricValue(row.impressions),
    `${((row.ctr || 0) * 100).toFixed(2)}%`,
    (row.position || 0).toFixed(2),
  ]);

  const dailyRows = (gaDaily.data.rows || []).map((row) => [
    row.dimensionValues?.[0]?.value || "",
    formatMetricValue(row.metricValues?.[0]?.value),
    formatMetricValue(row.metricValues?.[1]?.value),
  ]);

  const lines = [
    "# Weekly Google Report",
    "",
    `- Generated: ${new Date().toISOString()}`,
    `- Date range: ${startDate} to ${endDate}`,
    `- Search Console property: ${targetSite}`,
    `- GA4 account ID: ${accountId || "(unknown)"}`,
    `- GA4 property ID: ${targetPropertyId}`,
    `- GA4 measurement ID: ${measurementId || "(not detected)"}`,
    "",
    "## Search Console Summary",
    "",
    `- Clicks: ${formatMetricValue(gscSummaryRow?.clicks ?? gscTotalClicks)}`,
    `- Impressions: ${formatMetricValue(gscSummaryRow?.impressions ?? gscTotalImpressions)}`,
    `- CTR: ${((gscSummaryRow?.ctr ?? gscAvgCtr) * 100).toFixed(2)}%`,
    `- Avg position: ${(gscSummaryRow?.position ?? gscAvgPosition).toFixed(2)}`,
    "",
    "## Top Queries (GSC)",
    "",
    queryRows.length
      ? mdTable(["Query", "Clicks", "Impressions", "CTR", "Avg Position"], queryRows)
      : "_No query data returned for this range._",
    "",
    "## Top Pages (GSC)",
    "",
    pageRows.length
      ? mdTable(["Page", "Clicks", "Impressions", "CTR", "Avg Position"], pageRows)
      : "_No page data returned for this range._",
    "",
    "## GA4 Summary",
    "",
    `- Active users: ${formatMetricValue(metric(0))}`,
    `- Sessions: ${formatMetricValue(metric(1))}`,
    `- New users: ${formatMetricValue(metric(2))}`,
    `- Engaged sessions: ${formatMetricValue(metric(3))}`,
    `- Page views: ${formatMetricValue(metric(4))}`,
    "",
    "## GA4 Daily Trend",
    "",
    dailyRows.length
      ? mdTable(["Date (YYYYMMDD)", "Active Users", "Sessions"], dailyRows)
      : "_No daily GA4 rows returned for this range._",
    "",
  ];

  const reportText = lines.join("\n");
  const outDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(outDir, { recursive: true });

  const datedPath = path.join(outDir, `google-weekly-report-${endDate}.md`);
  const latestPath = path.join(outDir, "google-weekly-report-latest.md");

  fs.writeFileSync(datedPath, reportText, "utf8");
  fs.writeFileSync(latestPath, reportText, "utf8");

  console.log(`REPORT_OK ${datedPath}`);
  console.log(`REPORT_OK ${latestPath}`);
}

main().catch((error) => {
  console.error("REPORT_FAIL", error?.message || error);
  process.exit(1);
});
