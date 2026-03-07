import fs from "node:fs";
import path from "node:path";
import {
  createGoogleClients,
  getDateRange,
  getEnv,
  loadLocalEnv,
  resolveGa4Targets,
} from "./_lib.mjs";

const PRODUCTION_HOST = "www.susiesjewelryrepair.com";

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

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

async function runGaReport(analyticsData, propertyId, requestBody) {
  const response = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody,
  });
  return response.data.rows || [];
}

async function runGscRows(webmasters, siteUrl, requestBody) {
  const response = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody,
  });
  return response.data.rows || [];
}

async function main() {
  const localEnv = loadLocalEnv();
  const { analyticsAdmin, analyticsData, webmasters } = await createGoogleClients(localEnv);
  const { startDate, endDate } = getDateRange(90);
  const targetSite =
    getEnv(localEnv, "SEARCH_CONSOLE_PROPERTY") || "https://www.susiesjewelryrepair.com/";
  const { propertyId } = await resolveGa4Targets(analyticsAdmin);
  const targetPropertyId = getEnv(localEnv, "GA4_PROPERTY_ID", propertyId);

  if (!targetPropertyId) {
    throw new Error("GA4_PROPERTY_ID is missing and could not be auto-detected.");
  }

  const [
    hostnameRows,
    sourceRows,
    dailyRows,
    landingRows,
    gscTotalsRows,
    gscPageRows,
    gscQueryRows,
  ] = await Promise.all([
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "hostName" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 20,
    }),
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionSourceMedium" }, { name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 20,
    }),
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 120,
    }),
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [{ name: "sessions" }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "hostName",
                stringFilter: { matchType: "EXACT", value: PRODUCTION_HOST },
              },
            },
            {
              filter: {
                fieldName: "sessionDefaultChannelGroup",
                stringFilter: { matchType: "EXACT", value: "Organic Search" },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 15,
    }),
    runGscRows(webmasters, targetSite, { startDate, endDate, rowLimit: 1 }),
    runGscRows(webmasters, targetSite, {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 15,
    }),
    runGscRows(webmasters, targetSite, {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 15,
    }),
  ]);

  const hostSummary = hostnameRows.map((row) => ({
    hostName: row.dimensionValues?.[0]?.value || "(unknown)",
    activeUsers: toNum(row.metricValues?.[0]?.value),
    sessions: toNum(row.metricValues?.[1]?.value),
    pageViews: toNum(row.metricValues?.[2]?.value),
  }));

  const productionHost = hostSummary.find((row) => row.hostName === PRODUCTION_HOST);
  const localhostUsers = hostSummary
    .filter((row) => row.hostName === "127.0.0.1" || row.hostName === "localhost")
    .reduce((sum, row) => sum + row.activeUsers, 0);
  const previewUsers = hostSummary
    .filter(
      (row) => row.hostName.endsWith(".vercel.app") && row.hostName !== PRODUCTION_HOST
    )
    .reduce((sum, row) => sum + row.activeUsers, 0);
  const totalUsers = hostSummary.reduce((sum, row) => sum + row.activeUsers, 0);

  const gscTotals = gscTotalsRows[0]
    ? {
        clicks: toNum(gscTotalsRows[0].clicks),
        impressions: toNum(gscTotalsRows[0].impressions),
        ctr: toNum(gscTotalsRows[0].ctr),
        avgPosition: toNum(gscTotalsRows[0].position),
      }
    : { clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 };

  const spikeRows = dailyRows
    .map((row) => ({
      date: row.dimensionValues?.[0]?.value || "",
      activeUsers: toNum(row.metricValues?.[0]?.value),
      sessions: toNum(row.metricValues?.[1]?.value),
    }))
    .sort((a, b) => b.activeUsers - a.activeUsers)
    .slice(0, 7);

  const summary = {
    generatedAt: new Date().toISOString(),
    range: { startDate, endDate },
    ga4: {
      propertyId: targetPropertyId,
      hostSummary,
      sourceSummary: sourceRows.map((row) => ({
        sourceMedium: row.dimensionValues?.[0]?.value || "(unknown)",
        channel: row.dimensionValues?.[1]?.value || "(unknown)",
        activeUsers: toNum(row.metricValues?.[0]?.value),
        sessions: toNum(row.metricValues?.[1]?.value),
      })),
      topDailySpikes: spikeRows,
      topOrganicLandingPages: landingRows.map((row) => ({
        page: row.dimensionValues?.[0]?.value || "(not set)",
        sessions: toNum(row.metricValues?.[0]?.value),
      })),
    },
    searchConsole: {
      property: targetSite,
      totals: gscTotals,
      topPages: gscPageRows.map((row) => ({
        page: row.keys?.[0] || "(unknown)",
        clicks: toNum(row.clicks),
        impressions: toNum(row.impressions),
        ctr: toNum(row.ctr),
        avgPosition: toNum(row.position),
      })),
      topQueries: gscQueryRows.map((row) => ({
        query: row.keys?.[0] || "(unknown)",
        clicks: toNum(row.clicks),
        impressions: toNum(row.impressions),
        ctr: toNum(row.ctr),
        avgPosition: toNum(row.position),
      })),
    },
    reconciliation: {
      totalGaUsers: totalUsers,
      productionHostUsers: productionHost?.activeUsers || 0,
      localhostUsers,
      previewUsers,
      searchConsoleClicks: gscTotals.clicks,
      conclusion:
        localhostUsers > 0
          ? `The GA4 headline is inflated by localhost traffic; ${formatInt(localhostUsers)} active users came from localhost/127.0.0.1 over this 90-day window.`
          : "No localhost traffic was found in the 90-day window.",
    },
  };

  const markdown = [
    "# GA4 vs Search Console Reconciliation (90 Days)",
    "",
    `- Generated: ${summary.generatedAt}`,
    `- Date range: ${startDate} to ${endDate}`,
    `- GA4 property: ${targetPropertyId}`,
    `- Search Console property: ${targetSite}`,
    "",
    "## Reconciliation Summary",
    "",
    `- Total GA4 active users: ${formatInt(summary.reconciliation.totalGaUsers)}`,
    `- Production-host active users: ${formatInt(summary.reconciliation.productionHostUsers)}`,
    `- Localhost/127.0.0.1 active users: ${formatInt(summary.reconciliation.localhostUsers)}`,
    `- Preview-host active users: ${formatInt(summary.reconciliation.previewUsers)}`,
    `- Search Console clicks: ${formatInt(summary.reconciliation.searchConsoleClicks)}`,
    `- Conclusion: ${summary.reconciliation.conclusion}`,
    "",
    "## GA4 Users by Hostname",
    "",
    table(
      ["Hostname", "Active Users", "Sessions", "Page Views"],
      hostSummary.map((row) => [
        row.hostName,
        formatInt(row.activeUsers),
        formatInt(row.sessions),
        formatInt(row.pageViews),
      ])
    ),
    "",
    "## GA4 Source / Medium",
    "",
    table(
      ["Source / Medium", "Channel", "Active Users", "Sessions"],
      summary.ga4.sourceSummary.map((row) => [
        row.sourceMedium,
        row.channel,
        formatInt(row.activeUsers),
        formatInt(row.sessions),
      ])
    ),
    "",
    "## GA4 Largest Daily Spikes",
    "",
    table(
      ["Date", "Active Users", "Sessions"],
      spikeRows.map((row) => [row.date, formatInt(row.activeUsers), formatInt(row.sessions)])
    ),
    "",
    "## Top Organic Landing Pages (Production Host Only)",
    "",
    summary.ga4.topOrganicLandingPages.length
      ? table(
          ["Landing Page", "Sessions"],
          summary.ga4.topOrganicLandingPages.map((row) => [row.page, formatInt(row.sessions)])
        )
      : "_No organic landing-page rows were returned._",
    "",
    "## Search Console Totals",
    "",
    `- Clicks: ${formatInt(gscTotals.clicks)}`,
    `- Impressions: ${formatInt(gscTotals.impressions)}`,
    `- CTR: ${formatPct(gscTotals.ctr)}`,
    `- Avg position: ${gscTotals.avgPosition.toFixed(2)}`,
    "",
    "## Search Console Top Pages",
    "",
    table(
      ["Page", "Clicks", "Impressions", "CTR", "Avg Position"],
      summary.searchConsole.topPages.map((row) => [
        row.page,
        formatInt(row.clicks),
        formatInt(row.impressions),
        formatPct(row.ctr),
        row.avgPosition.toFixed(2),
      ])
    ),
    "",
    "## Search Console Top Queries",
    "",
    table(
      ["Query", "Clicks", "Impressions", "CTR", "Avg Position"],
      summary.searchConsole.topQueries.map((row) => [
        row.query,
        formatInt(row.clicks),
        formatInt(row.impressions),
        formatPct(row.ctr),
        row.avgPosition.toFixed(2),
      ])
    ),
    "",
  ].join("\n");

  const outDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(outDir, { recursive: true });

  const datedJson = path.join(outDir, `ga4-gsc-reconciliation-90d-${endDate}.json`);
  const datedMd = path.join(outDir, `ga4-gsc-reconciliation-90d-${endDate}.md`);
  const latestJson = path.join(outDir, "ga4-gsc-reconciliation-90d-latest.json");
  const latestMd = path.join(outDir, "ga4-gsc-reconciliation-90d-latest.md");

  fs.writeFileSync(datedJson, JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(datedMd, markdown, "utf8");
  fs.writeFileSync(latestJson, JSON.stringify(summary, null, 2), "utf8");
  fs.writeFileSync(latestMd, markdown, "utf8");

  console.log(`RECONCILIATION_OK ${datedJson}`);
  console.log(`RECONCILIATION_OK ${datedMd}`);
  console.log(`RECONCILIATION_OK ${latestJson}`);
  console.log(`RECONCILIATION_OK ${latestMd}`);
}

main().catch((error) => {
  console.error("RECONCILIATION_FAIL", error?.message || error);
  process.exit(1);
});
