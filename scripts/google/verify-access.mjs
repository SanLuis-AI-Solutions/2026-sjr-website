import {
  createGoogleClients,
  getDateRange,
  getEnv,
  loadLocalEnv,
  resolveGa4Targets,
} from "./_lib.mjs";

async function main() {
  const localEnv = loadLocalEnv();
  const { webmasters, analyticsAdmin, analyticsData } = await createGoogleClients(localEnv);
  const { startDate, endDate } = getDateRange(7);

  const sitesResponse = await webmasters.sites.list();
  const sites = sitesResponse.data.siteEntry || [];
  console.log(`GSC_OK properties=${sites.length}`);
  for (const site of sites.slice(0, 10)) {
    console.log(`  - ${site.siteUrl} (${site.permissionLevel || "unknown"})`);
  }

  const configuredSite = getEnv(localEnv, "SEARCH_CONSOLE_PROPERTY");
  if (configuredSite) {
    const gscQuery = await webmasters.searchanalytics.query({
      siteUrl: configuredSite,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 5,
      },
    });
    const rows = gscQuery.data.rows || [];
    console.log(`GSC_QUERY_OK property=${configuredSite} rows=${rows.length}`);
  } else {
    console.log("GSC_QUERY_SKIP SEARCH_CONSOLE_PROPERTY is not set");
  }

  const { accounts, accountId, propertyId, measurementId } =
    await resolveGa4Targets(analyticsAdmin);
  const configuredPropertyId = getEnv(localEnv, "GA4_PROPERTY_ID", propertyId);

  let propertyCount = 0;
  for (const account of accounts) {
    propertyCount += (account.propertySummaries || []).length;
  }
  console.log(`GA4_OK accounts=${accounts.length} properties=${propertyCount}`);

  if (accountId) console.log(`GA4_ACCOUNT_ID=${accountId}`);
  if (configuredPropertyId) console.log(`GA4_PROPERTY_ID=${configuredPropertyId}`);
  if (measurementId) console.log(`NEXT_PUBLIC_GA_MEASUREMENT_ID=${measurementId}`);

  if (!configuredPropertyId) {
    console.log("GA4_REPORT_SKIP No property ID resolved");
    return;
  }

  const ga4Report = await analyticsData.properties.runReport({
    property: `properties/${configuredPropertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      limit: 7,
    },
  });
  const rows = ga4Report.data.rows || [];
  console.log(`GA4_REPORT_OK property=${configuredPropertyId} rows=${rows.length}`);
}

main().catch((error) => {
  console.error("VERIFY_ACCESS_FAIL", error?.message || error);
  process.exit(1);
});
