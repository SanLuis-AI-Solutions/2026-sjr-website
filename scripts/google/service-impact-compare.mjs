import fs from "node:fs";
import path from "node:path";
import { createGoogleClients, getEnv, loadLocalEnv, resolveGa4Targets } from "./_lib.mjs";

const SERVICE_PATHS = [
  "/services/watch-repair",
  "/services/ring-sizing",
  "/services/stone-setting",
  "/services/jewelry-cleaning",
  "/services/necklace-repair",
  "/services/bracelet-repair",
  "/services/pearl-restringing",
  "/services/custom-design",
  "/services/heirloom-restoration",
];

const IMPACT_EVENTS = [
  "service_section_view",
  "service_faq_open",
  "service_decision_expand",
  "service_market_expand",
  "service_cta_click",
  "lead_form_start",
  "lead_form_submit_attempt",
  "quote_submit_success",
  "booking_submit_success",
  "booking_submit_pending",
  "contact_submit_success",
];

function toNum(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function formatInt(value) {
  return toNum(value).toLocaleString("en-US");
}

function formatPct(value) {
  if (!Number.isFinite(value)) return "n/a";
  return `${(value * 100).toFixed(1)}%`;
}

function deltaPct(current, previous) {
  const prev = toNum(previous);
  if (prev <= 0) return null;
  return (toNum(current) - prev) / prev;
}

function deriveRanges() {
  if (
    process.env.REPORT_START_DATE &&
    process.env.REPORT_END_DATE &&
    process.env.PRIOR_REPORT_START_DATE &&
    process.env.PRIOR_REPORT_END_DATE
  ) {
    return {
      current: {
        startDate: process.env.REPORT_START_DATE,
        endDate: process.env.REPORT_END_DATE,
      },
      previous: {
        startDate: process.env.PRIOR_REPORT_START_DATE,
        endDate: process.env.PRIOR_REPORT_END_DATE,
      },
    };
  }

  // Use complete UTC days. Current window ends yesterday.
  const endCurrent = new Date();
  endCurrent.setUTCDate(endCurrent.getUTCDate() - 1);
  const startCurrent = new Date(endCurrent);
  startCurrent.setUTCDate(endCurrent.getUTCDate() - 6);

  const endPrevious = new Date(startCurrent);
  endPrevious.setUTCDate(startCurrent.getUTCDate() - 1);
  const startPrevious = new Date(endPrevious);
  startPrevious.setUTCDate(endPrevious.getUTCDate() - 6);

  const toIso = (d) => d.toISOString().slice(0, 10);

  return {
    current: { startDate: toIso(startCurrent), endDate: toIso(endCurrent) },
    previous: { startDate: toIso(startPrevious), endDate: toIso(endPrevious) },
  };
}

async function runPageViews(analyticsData, propertyId, dateRange, pagePaths) {
  const report = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [dateRange],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          inListFilter: { values: pagePaths },
        },
      },
      limit: 100,
    },
  });

  const views = Object.fromEntries(pagePaths.map((p) => [p, 0]));
  for (const row of report.data.rows || []) {
    const route = row.dimensionValues?.[0]?.value || "";
    if (!(route in views)) continue;
    views[route] = toNum(row.metricValues?.[0]?.value);
  }
  return views;
}

async function runEventCounts(analyticsData, propertyId, dateRange, events) {
  const report = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [dateRange],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          inListFilter: { values: events },
        },
      },
      limit: 100,
    },
  });

  const counts = Object.fromEntries(events.map((name) => [name, 0]));
  for (const row of report.data.rows || []) {
    const eventName = row.dimensionValues?.[0]?.value || "";
    if (!(eventName in counts)) continue;
    counts[eventName] = toNum(row.metricValues?.[0]?.value);
  }
  return counts;
}

function summarizeRouteDeltas(routeRows) {
  const ranked = [...routeRows].sort((a, b) => (b.deltaPct ?? -Infinity) - (a.deltaPct ?? -Infinity));
  return {
    topUp: ranked.find((r) => r.deltaPct !== null),
    topDown: [...ranked]
      .reverse()
      .find((r) => r.deltaPct !== null),
  };
}

