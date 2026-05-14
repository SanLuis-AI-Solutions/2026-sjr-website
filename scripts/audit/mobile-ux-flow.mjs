import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "@playwright/test";

const DEFAULT_ORIGIN = "https://www.susiesjewelryrepair.com";
const origin = (process.env.MOBILE_UX_AUDIT_ORIGIN || DEFAULT_ORIGIN).replace(/\/$/, "");
const outDir = path.join(process.cwd(), ".health");
const latestJson = path.join(outDir, "mobile-ux-flow-latest.json");
const latestMd = path.join(outDir, "mobile-ux-flow-latest.md");
const manifestPath = path.join(process.cwd(), "Docs", "INDEXING_MANIFEST.json");

const coreRoutes = [
  "/",
  "/services",
  "/blog",
  "/faq",
  "/about",
  "/quote",
  "/book",
];

function readManifestRoutes() {
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.routes)) return [];

  return manifest.routes
    .filter((route) => ["blog", "service-area", "service-detail"].includes(route.category))
    .map((route) => route.path)
    .filter(Boolean);
}

function routesToAudit() {
  return [...new Set([...coreRoutes, ...readManifestRoutes()])];
}

function hasQuote(text, href) {
  return /^\/quote(?:[?#]|$)/.test(href) || /^(get fast quote|start quote|get my quote range)$/i.test(text);
}

function hasBook(text, href) {
  return (
    /^\/book(?:[?#]|$)/.test(href) ||
    href === "#booking-form" ||
    /^(book repair|choose time|request repair visit|request time|request preferred time)$/i.test(text)
  );
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
  if ((await firstSection.count()) === 0) {
    findings.push("Page has no main section for above-fold mobile action audit.");
  }
  const heroScope = (await firstSection.count()) > 0 ? firstSection : page.locator("main").first();
  await heroScope.waitFor({ state: "visible", timeout: 10000 });
  await heroScope.scrollIntoViewIfNeeded();

  const heroActions = await heroScope.locator("a:visible, button:visible").evaluateAll((nodes) =>
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

  if (heroActions.length > 6) {
    findings.push(`Hero exposes ${heroActions.length} visible actions on mobile; keep above-fold choices focused.`);
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

  const mobileDisclosures = await page.locator("[data-mobile-sidebar-section]").evaluateAll((nodes) =>
    nodes.map((node) => {
      const details = node;
      const summary = details.querySelector("summary");
      const rect = summary?.getBoundingClientRect();
      const style = summary ? window.getComputedStyle(summary) : null;
      return {
        open: details.hasAttribute("open"),
        label: (summary?.textContent || "").trim().replace(/\s+/g, " "),
        height: rect ? Math.round(rect.height) : 0,
        visible:
          Boolean(rect) &&
          rect.width > 0 &&
          rect.height > 0 &&
          style?.display !== "none" &&
          style?.visibility !== "hidden",
      };
    })
  );

  const openDisclosures = mobileDisclosures.filter((item) => item.visible && item.open);
  if (openDisclosures.length > 0) {
    findings.push(
      `Mobile sidebar disclosures are expanded by default: ${openDisclosures
        .map((item) => item.label)
        .join(", ")}.`
    );
  }

  const smallDisclosures = mobileDisclosures.filter((item) => item.visible && item.height > 0 && item.height < 44);
  if (smallDisclosures.length > 0) {
    findings.push(
      `Mobile disclosure tap targets under 44px: ${smallDisclosures
        .map((item) => `${item.label} (${item.height}px)`)
        .join(", ")}.`
    );
  }

  const mobileCrawlHubActions = await page.locator("[data-mobile-crawl-hub]").evaluateAll((nodes) =>
    nodes.flatMap((node) =>
      Array.from(node.querySelectorAll("a, button")).flatMap((action) => {
        const closedDetails = action.closest("details:not([open])");
        if (closedDetails) return [];
        const rect = action.getBoundingClientRect();
        const style = window.getComputedStyle(action);
        if (rect.width <= 0 || rect.height <= 0 || style.visibility === "hidden" || style.display === "none") {
          return [];
        }
        return [
          {
            text: (action.textContent || action.getAttribute("aria-label") || "").trim().replace(/\s+/g, " "),
            href: action.getAttribute("href") || "",
          },
        ];
      })
    )
  );

  const crawlHubConversionActions = mobileCrawlHubActions.filter((action) =>
    hasQuote(action.text, action.href) || hasBook(action.text, action.href)
  );
  if (crawlHubConversionActions.length > 0) {
    findings.push(
      `Mobile crawl hubs expose conversion CTAs instead of staying informational: ${crawlHubConversionActions
        .map((action) => action.text || action.href)
        .join(", ")}.`
    );
  }

  if (route === "/") {
    const finalSection = page.locator("main section").last();
    const finalSectionSummary = await finalSection.evaluate((node) => {
      const links = Array.from(node.querySelectorAll("a")).filter((link) => {
        const rect = link.getBoundingClientRect();
        const style = window.getComputedStyle(link);
        return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });
      return {
        hasCrawlHub: Boolean(node.querySelector("[data-mobile-crawl-hub]")),
        conversionLinks: links
          .filter((link) => {
            const text = (link.textContent || "").trim().replace(/\s+/g, " ");
            const href = link.getAttribute("href") || "";
            return /^\/quote(?:[?#]|$)/.test(href) || /^\/book(?:[?#]|$)/.test(href) || /quote|book/i.test(text);
          })
          .map((link) => (link.textContent || link.getAttribute("href") || "").trim().replace(/\s+/g, " ")),
      };
    });

    if (finalSectionSummary.hasCrawlHub) {
      findings.push("Homepage ends with a mobile crawl hub; final mobile section should reinforce the conversion path.");
    }

    if (finalSectionSummary.conversionLinks.length === 0) {
      findings.push("Homepage final mobile section has no visible quote or booking action.");
    }
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
  const scrollTargets = await page.evaluate(() => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return [
      900,
      Math.round(window.innerHeight * 1.25),
      Math.round(window.innerHeight * 1.75),
      Math.round(maxScroll * 0.5),
      maxScroll,
    ].filter((value, index, values) => value > 0 && values.indexOf(value) === index);
  });

  let revealed = false;
  for (const target of scrollTargets) {
    await page.evaluate((scrollY) => {
      window.scrollTo(0, scrollY);
      window.dispatchEvent(new Event("scroll"));
    }, target);
    await page.waitForTimeout(500);
    if (await sticky.isVisible().catch(() => false)) {
      revealed = true;
      break;
    }
  }

  const metrics = revealed
    ? await sticky.locator("a").evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            text: (node.textContent || node.getAttribute("aria-label") || "").trim().replace(/\s+/g, " "),
            href: node.getAttribute("href") || "",
            height: Math.round(rect.height),
            width: Math.round(rect.width),
          };
        })
      )
    : [];

  if (initiallyVisible) findings.push("Sticky CTA is visible before scroll.");
  if (!revealed) findings.push("Sticky CTA did not become visible after scroll.");
  if (metrics.length !== 1) findings.push(`Sticky CTA has ${metrics.length} visible links instead of 1.`);
  const [cta] = metrics;
  if (cta) {
    if (cta.height > 48) findings.push(`Sticky CTA is taller than compact target: ${cta.height}px.`);
    if (cta.width > 170) findings.push(`Sticky CTA is wider than compact target: ${cta.width}px.`);
    if (!cta.href.includes("cta_source=mobile_sticky_cta")) {
      findings.push("Sticky CTA does not preserve mobile CTA attribution.");
    }
  }

  await page.close();
  return { metrics, findings };
}

async function auditMobileHeader(context) {
  const page = await context.newPage();
  const findings = [];

  await page.goto(`${origin}/`, { waitUntil: "networkidle", timeout: 60000 });

  const metrics = await page.getByRole("banner").evaluate((node) => {
    const header = node;
    const headerRect = header.getBoundingClientRect();
    const visibleText = header.innerText.trim().replace(/\s+/g, " ");
    const targets = Array.from(header.querySelectorAll("a, button")).flatMap((target) => {
      const rect = target.getBoundingClientRect();
      const style = window.getComputedStyle(target);
      if (rect.width <= 0 || rect.height <= 0 || style.visibility === "hidden" || style.display === "none") {
        return [];
      }

      return [
        {
          text: (target.innerText || target.getAttribute("aria-label") || "").trim().replace(/\s+/g, " "),
          height: Math.round(rect.height),
          width: Math.round(rect.width),
        },
      ];
    });

    return {
      height: Math.round(headerRect.height),
      visibleText,
      targets,
    };
  });

  if (metrics.height > 96) {
    findings.push(`Mobile header is taller than the compact chrome budget: ${metrics.height}px.`);
  }

  if (/Master Craftsmanship/i.test(metrics.visibleText)) {
    findings.push("Mobile header exposes the long brand subtitle instead of compact brand copy.");
  }

  const smallTargets = metrics.targets.filter((target) => target.height < 44);
  if (smallTargets.length > 0) {
    findings.push(
      `Mobile header tap targets under 44px: ${smallTargets
        .map((target) => `${target.text || "unlabeled"} (${target.height}px)`)
        .join(", ")}.`
    );
  }

  await page.close();
  return { metrics, findings };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });

  const header = await auditMobileHeader(context);
  const routes = routesToAudit();
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
    ...header.findings.map((finding) => ({ route: "/", finding })),
    ...sticky.findings.map((finding) => ({ route: "/", finding })),
  ];

  const payload = {
    generatedAt: new Date().toISOString(),
    origin,
    status: failures.length === 0 ? "pass" : "fail",
    failures,
    header,
    sticky,
    routes: routeResults,
  };

  fs.writeFileSync(latestJson, `${JSON.stringify(payload, null, 2)}\n`);

  const md = [
    "# Mobile UX Flow Audit",
    "",
    `- Generated: ${payload.generatedAt}`,
    `- Origin: ${origin}`,
    `- Routes checked: ${routeResults.length}`,
    `- Status: ${payload.status.toUpperCase()}`,
    "",
    "## Guardrails",
    "",
    "- Mobile hero sections must not show quote and booking as equal visible choices.",
    "- Mobile hero sections should expose no more than 6 visible actions above the fold.",
    "- Hero tap targets must be at least 44px tall.",
    "- The persistent mobile header must stay compact and keep visible tap targets at least 44px tall.",
    "- The mobile sticky CTA must remain one compact attributed quote action.",
    "- Footer crawl groups must remain collapsed by default on mobile.",
    "- Mobile crawl hubs must not expose visible quote/book CTAs.",
    "- The homepage must end with a conversion section, not a crawl/link hub.",
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
    "## Mobile Header",
    "",
    table(
      ["Metric", "Value"],
      [
        ["Height", `${header.metrics.height}px`],
        ["Visible text", header.metrics.visibleText],
        [
          "Visible targets",
          header.metrics.targets.map((target) => `${target.text || "unlabeled"} (${target.height}px)`).join("<br>"),
        ],
        ["Findings", header.findings.length ? header.findings.join("<br>") : "Pass"],
      ]
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
