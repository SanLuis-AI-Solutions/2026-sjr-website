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
  "service_cta_click",
  "conversion_quick_action_click",
  "conversion_quick_action_click_control",
  "conversion_quick_action_click_primary_focus",
  "phone_call_click",
  "email_contact_click",
  "directions_click",
  "review_click",
  "lead_form_start",
  "lead_form_step",
  "lead_form_submit_attempt",
  "lead_form_error",
  "quote_submit_success",
  "booking_submit_success",
  "booking_submit_pending",
  "contact_submit_success",
];

const PAGE_PATHS = ["/", "/services", "/services/watch-repair", "/services/ring-sizing", "/quote", "/book", "/contact", "/faq", "/blog"];

function toNum(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function formatInt(value) {
  return toNum(value).toLocaleString("en-US");
}

function asPercent(value) {
  return `${(toNum(value) * 100).toFixed(2)}%`;
}

function safeRate(num, den) {
  const numerator = toNum(num);
  const denominator = toNum(den);
  if (denominator <= 0) return 0;
  return numerator / denominator;
}

async function runEventCountReport(analyticsData, propertyId, startDate, endDate) {
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

  const events = Object.fromEntries(TRACKED_EVENTS.map((name) => [name, 0]));
  for (const row of report.data.rows || []) {
    const name = row.dimensionValues?.[0]?.value || "";
    if (!(name in events)) continue;
    events[name] = toNum(row.metricValues?.[0]?.value);
  }
  return events;
}

async function runPageViewsReport(analyticsData, propertyId, startDate, endDate) {
  const report = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          inListFilter: { values: PAGE_PATHS },
        },
      },
      limit: 100,
    },
  });

  const views = Object.fromEntries(PAGE_PATHS.map((p) => [p, 0]));
  for (const row of report.data.rows || []) {
    const pathName = row.dimensionValues?.[0]?.value || "";
    if (!(pathName in views)) continue;
    views[pathName] = toNum(row.metricValues?.[0]?.value);
  }
  return views;
}

async function runToplineReport(analyticsData, propertyId, startDate, endDate) {
  const report = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "engagedSessions" },
        { name: "screenPageViews" },
      ],
    },
  });

  const values = report.data.rows?.[0]?.metricValues || [];
  return {
    activeUsers: toNum(values[0]?.value),
    sessions: toNum(values[1]?.value),
    engagedSessions: toNum(values[2]?.value),
    pageViews: toNum(values[3]?.value),
  };
}

async function runSearchConsoleTopline(webmasters, targetSite, startDate, endDate) {
  const result = await webmasters.searchanalytics.query({
    siteUrl: targetSite,
    requestBody: { startDate, endDate, rowLimit: 1 },
  });
  const row = result.data.rows?.[0];
  return {
    clicks: toNum(row?.clicks),
    impressions: toNum(row?.impressions),
    ctr: toNum(row?.ctr),
    avgPosition: toNum(row?.position),
  };
}