async function main() {
  const localEnv = loadLocalEnv();
  const { analyticsAdmin, analyticsData } = await createGoogleClients(localEnv);
  const { propertyId } = await resolveGa4Targets(analyticsAdmin);
  const targetPropertyId = getEnv(localEnv, "GA4_PROPERTY_ID", propertyId);

  if (!targetPropertyId) {
    throw new Error("GA4_PROPERTY_ID is missing and could not be auto-detected.");
  }

  const ranges = deriveRanges();

  const [currentViews, previousViews, currentEvents, previousEvents] = await Promise.all([
    runPageViews(analyticsData, targetPropertyId, ranges.current, SERVICE_PATHS),
    runPageViews(analyticsData, targetPropertyId, ranges.previous, SERVICE_PATHS),
    runEventCounts(analyticsData, targetPropertyId, ranges.current, IMPACT_EVENTS),
    runEventCounts(analyticsData, targetPropertyId, ranges.previous, IMPACT_EVENTS),
  ]);

  const routeRows = SERVICE_PATHS.map((route) => {
    const current = toNum(currentViews[route]);
    const previous = toNum(previousViews[route]);
    return {
      route,
      current,
      previous,
      delta: current - previous,
      deltaPct: deltaPct(current, previous),
    };
  });

  const eventRows = IMPACT_EVENTS.map((eventName) => {
    const current = toNum(currentEvents[eventName]);
    const previous = toNum(previousEvents[eventName]);
    return {
      eventName,
      current,
      previous,
      delta: current - previous,
      deltaPct: deltaPct(current, previous),
    };
  });

  const routeTotals = routeRows.reduce(
    (acc, row) => {
      acc.current += row.current;
      acc.previous += row.previous;
      return acc;
    },
    { current: 0, previous: 0 }
  );
  const routeDeltaPct = deltaPct(routeTotals.current, routeTotals.previous);

  const outcomesCurrent =
    currentEvents.quote_submit_success +
    currentEvents.booking_submit_success +
    currentEvents.booking_submit_pending +
    currentEvents.contact_submit_success;
  const outcomesPrevious =
    previousEvents.quote_submit_success +
    previousEvents.booking_submit_success +
    previousEvents.booking_submit_pending +
    previousEvents.contact_submit_success;

  const routeSummary = summarizeRouteDeltas(routeRows);

  const result = {
    generatedAt: new Date().toISOString(),
    ga4PropertyId: targetPropertyId,
    ranges,
    routeTotals: {
      ...routeTotals,
      delta: routeTotals.current - routeTotals.previous,
      deltaPct: routeDeltaPct,
    },
    outcomes: {
      current: outcomesCurrent,
      previous: outcomesPrevious,
      delta: outcomesCurrent - outcomesPrevious,
      deltaPct: deltaPct(outcomesCurrent, outcomesPrevious),
    },
    routes: routeRows,
    events: eventRows,
    highlights: {
      strongestRouteGain: routeSummary.topUp?.route || null,
      strongestRouteDrop: routeSummary.topDown?.route || null,
    },
  };

  const lines = [
    "# Service Impact Compare (Current 7d vs Prior 7d)",
    "",
    `- Generated: ${result.generatedAt}`,
    `- GA4 property: ${targetPropertyId}`,
    `- Current window: ${ranges.current.startDate} to ${ranges.current.endDate}`,
    `- Prior window: ${ranges.previous.startDate} to ${ranges.previous.endDate}`,
    "",
    "## Service Route Totals",
    `- Current service-detail page views: ${formatInt(routeTotals.current)}`,
    `- Prior service-detail page views: ${formatInt(routeTotals.previous)}`,
    `- Delta: ${formatInt(routeTotals.current - routeTotals.previous)} (${formatPct(routeDeltaPct)})`,
    "",
    "## Lead Outcome Events",
    `- Current outcomes: ${formatInt(outcomesCurrent)}`,
    `- Prior outcomes: ${formatInt(outcomesPrevious)}`,
    `- Delta: ${formatInt(outcomesCurrent - outcomesPrevious)} (${formatPct(deltaPct(outcomesCurrent, outcomesPrevious))})`,
    "",
    "## Service Route View Delta",
    "| Route | Current | Prior | Delta | Delta % |",
    "| --- | --- | --- | --- | --- |",
    ...routeRows.map(
      (row) =>
        `| ${row.route} | ${formatInt(row.current)} | ${formatInt(row.previous)} | ${formatInt(row.delta)} | ${formatPct(row.deltaPct)} |`
    ),
    "",
    "## Event Delta",
    "| Event | Current | Prior | Delta | Delta % |",
    "| --- | --- | --- | --- | --- |",
    ...eventRows.map(
      (row) =>
        `| ${row.eventName} | ${formatInt(row.current)} | ${formatInt(row.previous)} | ${formatInt(row.delta)} | ${formatPct(row.deltaPct)} |`
    ),
    "",
    `- Strongest route gain: ${result.highlights.strongestRouteGain || "n/a"}`,
    `- Strongest route drop: ${result.highlights.strongestRouteDrop || "n/a"}`,
    "",
  ];

  const outDir = path.join(process.cwd(), ".health");
  fs.mkdirSync(outDir, { recursive: true });

  const stamp = ranges.current.endDate;
  const datedJson = path.join(outDir, `service-impact-compare-${stamp}.json`);
  const latestJson = path.join(outDir, "service-impact-compare-latest.json");
  const datedMd = path.join(outDir, `service-impact-compare-${stamp}.md`);
  const latestMd = path.join(outDir, "service-impact-compare-latest.md");

  fs.writeFileSync(datedJson, JSON.stringify(result, null, 2), "utf8");
  fs.writeFileSync(latestJson, JSON.stringify(result, null, 2), "utf8");
  fs.writeFileSync(datedMd, lines.join("\n"), "utf8");
  fs.writeFileSync(latestMd, lines.join("\n"), "utf8");

  console.log(`SERVICE_COMPARE_OK ${datedJson}`);
  console.log(`SERVICE_COMPARE_OK ${datedMd}`);
  console.log(`SERVICE_COMPARE_OK ${latestJson}`);
  console.log(`SERVICE_COMPARE_OK ${latestMd}`);
}

main().catch((error) => {
  console.error("SERVICE_COMPARE_FAIL", error?.message || error);
  process.exit(1);
});
