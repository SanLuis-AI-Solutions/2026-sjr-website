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
  "quote_form_view",
  "booking_form_view",
  "contact_form_view",
  "quote_form_start",
  "booking_form_start",
  "contact_form_start",
  "mobile_sticky_cta_click",
  "phone_call_click",
  "quote_submit_success",
  "booking_submit_success",
  "booking_submit_pending",
  "contact_submit_success",
];
const MOBILE_STICKY_CTA_PATH_EVENTS = [
  "quote_form_view",
  "booking_form_view",
  "quote_form_start",
  "booking_form_start",
  "quote_submit_success",
  "booking_submit_success",
  "booking_submit_pending",
];
const ORGANIC_LANDING_CONVERSION_EVENTS = [
  "quote_form_view",
  "booking_form_view",
  "contact_form_view",
  "quote_form_start",
  "booking_form_start",
  "contact_form_start",
  "phone_call_click",
  "quote_submit_success",
  "booking_submit_success",
  "booking_submit_pending",
  "contact_submit_success",
];

function leadViews(events) {
  return (
    toNum(events.quote_form_view) +
    toNum(events.booking_form_view) +
    toNum(events.contact_form_view)
  );
}

function leadStarts(events) {
  return (
    toNum(events.quote_form_start) +
    toNum(events.booking_form_start) +
    toNum(events.contact_form_start)
  );
}

function leadOutcomes(events) {
  return (
    toNum(events.quote_submit_success) +
    toNum(events.booking_submit_success) +
    toNum(events.booking_submit_pending) +
    toNum(events.contact_submit_success)
  );
}

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

async function runMobileStickyCtaPathReport(analyticsData, propertyId, startDate, endDate) {
  const buildRequestBody = (pathDimension) => ({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "eventName" }, { name: pathDimension }],
    metrics: [{ name: "eventCount" }],
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
              fieldName: "eventName",
              inListFilter: { values: MOBILE_STICKY_CTA_PATH_EVENTS },
            },
          },
          {
            filter: {
              fieldName: pathDimension,
              stringFilter: { matchType: "CONTAINS", value: "utm_source=mobile_sticky_cta" },
            },
          },
        ],
      },
    },
    limit: 20,
  });

  const attempts = [];
  for (const pathDimension of ["pagePathPlusQueryString", "pageLocation"]) {
    try {
      const rows = await runGaReport(analyticsData, propertyId, buildRequestBody(pathDimension));
      attempts.push({ pathDimension, rows, error: null });
      if (rows.length > 0) {
        return { pathDimension, rows, attempts, error: null };
      }
    } catch (error) {
      attempts.push({ pathDimension, rows: [], error: error?.message || String(error) });
    }
  }

  const firstSuccessfulAttempt = attempts.find((attempt) => !attempt.error);
  if (firstSuccessfulAttempt) {
    return {
      pathDimension: firstSuccessfulAttempt.pathDimension,
      rows: [],
      attempts,
      error: null,
    };
  }

  return { pathDimension: null, rows: [], attempts, error: "No supported page URL dimension found." };
}