async function main() {
  const localEnv = loadLocalEnv();
  const { webmasters, analyticsAdmin, analyticsData } = await createGoogleClients(localEnv);
  const { startDate, endDate } = getDateRange(7);
  const targetSite =
    getEnv(localEnv, "SEARCH_CONSOLE_PROPERTY") || "https://www.susiesjewelryrepair.com/";

  const { propertyId } = await resolveGa4Targets(analyticsAdmin);
  const targetPropertyId = getEnv(localEnv, "GA4_PROPERTY_ID", propertyId);
  if (!targetPropertyId) {
    throw new Error("GA4_PROPERTY_ID is missing and could not be auto-detected.");
  }

  const [topline, eventCounts, pageViews, gscTopline] = await Promise.all([
    runToplineReport(analyticsData, targetPropertyId, startDate, endDate),
    runEventCountReport(analyticsData, targetPropertyId, startDate, endDate),
    runPageViewsReport(analyticsData, targetPropertyId, startDate, endDate),
    runSearchConsoleTopline(webmasters, targetSite, startDate, endDate),
  ]);

  const funnel = {
    exploreActions:
      eventCounts.service_card_click +
      eventCounts.services_hub_cta_click +
      eventCounts.service_cta_click +
      eventCounts.conversion_quick_action_click,
    formStarts: eventCounts.lead_form_start,
    formSubmitAttempts: eventCounts.lead_form_submit_attempt,
    formErrors: eventCounts.lead_form_error,
    quoteSuccess: eventCounts.quote_submit_success,
    bookingSuccess: eventCounts.booking_submit_success,
    bookingPending: eventCounts.booking_submit_pending,
    contactSuccess: eventCounts.contact_submit_success,
  };

  funnel.totalLeadOutcomes =
    funnel.quoteSuccess + funnel.bookingSuccess + funnel.bookingPending + funnel.contactSuccess;

  const routeConversion = {
    quote: {
      pageViews: pageViews["/quote"],
      outcomes: funnel.quoteSuccess,
      rate: safeRate(funnel.quoteSuccess, pageViews["/quote"]),
    },
    book: {
      pageViews: pageViews["/book"],
      outcomes: funnel.bookingSuccess + funnel.bookingPending,
      rate: safeRate(funnel.bookingSuccess + funnel.bookingPending, pageViews["/book"]),
    },
    contact: {
      pageViews: pageViews["/contact"],
      outcomes: funnel.contactSuccess,
      rate: safeRate(funnel.contactSuccess, pageViews["/contact"]),
    },
  };

  const ctaVariant = {
    control: eventCounts.conversion_quick_action_click_control,
    primaryFocus: eventCounts.conversion_quick_action_click_primary_focus,
  };
  ctaVariant.total = ctaVariant.control + ctaVariant.primaryFocus;
  ctaVariant.controlShare = safeRate(ctaVariant.control, ctaVariant.total);
  ctaVariant.primaryFocusShare = safeRate(ctaVariant.primaryFocus, ctaVariant.total);

  const businessActions = {
    phoneCall: eventCounts.phone_call_click,
    emailContact: eventCounts.email_contact_click,
    directions: eventCounts.directions_click,
    reviews: eventCounts.review_click,
  };
  businessActions.total =
    businessActions.phoneCall +
    businessActions.emailContact +
    businessActions.directions +
    businessActions.reviews;

  const snapshot = {
    generatedAt: new Date().toISOString(),
    dateRange: { startDate, endDate },
    searchConsole: {
      property: targetSite,
      ...gscTopline,
    },
    ga4: {
      propertyId: targetPropertyId,
      topline,
      eventCounts,
      pageViews,
      funnel,
      routeConversion,
      ctaVariant,
      derived: {
        startToAttemptRate: safeRate(funnel.formSubmitAttempts, funnel.formStarts),
        attemptToOutcomeRate: safeRate(funnel.totalLeadOutcomes, funnel.formSubmitAttempts),
        startToOutcomeRate: safeRate(funnel.totalLeadOutcomes, funnel.formStarts),
      },
    },
  };

  const markdown = [
    "# Weekly KPI Snapshot (GA4 + GSC)",
    "",
    `- Generated: ${snapshot.generatedAt}`,
    `- Date range: ${startDate} to ${endDate}`,
    `- GA4 property: ${targetPropertyId}`,
    `- Search Console property: ${targetSite}`,
    "",
    "## Topline",
    `- Active users: ${formatInt(topline.activeUsers)}`,
    `- Sessions: ${formatInt(topline.sessions)}`,
    `- Engaged sessions: ${formatInt(topline.engagedSessions)}`,
    `- Page views: ${formatInt(topline.pageViews)}`,
    `- GSC clicks: ${formatInt(gscTopline.clicks)}`,
    `- GSC impressions: ${formatInt(gscTopline.impressions)}`,
    `- GSC CTR: ${asPercent(gscTopline.ctr)}`,
    `- GSC avg position: ${gscTopline.avgPosition.toFixed(2)}`,
    "",
    "## Funnel (7d)",
    `- Explore actions: ${formatInt(funnel.exploreActions)}`,
    `- Form starts: ${formatInt(funnel.formStarts)}`,
    `- Form submit attempts: ${formatInt(funnel.formSubmitAttempts)}`,
    `- Total lead outcomes: ${formatInt(funnel.totalLeadOutcomes)}`,
    `- Form errors: ${formatInt(funnel.formErrors)}`,
    `- Start -> Attempt rate: ${asPercent(snapshot.ga4.derived.startToAttemptRate)}`,
    `- Attempt -> Outcome rate: ${asPercent(snapshot.ga4.derived.attemptToOutcomeRate)}`,
    `- Start -> Outcome rate: ${asPercent(snapshot.ga4.derived.startToOutcomeRate)}`,
    "",
    "## Route Conversion (7d)",
    "| Route | Page Views | Outcomes | Outcome Rate |",
    "| --- | --- | --- | --- |",
    `| /quote | ${formatInt(routeConversion.quote.pageViews)} | ${formatInt(routeConversion.quote.outcomes)} | ${asPercent(routeConversion.quote.rate)} |`,
    `| /book | ${formatInt(routeConversion.book.pageViews)} | ${formatInt(routeConversion.book.outcomes)} | ${asPercent(routeConversion.book.rate)} |`,
    `| /contact | ${formatInt(routeConversion.contact.pageViews)} | ${formatInt(routeConversion.contact.outcomes)} | ${asPercent(routeConversion.contact.rate)} |`,
    "",
    "## Quick Action Variant Split",
    `- Control clicks: ${formatInt(ctaVariant.control)} (${asPercent(ctaVariant.controlShare)})`,
    `- Primary-focus clicks: ${formatInt(ctaVariant.primaryFocus)} (${asPercent(ctaVariant.primaryFocusShare)})`,
    "",
    "## Business Action Clicks",
    `- Phone calls: ${formatInt(businessActions.phoneCall)}`,
    `- Email clicks: ${formatInt(businessActions.emailContact)}`,
    `- Directions clicks: ${formatInt(businessActions.directions)}`,
    `- Review clicks: ${formatInt(businessActions.reviews)}`,
    `- Total business-action clicks: ${formatInt(businessActions.total)}`,
    "",
    "## Tracked Event Counts (7d)",
    "| Event | Count |",
    "| --- | --- |",
    ...TRACKED_EVENTS.map((eventName) => `| ${eventName} | ${formatInt(eventCounts[eventName])} |`),
    "",
  ].join("\n");

  const outDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(outDir, { recursive: true });

  const datedJson = path.join(outDir, `kpi-weekly-snapshot-${endDate}.json`);
  const latestJson = path.join(outDir, "kpi-weekly-snapshot-latest.json");
  const datedMd = path.join(outDir, `kpi-weekly-snapshot-${endDate}.md`);
  const latestMd = path.join(outDir, "kpi-weekly-snapshot-latest.md");

  fs.writeFileSync(datedJson, JSON.stringify(snapshot, null, 2), "utf8");
  fs.writeFileSync(latestJson, JSON.stringify(snapshot, null, 2), "utf8");
  fs.writeFileSync(datedMd, markdown, "utf8");
  fs.writeFileSync(latestMd, markdown, "utf8");

  console.log(`KPI_SNAPSHOT_OK ${datedJson}`);
  console.log(`KPI_SNAPSHOT_OK ${datedMd}`);
  console.log(`KPI_SNAPSHOT_OK ${latestJson}`);
  console.log(`KPI_SNAPSHOT_OK ${latestMd}`);
}

main().catch((error) => {
  console.error("KPI_SNAPSHOT_FAIL", error?.message || error);
  process.exit(1);
});
