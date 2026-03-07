export const PRODUCTION_GA_HOSTNAME = "www.susiesjewelryrepair.com";

export function isProductionAnalyticsHost(hostname: string) {
  return (hostname || "").trim().toLowerCase() === PRODUCTION_GA_HOSTNAME;
}
