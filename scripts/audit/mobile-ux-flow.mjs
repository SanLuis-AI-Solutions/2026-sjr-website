import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "@playwright/test";

const DEFAULT_ORIGIN = "https://www.susiesjewelryrepair.com";
const origin = (process.env.MOBILE_UX_AUDIT_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, "");
const outDir = path.join(process.cwd(), ".health");
const latestJson = path.join(outDir, "mobile-ux-flow-latest.json");
const latestMd = path.join(outDir, "mobile-ux-flow-latest.md");

const routes = [
  "/",
  "/services",
  "/services/ring-sizing",
  "/services/watch-repair",
  "/services/pearl-restringing",
  "/services/pasadena",
  "/blog",
  "/blog/cost-to-resize-gold-ring-pasadena",
  "/faq",
  "/about",
  "/quote",
  "/book",
];

function hasQuote(text, href) {
  return /^\/quote(?:[?#]|$)/.test(href) || /^(get fast quote|start quote|get my quote range)$/i.test(text);
}

function hasBook(text, href) {
  return /^\/book(?:[?#]|$)/.test(href) || /^(book repair|request time|request preferred time)$/i.test(text);
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

async function auditRoute(context, route) {
  const page = await context.newPage();
  const url = `${origin}${route}`;
  const findings = [];

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

  const firstSection = page.locator("main section").first();
  await firstSection.scrollIntoViewIfNeeded();

  const heroActions = await firstSection.locator("a:visible, button:visible").evaluateAll((nodes) =>
    nodes.map((node) => {
      const element = node;
      const rect = element.getBoundingClientRect();
      const text = (element.textContent || element.getAttribute("aria-label") || "")
        .trim()
        .replace(/\s+/g, " ");
      return {
        text,
        href: element.getAttribute("href") || "",
        className: element.getAttribute("class") || "",
        tagName: element.tagName.toLowerCase(),
        height: Math.round(rect.height),
        width: Math.round(rect.width),
      };
    })
  );

  const quoteActions = heroActions.filter((action) => hasQuote(action.text, action.href));
  const bookActions = heroActions.filter((action) => hasBook(action.text, action.href));
  const smallTargets = heroActions.filter((action) => {
    const isIntentionalControl =
      action.tagName === "button" ||
      action.tagName === "summary" ||
      /micro-interaction|rounded|button|px-\d|py-\d|min-h/i.test(action.className);
    return isIntentionalControl && action.height > 0 && action.height < 44;
  });

  if (quoteActions.length > 0 && bookActions.length > 0) {
    findings.push("Hero shows quote and booking actions as competing visible mobile choices.");
  }

  if (smallTargets.length > 0) {
    findings.push(
      `Hero has tap targets under 44px: ${smallTargets
        .map((action) => `${action.text || action.href} (${action.height}px)`)
        .join(", ")}.`
    );
  }

  const footer = page.getByRole("contentinfo");
  const footerCollapsed = await footer.evaluate((node) => {
    const links = Array.from(node.querySelectorAll("a"));
    const visibleLinks = links.filter((link) => {
      const closedDetails = link.closest("details:not([open])");
      if (closedDetails) return false;
      const rect = link.getBoundingClientRect();
      const style = window.getComputedStyle(link);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    });
    return {
      visibleLinkCount: visibleLinks.length,
      serviceLinkVisible: visibleLinks.some((link) =>
        /Watch Repair|Ring Sizing|Pearl Restringing/i.test(link.textContent || "")
      ),
      guideLinkVisible: visibleLinks.some((link) =>
        /Watch Battery or Repair|Gold Ring|Stone Security/i.test(link.textContent || "")
      ),
    };
  });

  if (footerCollapsed.serviceLinkVisible || footerCollapsed.guideLinkVisible) {
    findings.push("Footer crawl link groups are expanded by default on mobile.");
  }

  await page.close();

  return {
    route,
    url,
    heroActionCount: heroActions.length,
    quoteHeroActions: quoteActions.map((action) => action.text || action.href),
    bookHeroActions: bookActions.map((action) => action.text || action.href),
    footerVisibleLinkCount: footerCollapsed.visibleLinkCount,
    findings,
  };
}

async function auditStickyShortcut(context) {
  const page = await context.newPage();
  const findings = [];
  await page.goto(`${origin}/`, { waitUntil: "networkidle", timeout: 60000 });

  const sticky = page.getByRole("region", { name: /^Mobile quote shortcut$/i });
  const initiallyVisible = await sticky.isVisible().catch(() => false);
  await page.evaluate(() => window.scrollTo(0, 900));
  await sticky.waitFor({ state: "visible", timeout: 10000 });
  const metrics = await sticky.locator("a").evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        text: (node.textContent || node.getAttribute("aria-label") || "").trim().replace(/\s+/g, " "),
        href: node.getAttribute("href") || "",
        height: Math.round(rect.height),
        width: Math.round(rect.width),
      };
    })
  );

  if (initiallyVisible) findings.push("Sticky CTA is visible before scroll.");
  if (metrics.length !== 1) findings.push(`Sticky CTA has ${metrics.length} visible links instead of 1.`);
  const [cta] = metrics;
  if (cta) {
    if (cta.height > 48) findings.push(`Sticky CTA is taller than compact target: ${cta.height}px.`);
    if (cta.width > 170) findings.push(`Sticky CTA is wider than compact target: ${cta.width}px.`);
    if (!cta.href.includes("utm_source=mobile_sticky_cta")) {
      findings.push("Sticky CTA does not preserve mobile attribution.");
    }
  }

  await page.close();
  return { metrics, findings };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });

  const routeResults = [];
  for (const route of routes) {
    routeResults.push(await auditRoute(context, route));
  }
  const sticky = await auditStickyShortcut(context);
  await browser.close();

  const failures = [
    ...routeResults.flatMap((result) =>
      result.findings.map((finding) => ({ route: result.route, finding }))
    ),
    ...sticky.findings.map((finding) => ({ route: "/", finding })),
  ];

  const payload = {
    generatedAt: new Date().toISOString(),
    origin,
    status: failures.length === 0 ? "pass" : "fail",
    failures,
    sticky,
    routes: routeResults,
  };

  fs.writeFileSync(latestJson, `${JSON.stringify(payload, null, 2)}\n`);

  const md = [
    "# Mobile UX Flow Audit",
    "",
    `- Generated: ${payload.generatedAt}`,
    `- Origin: ${origin}`,
    `- Status: ${payload.status.toUpperCase()}`,
    "",
    "## Guardrails",
    "",
    "- Mobile hero sections must not show quote and booking as equal visible choices.",
    "- Hero tap targets must be at least 44px tall.",
    "- The mobile sticky CTA must remain one compact attributed quote action.",
    "- Footer crawl groups must remain collapsed by default on mobile.",
    "",
    "## Route Summary",
    "",
    table(
      ["Route", "Hero actions", "Quote actions", "Book actions", "Footer links", "Findings"],
      routeResults.map((result) => [
        result.route,
        String(result.heroActionCount),
        result.quoteHeroActions.length ? result.quoteHeroActions.join("<br>") : "-",
        result.bookHeroActions.length ? result.bookHeroActions.join("<br>") : "-",
        String(result.footerVisibleLinkCount),
        result.findings.length ? result.findings.join("<br>") : "Pass",
      ])
    ),
    "",
    "## Sticky CTA",
    "",
    table(
      ["Metric", "Value"],
      [
        ["Visible links", String(sticky.metrics.length)],
        ["Label", sticky.metrics[0]?.text || "-"],
        ["Height", sticky.metrics[0] ? `${sticky.metrics[0].height}px` : "-"],
        ["Width", sticky.metrics[0] ? `${sticky.metrics[0].width}px` : "-"],
        ["Findings", sticky.findings.length ? sticky.findings.join("<br>") : "Pass"],
      ]
    ),
    "",
  ].join("\n");

  fs.writeFileSync(latestMd, md);

  if (failures.length > 0) {
    console.error(md);
    process.exit(1);
  }

  console.log(`Mobile UX flow audit passed: ${latestMd}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
