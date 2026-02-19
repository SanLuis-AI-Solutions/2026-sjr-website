import fs from "node:fs";
import path from "node:path";
import {
  createGoogleClients,
  getDateRange,
  getEnv,
  loadLocalEnv,
  resolveGa4Targets,
} from "./_lib.mjs";

const TRACKED_EVENTS = [
  "service_card_click",
  "services_hub_cta_click",
  "service_section_view",
  "service_faq_open",
  "service_decision_expand",
  "service_market_expand",
  "service_cta_click",
  "lead_form_start",
  "lead_form_step",
  "lead_form_submit_attempt",
  "lead_form_error",
  "quote_submit_success",
  "booking_submit_success",
  "booking_submit_pending",
  "contact_submit_success",
];

function formatMetric(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US");
}

async function runGa4EventReport(analyticsData, propertyId, startDate, endDate) {
  const report = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: { values: TRACKED_EVENTS },
        },
      },
      limit: 100,
    },
  });

  const rows = report.data.rows || [];
  const eventMap = Object.fromEntries(TRACKED_EVENTS.map((name) => [name, 0]));
  for (const row of rows) {
    const eventName = row.dimensionValues?.[0]?.value || "";
    const count = Number(row.metricValues?.[0]?.value || 0);
    if (eventName in eventMap) eventMap[eventName] = count;
  }
  return eventMap;
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

  const [gscSummary, gaSummary, eventMap] = await Promise.all([
    webmasters.searchanalytics.query({
      siteUrl: targetSite,
      requestBody: { startDate, endDate, rowLimit: 1 },
    }),
    analyticsData.properties.runReport({
      property: `properties/${targetPropertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "engagedSessions" },
          { name: "screenPageViews" },
        ],
      },
    }),
    runGa4EventReport(analyticsData, targetPropertyId, startDate, endDate),
  ]);

  const gscRow = gscSummary.data.rows?.[0];
  const gaMetrics = gaSummary.data.rows?.[0]?.metricValues || [];
  const outDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(outDir, { recursive: true });

  const baseline = {
    generatedAt: new Date().toISOString(),
    range: { startDate, endDate },
    searchConsole: {
      property: targetSite,
      clicks: Number(gscRow?.clicks || 0),
      impressions: Number(gscRow?.impressions || 0),
      ctr: Number(gscRow?.ctr || 0),
      avgPosition: Number(gscRow?.position || 0),
    },
    ga4: {
      accountId: accountId || null,
      propertyId: targetPropertyId,
      measurementId: measurementId || null,
      activeUsers: Number(gaMetrics[0]?.value || 0),
      sessions: Number(gaMetrics[1]?.value || 0),
      engagedSessions: Number(gaMetrics[2]?.value || 0),
      pageViews: Number(gaMetrics[3]?.value || 0),
      events: eventMap,
    },
  };

  const markdown = [
    "# GA4 + GSC 7-Day Baseline",
    "",
    `- Generated: ${baseline.generatedAt}`,
    `- Date range: ${startDate} to ${endDate}`,
    `- Search Console property: ${targetSite}`,
    `- GA4 property: ${targetPropertyId}`,
    `- GA4 measurement ID: ${measurementId || "(not detected)"}`,
    "",
    "## Topline",
    `- Active users: ${formatMetric(baseline.ga4.activeUsers)}`,
    `- Sessions: ${formatMetric(baseline.ga4.sessions)}`,
    `- Engaged sessions: ${formatMetric(baseline.ga4.engagedSessions)}`,
    `- Page views: ${formatMetric(baseline.ga4.pageViews)}`,
    `- GSC clicks: ${formatMetric(baseline.searchConsole.clicks)}`,
    `- GSC impressions: ${formatMetric(baseline.searchConsole.impressions)}`,
    `- GSC CTR: ${(baseline.searchConsole.ctr * 100).toFixed(2)}%`,
    `- GSC avg position: ${baseline.searchConsole.avgPosition.toFixed(2)}`,
    "",
    "## Event Baseline (7 days)",
    "| Event | Count |",
    "| --- | --- |",
    ...TRACKED_EVENTS.map((eventName) => `| ${eventName} | ${formatMetric(eventMap[eventName])} |`),
    "",
  ].join("\n");

  const datedJson = path.join(outDir, `ga4-baseline-7d-${endDate}.json`);
  const datedMd = path.join(outDir, `ga4-baseline-7d-${endDate}.md`);
  const latestJson = path.join(outDir, "ga4-baseline-7d-latest.json");
  const latestMd = path.join(outDir, "ga4-baseline-7d-latest.md");

  fs.writeFileSync(datedJson, JSON.stringify(baseline, null, 2), "utf8");
  fs.writeFileSync(latestJson, JSON.stringify(baseline, null, 2), "utf8");
  fs.writeFileSync(datedMd, markdown, "utf8");
  fs.writeFileSync(latestMd, markdown, "utf8");

  console.log(`BASELINE_OK ${datedJson}`);
  console.log(`BASELINE_OK ${datedMd}`);
  console.log(`BASELINE_OK ${latestJson}`);
  console.log(`BASELINE_OK ${latestMd}`);
}

main().catch((error) => {
  console.error("BASELINE_FAIL", error?.message || error);
  process.exit(1);
});