async function runMobileStickyCtaSourceReport(analyticsData, propertyId, startDate, endDate) {
  const events = ["mobile_sticky_cta_click", ...MOBILE_STICKY_CTA_PATH_EVENTS];
  const buildRequestBody = (sourceDimension) => ({
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "eventName" }, { name: sourceDimension }],
    metrics: [{ name: "eventCount" }],
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
              fieldName: "eventName",
              inListFilter: { values: events },
            },
          },
          {
            filter: {
              fieldName: sourceDimension,
              stringFilter: { matchType: "EXACT", value: "mobile_sticky_cta" },
            },
          },
        ],
      },
    },
    limit: 20,
  });

  const attempts = [];
  for (const sourceDimension of ["sessionManualSource", "sessionSource"]) {
    try {
      const rows = await runGaReport(analyticsData, propertyId, buildRequestBody(sourceDimension));
      attempts.push({ sourceDimension, rows, error: null });
      if (rows.length > 0) {
        return { sourceDimension, rows, attempts, error: null };
      }
    } catch (error) {
      attempts.push({ sourceDimension, rows: [], error: error?.message || String(error) });
    }
  }

  const firstSuccessfulAttempt = attempts.find((attempt) => !attempt.error);
  if (firstSuccessfulAttempt) {
    return {
      sourceDimension: firstSuccessfulAttempt.sourceDimension,
      rows: [],
      attempts,
      error: null,
    };
  }

  return { sourceDimension: null, rows: [], attempts, error: "No supported source dimension found." };
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
    organicKeyEventRows,
    mobileStickyCtaPathReport,
    mobileStickyCtaSourceReport,
    landingRows,
    organicLandingConversionRows,
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
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
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
            {
              filter: {
                fieldName: "eventName",
                inListFilter: { values: KEY_EVENTS },
              },
            },
          ],
        },
      },
      limit: 20,
    }),
    runMobileStickyCtaPathReport(analyticsData, targetPropertyId, startDate, endDate),
    runMobileStickyCtaSourceReport(analyticsData, targetPropertyId, startDate, endDate),
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
      dimensions: [{ name: "landingPagePlusQueryString" }, { name: "eventName" }],
      metrics: [{ name: "eventCount" }],
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
            {
              filter: {
                fieldName: "eventName",
                inListFilter: { values: ORGANIC_LANDING_CONVERSION_EVENTS },
              },
            },
          ],
        },
      },
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 20,
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
  const organicKeyEvents = Object.fromEntries(KEY_EVENTS.map((eventName) => [eventName, 0]));
  for (const row of organicKeyEventRows) {
    const eventName = row.dimensionValues?.[0]?.value || "";
    if (!(eventName in organicKeyEvents)) continue;
    organicKeyEvents[eventName] = toNum(row.metricValues?.[0]?.value);
  }
  const mobileStickyCtaPathEvents = Object.fromEntries(
    MOBILE_STICKY_CTA_PATH_EVENTS.map((eventName) => [eventName, 0])
  );
  for (const row of mobileStickyCtaPathReport.rows) {
    const eventName = row.dimensionValues?.[0]?.value || "";
    if (!(eventName in mobileStickyCtaPathEvents)) continue;
    mobileStickyCtaPathEvents[eventName] = toNum(row.metricValues?.[0]?.value);
  }
  const mobileStickyCtaPathRows = mobileStickyCtaPathReport.rows.map((row) => ({
    eventName: row.dimensionValues?.[0]?.value || "(not set)",
    path: row.dimensionValues?.[1]?.value || "(not set)",
    count: toNum(row.metricValues?.[0]?.value),
  }));
  const mobileStickyCtaSourceEvents = Object.fromEntries(
    ["mobile_sticky_cta_click", ...MOBILE_STICKY_CTA_PATH_EVENTS].map((eventName) => [eventName, 0])
  );
  for (const row of mobileStickyCtaSourceReport.rows) {
    const eventName = row.dimensionValues?.[0]?.value || "";
    if (!(eventName in mobileStickyCtaSourceEvents)) continue;
    mobileStickyCtaSourceEvents[eventName] = toNum(row.metricValues?.[0]?.value);
  }
  const mobileStickyCtaSourceRows = mobileStickyCtaSourceReport.rows.map((row) => ({
    eventName: row.dimensionValues?.[0]?.value || "(not set)",
    source: row.dimensionValues?.[1]?.value || "(not set)",
    count: toNum(row.metricValues?.[0]?.value),
  }));
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
  if (mobileStickyCtaPathReport.error) {
    dataQualityAlerts.push(
      `Mobile sticky CTA UTM-path report could not run: ${mobileStickyCtaPathReport.error}`
    );
  }
  if (mobileStickyCtaSourceReport.error) {
    dataQualityAlerts.push(
      `Mobile sticky CTA source report could not run: ${mobileStickyCtaSourceReport.error}`
    );
  }
  if (
    toNum(keyEvents.mobile_sticky_cta_click) > 0 &&
    Object.values(mobileStickyCtaPathEvents).every((value) => toNum(value) === 0) &&
    MOBILE_STICKY_CTA_PATH_EVENTS.every((eventName) => toNum(mobileStickyCtaSourceEvents[eventName]) === 0)
  ) {
    dataQualityAlerts.push(
      "Mobile sticky CTA clicks exist, but no downstream quote/booking events were found by sticky UTM path or sticky session source for this window."
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
      organicKeyEvents,
      mobileStickyCta: {
        pathDimension: mobileStickyCtaPathReport.pathDimension,
        pathEvents: mobileStickyCtaPathEvents,
        pathRows: mobileStickyCtaPathRows,
        attemptedPathDimensions: mobileStickyCtaPathReport.attempts.map((attempt) => ({
          pathDimension: attempt.pathDimension,
          rows: attempt.rows.length,
          error: attempt.error,
        })),
        sourceDimension: mobileStickyCtaSourceReport.sourceDimension,
        sourceEvents: mobileStickyCtaSourceEvents,
        sourceRows: mobileStickyCtaSourceRows,
        attemptedSourceDimensions: mobileStickyCtaSourceReport.attempts.map((attempt) => ({
          sourceDimension: attempt.sourceDimension,
          rows: attempt.rows.length,
          error: attempt.error,
        })),
      },
      dataQualityAlerts,
      hostnameSessions,
      organicHostnameSessions,
      topLandingPages: landingRows.map((row) => ({
        page: row.dimensionValues?.[0]?.value || "(not set)",
        sessions: toNum(row.metricValues?.[0]?.value),
      })),
      organicLandingConversions: organicLandingConversionRows.map((row) => ({
        landingPage: row.dimensionValues?.[0]?.value || "(not set)",
        eventName: row.dimensionValues?.[1]?.value || "(not set)",
        count: toNum(row.metricValues?.[0]?.value),
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
          "Lead form views",
          formatInt(leadViews(snapshot.ga4.keyEvents)),
          "Quote, booking, and contact forms that entered the viewport",
        ],
        [
          "Organic lead form views",
          formatInt(leadViews(snapshot.ga4.organicKeyEvents)),
          "Form-view arrivals attributed to Organic Search",
        ],
        [
          "Lead form starts",
          formatInt(leadStarts(snapshot.ga4.keyEvents)),
          "Quote, booking, and contact starts before form completion",
        ],
        [
          "Organic lead form starts",
          formatInt(leadStarts(snapshot.ga4.organicKeyEvents)),
          "Quote, booking, and contact starts attributed to Organic Search",
        ],
        [
          "Mobile sticky CTA clicks",
          formatInt(snapshot.ga4.keyEvents.mobile_sticky_cta_click),
          "Clicks from the compact mobile quote shortcut",
        ],
        ["Phone call clicks", formatInt(snapshot.ga4.keyEvents.phone_call_click), "Direct call intent from the site"],
        [
          "Lead outcomes",
          formatInt(leadOutcomes(snapshot.ga4.keyEvents)),
          "Submitted or pending outcomes from quote, booking, and contact flows",
        ],
        [
          "Organic lead outcomes",
          formatInt(leadOutcomes(snapshot.ga4.organicKeyEvents)),
          "Submitted or pending lead outcomes attributed to Organic Search",
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
        ["quote_form_view", formatInt(snapshot.ga4.keyEvents.quote_form_view)],
        ["booking_form_view", formatInt(snapshot.ga4.keyEvents.booking_form_view)],
        ["contact_form_view", formatInt(snapshot.ga4.keyEvents.contact_form_view)],
        ["quote_form_start", formatInt(snapshot.ga4.keyEvents.quote_form_start)],
        ["booking_form_start", formatInt(snapshot.ga4.keyEvents.booking_form_start)],
        ["contact_form_start", formatInt(snapshot.ga4.keyEvents.contact_form_start)],
        ["mobile_sticky_cta_click", formatInt(snapshot.ga4.keyEvents.mobile_sticky_cta_click)],
        ["phone_call_click", formatInt(snapshot.ga4.keyEvents.phone_call_click)],
        ["quote_submit_success", formatInt(snapshot.ga4.keyEvents.quote_submit_success)],
        ["booking_submit_success", formatInt(snapshot.ga4.keyEvents.booking_submit_success)],
        ["booking_submit_pending", formatInt(snapshot.ga4.keyEvents.booking_submit_pending)],
        ["contact_submit_success", formatInt(snapshot.ga4.keyEvents.contact_submit_success)],
      ]
    ),
    "",
    "## Organic Conversion Detail",
    "",
    table(
      ["Event", "Organic Count"],
      [
        ["quote_form_view", formatInt(snapshot.ga4.organicKeyEvents.quote_form_view)],
        ["booking_form_view", formatInt(snapshot.ga4.organicKeyEvents.booking_form_view)],
        ["contact_form_view", formatInt(snapshot.ga4.organicKeyEvents.contact_form_view)],
        ["quote_form_start", formatInt(snapshot.ga4.organicKeyEvents.quote_form_start)],
        ["booking_form_start", formatInt(snapshot.ga4.organicKeyEvents.booking_form_start)],
        ["contact_form_start", formatInt(snapshot.ga4.organicKeyEvents.contact_form_start)],
        ["mobile_sticky_cta_click", formatInt(snapshot.ga4.organicKeyEvents.mobile_sticky_cta_click)],
        ["phone_call_click", formatInt(snapshot.ga4.organicKeyEvents.phone_call_click)],
        ["quote_submit_success", formatInt(snapshot.ga4.organicKeyEvents.quote_submit_success)],
        ["booking_submit_success", formatInt(snapshot.ga4.organicKeyEvents.booking_submit_success)],
        ["booking_submit_pending", formatInt(snapshot.ga4.organicKeyEvents.booking_submit_pending)],
        ["contact_submit_success", formatInt(snapshot.ga4.organicKeyEvents.contact_submit_success)],
      ]
    ),
    "",
    "## Mobile Sticky CTA Funnel",
    "",
    table(
      ["Step", "Count"],
      [
        [
          "mobile_sticky_cta_click",
          formatInt(snapshot.ga4.keyEvents.mobile_sticky_cta_click),
        ],
        [
          "quote_form_view on sticky CTA UTM path",
          formatInt(snapshot.ga4.mobileStickyCta.pathEvents.quote_form_view),
        ],
        [
          "quote_form_view on sticky CTA session source",
          formatInt(snapshot.ga4.mobileStickyCta.sourceEvents.quote_form_view),
        ],
        [
          "quote_form_start on sticky CTA UTM path",
          formatInt(snapshot.ga4.mobileStickyCta.pathEvents.quote_form_start),
        ],
        [
          "quote_form_start on sticky CTA session source",
          formatInt(snapshot.ga4.mobileStickyCta.sourceEvents.quote_form_start),
        ],
        [
          "booking_form_view on sticky CTA UTM path",
          formatInt(snapshot.ga4.mobileStickyCta.pathEvents.booking_form_view),
        ],
        [
          "booking_form_view on sticky CTA session source",
          formatInt(snapshot.ga4.mobileStickyCta.sourceEvents.booking_form_view),
        ],
        [
          "booking_form_start on sticky CTA UTM path",
          formatInt(snapshot.ga4.mobileStickyCta.pathEvents.booking_form_start),
        ],
        [
          "booking_form_start on sticky CTA session source",
          formatInt(snapshot.ga4.mobileStickyCta.sourceEvents.booking_form_start),
        ],
        [
          "quote_submit_success on sticky CTA UTM path",
          formatInt(snapshot.ga4.mobileStickyCta.pathEvents.quote_submit_success),
        ],
        [
          "quote_submit_success on sticky CTA session source",
          formatInt(snapshot.ga4.mobileStickyCta.sourceEvents.quote_submit_success),
        ],
        [
          "booking_submit_success on sticky CTA UTM path",
          formatInt(snapshot.ga4.mobileStickyCta.pathEvents.booking_submit_success),
        ],
        [
          "booking_submit_success on sticky CTA session source",
          formatInt(snapshot.ga4.mobileStickyCta.sourceEvents.booking_submit_success),
        ],
        [
          "booking_submit_pending on sticky CTA UTM path",
          formatInt(snapshot.ga4.mobileStickyCta.pathEvents.booking_submit_pending),
        ],
        [
          "booking_submit_pending on sticky CTA session source",
          formatInt(snapshot.ga4.mobileStickyCta.sourceEvents.booking_submit_pending),
        ],
      ]
    ),
    "",
    `- Sticky CTA path filter dimension: ${snapshot.ga4.mobileStickyCta.pathDimension || "unavailable"}`,
    `- Sticky CTA attempted path dimensions: ${snapshot.ga4.mobileStickyCta.attemptedPathDimensions
      .map((attempt) =>
        `${attempt.pathDimension}: ${attempt.error ? `error (${attempt.error})` : `${attempt.rows} rows`}`
      )
      .join("; ")}`,
    `- Sticky CTA source filter dimension: ${snapshot.ga4.mobileStickyCta.sourceDimension || "unavailable"}`,
    `- Sticky CTA attempted source dimensions: ${snapshot.ga4.mobileStickyCta.attemptedSourceDimensions
      .map((attempt) =>
        `${attempt.sourceDimension}: ${attempt.error ? `error (${attempt.error})` : `${attempt.rows} rows`}`
      )
      .join("; ")}`,
    "",
    "### Sticky CTA UTM Path Rows",
    "",
    snapshot.ga4.mobileStickyCta.pathRows.length
      ? table(
          ["Event", "Path", "Count"],
          snapshot.ga4.mobileStickyCta.pathRows.map((row) => [
            row.eventName,
            row.path,
            formatInt(row.count),
          ])
        )
      : "_No downstream quote or booking events were returned on the sticky UTM path._",
    "",
    "### Sticky CTA Session Source Rows",
    "",
    snapshot.ga4.mobileStickyCta.sourceRows.length
      ? table(
          ["Event", "Source", "Count"],
          snapshot.ga4.mobileStickyCta.sourceRows.map((row) => [
            row.eventName,
            row.source,
            formatInt(row.count),
          ])
        )
      : "_No sticky source-attributed quote or booking rows were returned._",
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
    "## Organic Conversions By Landing Page",
    "",
    snapshot.ga4.organicLandingConversions.length
      ? table(
          ["Landing Page", "Event", "Count"],
          snapshot.ga4.organicLandingConversions.map((row) => [
            row.landingPage,
            row.eventName,
            formatInt(row.count),
          ])
        )
      : "_No organic conversion events were returned by landing page._",
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
