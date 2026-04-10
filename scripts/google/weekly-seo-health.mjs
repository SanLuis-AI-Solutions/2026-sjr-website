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
const KEY_EVENTS = [
  "quote_form_start",
  "booking_form_start",
  "phone_call_click",
  "quote_submit_success",
  "booking_submit_success",
  "booking_submit_pending",
];

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

async function main() {
  const localEnv = loadLocalEnv();
  const { analyticsAdmin, analyticsData, webmasters } = await createGoogleClients(localEnv);
  const { startDate, endDate } = getDateRange(7);
  const targetSite =
    getEnv(localEnv, "SEARCH_CONSOLE_PROPERTY") || "https://www.susiesjewelryrepair.com/";
  const { propertyId } = await resolveGa4Targets(analyticsAdmin);
  const targetPropertyId = getEnv(localEnv, "GA4_PROPERTY_ID", propertyId);

  if (!targetPropertyId) {
    throw new Error("GA4_PROPERTY_ID is missing and could not be auto-detected.");
  }

  const [
    gscResponse,
    organicSessionRows,
    keyEventRows,
    landingRows,
    allHostRows,
    organicHostRows,
  ] = await Promise.all([
    webmasters.searchanalytics.query({
      siteUrl: targetSite,
      requestBody: { startDate, endDate, rowLimit: 1 },
    }),
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
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
    }),
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: { values: KEY_EVENTS },
        },
      },
      limit: 20,
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
      limit: 10,
    }),
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "hostName" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
    runGaReport(analyticsData, targetPropertyId, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "hostName" }],
      metrics: [{ name: "sessions" }],
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: { matchType: "EXACT", value: "Organic Search" },
        },
      },
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
  ]);

  const gscRow = gscResponse.data.rows?.[0];
  const organicSessions = toNum(organicSessionRows[0]?.metricValues?.[0]?.value);
  const keyEvents = Object.fromEntries(KEY_EVENTS.map((eventName) => [eventName, 0]));
  for (const row of keyEventRows) {
    const eventName = row.dimensionValues?.[0]?.value || "";
    if (!(eventName in keyEvents)) continue;
    keyEvents[eventName] = toNum(row.metricValues?.[0]?.value);
  }
  const hostnameSessions = allHostRows.map((row) => ({
    hostName: row.dimensionValues?.[0]?.value || "(not set)",
    sessions: toNum(row.metricValues?.[0]?.value),
  }));
  const organicHostnameSessions = organicHostRows.map((row) => ({
    hostName: row.dimensionValues?.[0]?.value || "(not set)",
    sessions: toNum(row.metricValues?.[0]?.value),
  }));
  const totalSessionsAllHosts = hostnameSessions.reduce((sum, row) => sum + row.sessions, 0);
  const organicSessionsAllHosts = organicHostnameSessions.reduce(
    (sum, row) => sum + row.sessions,
    0
  );
  const dataQualityAlerts = [];
  if (toNum(gscRow?.clicks) > 0 && organicSessionsAllHosts === 0) {
    dataQualityAlerts.push(
      "Search Console is reporting clicks, but GA4 shows zero organic sessions across all hosts for the same window."
    );
  } else if (toNum(gscRow?.clicks) > 0 && organicSessions === 0 && organicSessionsAllHosts > 0) {
    dataQualityAlerts.push(
      "Organic sessions exist in GA4, but none are attributed to the canonical production host filter."
    );
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    range: { startDate, endDate },
    searchConsole: {
      clicks: toNum(gscRow?.clicks),
      impressions: toNum(gscRow?.impressions),
      ctr: toNum(gscRow?.ctr),
      avgPosition: toNum(gscRow?.position),
    },
    ga4: {
      productionHost: PRODUCTION_HOST,
      organicSessions,
      organicSessionsAllHosts,
      totalSessionsAllHosts,
      keyEvents,
      dataQualityAlerts,
      hostnameSessions,
      organicHostnameSessions,
      topLandingPages: landingRows.map((row) => ({
        page: row.dimensionValues?.[0]?.value || "(not set)",
        sessions: toNum(row.metricValues?.[0]?.value),
      })),
    },
  };

  const markdown = [
    "# Weekly SEO Health Snapshot",
    "",
    `- Generated: ${snapshot.generatedAt}`,
    `- Date range: ${startDate} to ${endDate}`,
    `- Search Console property: ${targetSite}`,
    `- GA4 property: ${targetPropertyId}`,
    `- Production hostname filter: ${PRODUCTION_HOST}`,
    "",
    "## Core KPIs",
    "",
    table(
      ["Metric", "Value", "Why it matters"],
      [
        ["Google Search clicks", formatInt(snapshot.searchConsole.clicks), "Search demand that turned into visits"],
        ["Google Search impressions", formatInt(snapshot.searchConsole.impressions), "How often the site showed in Google"],
        ["Production-host organic sessions", formatInt(snapshot.ga4.organicSessions), "Organic sessions on the canonical site only"],
        ["All-host organic sessions", formatInt(snapshot.ga4.organicSessionsAllHosts), "Organic sessions before canonical-host filtering"],
        ["All-host total sessions", formatInt(snapshot.ga4.totalSessionsAllHosts), "All GA4 sessions regardless of channel or host"],
        [
          "Quote + booking starts",
          formatInt(snapshot.ga4.keyEvents.quote_form_start + snapshot.ga4.keyEvents.booking_form_start),
          "Commercial-intent starts before form completion",
        ],
        ["Phone call clicks", formatInt(snapshot.ga4.keyEvents.phone_call_click), "Direct call intent from the site"],
        [
          "Quote + booking outcomes",
          formatInt(
            snapshot.ga4.keyEvents.quote_submit_success +
              snapshot.ga4.keyEvents.booking_submit_success +
              snapshot.ga4.keyEvents.booking_submit_pending
          ),
          "Submitted or pending lead outcomes from the high-intent flows",
        ],
      ]
    ),
    "",
    "## Search Console Context",
    "",
    `- CTR: ${formatPct(snapshot.searchConsole.ctr)}`,
    `- Average position: ${snapshot.searchConsole.avgPosition.toFixed(2)}`,
    "",
    "## Data Quality Alerts",
    "",
    snapshot.ga4.dataQualityAlerts.length
      ? snapshot.ga4.dataQualityAlerts.map((alert) => `- ${alert}`).join("\n")
      : "_No data quality alerts for this window._",
    "",
    "## Conversion Detail",
    "",
    table(
      ["Event", "Count"],
      [
        ["quote_form_start", formatInt(snapshot.ga4.keyEvents.quote_form_start)],
        ["booking_form_start", formatInt(snapshot.ga4.keyEvents.booking_form_start)],
        ["phone_call_click", formatInt(snapshot.ga4.keyEvents.phone_call_click)],
        ["quote_submit_success", formatInt(snapshot.ga4.keyEvents.quote_submit_success)],
        ["booking_submit_success", formatInt(snapshot.ga4.keyEvents.booking_submit_success)],
        ["booking_submit_pending", formatInt(snapshot.ga4.keyEvents.booking_submit_pending)],
      ]
    ),
    "",
    "## Hostname Coverage",
    "",
    snapshot.ga4.hostnameSessions.length
      ? table(
          ["Host", "Sessions"],
          snapshot.ga4.hostnameSessions.map((row) => [row.hostName, formatInt(row.sessions)])
        )
      : "_No hostname session rows were returned._",
    "",
    "## Organic Sessions By Hostname",
    "",
    snapshot.ga4.organicHostnameSessions.length
      ? table(
          ["Host", "Organic Sessions"],
          snapshot.ga4.organicHostnameSessions.map((row) => [row.hostName, formatInt(row.sessions)])
        )
      : "_No organic hostname rows were returned._",
    "",
    "## Top Organic Landing Pages (Production Host Only)",
    "",
    snapshot.ga4.topLandingPages.length
      ? table(
          ["Landing Page", "Sessions"],
          snapshot.ga4.topLandingPages.map((row) => [row.page, formatInt(row.sessions)])
        )
      : "_No organic landing-page rows were returned._",
    "",
  ].join("\n");

  const outDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(outDir, { recursive: true });

  const datedJson = path.join(outDir, `weekly-seo-health-${endDate}.json`);
  const datedMd = path.join(outDir, `weekly-seo-health-${endDate}.md`);
  const latestJson = path.join(outDir, "weekly-seo-health-latest.json");
  const latestMd = path.join(outDir, "weekly-seo-health-latest.md");

  fs.writeFileSync(datedJson, JSON.stringify(snapshot, null, 2), "utf8");
  fs.writeFileSync(datedMd, markdown, "utf8");
  fs.writeFileSync(latestJson, JSON.stringify(snapshot, null, 2), "utf8");
  fs.writeFileSync(latestMd, markdown, "utf8");

  console.log(`WEEKLY_SEO_HEALTH_OK ${datedJson}`);
  console.log(`WEEKLY_SEO_HEALTH_OK ${datedMd}`);
  console.log(`WEEKLY_SEO_HEALTH_OK ${latestJson}`);
  console.log(`WEEKLY_SEO_HEALTH_OK ${latestMd}`);
}

main().catch((error) => {
  console.error("WEEKLY_SEO_HEALTH_FAIL", error?.message || error);
  process.exit(1);
});
