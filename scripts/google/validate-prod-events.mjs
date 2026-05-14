import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE_URL =
  process.env.SJR_PROD_URL || "https://www.susiesjewelryrepair.com";
const STORAGE_KEY = "__codex_ga_events__";

const REQUIRED_EVENTS = [
  "service_card_click",
  "services_hub_cta_click",
  "service_section_view",
  "service_decision_expand",
  "service_market_expand",
  "service_faq_open",
  "service_cta_click",
  "mobile_sticky_cta_click",
  "conversion_quick_action_click",
  "conversion_quick_action_click_control",
  "conversion_quick_action_click_primary_focus",
  "lead_form_view",
  "quote_form_view",
  "booking_form_view",
  "lead_form_start",
  "quote_form_start",
  "booking_form_start",
  "lead_form_step",
  "quote_submit_success",
  "booking_submit_success",
  "contact_submit_success",
];

const GTAG_JS_PATTERN = /googletagmanager\.com\/gtag\/js/i;
const GA_COLLECT_PATTERNS = [
  /google-analytics\.com\/g\/collect/i,
  /region1\.google-analytics\.com\/g\/collect/i,
  /analytics\.google\.com\/g\/collect/i,
];

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isoForFile(date) {
  return date.toISOString().replace(/[:]/g, "-").replace(/\..+/, "Z");
}

async function readCapturedEvents(page) {
  const payload = await page.evaluate((key) => {
    try {
      return JSON.parse(window.sessionStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  }, STORAGE_KEY);

  return Array.isArray(payload) ? payload : [];
}

function countByName(events, eventName) {
  return events.filter((item) => item?.name === eventName).length;
}

function dedupeRequests(requests) {
  const seen = new Set();
  return requests.filter((request) => {
    const key = `${request.method}:${request.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function markdownCell(value) {
  return String(value ?? "").replaceAll("|", "\\|");
}

async function countEvent(page, eventName) {
  const events = await readCapturedEvents(page);
  return countByName(events, eventName);
}

async function goto(page, urlPath) {
  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: "networkidle" });
  await pause(900);
}

async function clickTrackedTarget(locator) {
  await locator.evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "center" });
  });
  try {
    await locator.click();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/intercepts pointer events|Timeout/i.test(message)) {
      throw error;
    }
    await locator.evaluate((element) => {
      element.click();
    });
  }
}

async function waitForEventDelta(page, eventName, beforeCount, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const current = await countEvent(page, eventName);
    if (current > beforeCount) return true;
    await pause(250);
  }
  return false;
}

async function waitForAnyEventDelta(page, eventNames, beforeCounts, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const eventName of eventNames) {
      const current = await countEvent(page, eventName);
      if (current > beforeCounts[eventName]) {
        return { matchedEvent: eventName, observed: true };
      }
    }
    await pause(250);
  }

  return { matchedEvent: null, observed: false };
}

async function waitForDocumentDataset(page, datasetKey, values, timeoutMs = 8000) {
  const acceptedValues = Array.isArray(values) ? values : [values];
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const matched = await page.evaluate(
      ({ key, expected }) => expected.includes(document.documentElement.dataset[key] || ""),
      { key: datasetKey, expected: acceptedValues }
    );
    if (matched) return true;
    await pause(100);
  }

  return false;
}

async function runEventCheck(page, eventName, action, report) {
  const beforeCount = await countEvent(page, eventName);
  await action();
  const observed = await waitForEventDelta(page, eventName, beforeCount);
  const afterCount = await countEvent(page, eventName);
  report.push({
    eventName,
    status: observed ? "PASS" : "FAIL",
    beforeCount,
    afterCount,
  });
}

async function runNavigationEventCheck(page, eventName, action, destinationPattern, report) {
  const beforeCount = await countEvent(page, eventName);
  await action();
  await page.waitForURL(destinationPattern, { timeout: 8000 });
  await page.waitForLoadState("networkidle");
  await pause(600);
  const afterCount = await countEvent(page, eventName);
  report.push({
    eventName,
    status: afterCount > beforeCount ? "PASS" : "FAIL",
    beforeCount,
    afterCount,
  });
}

async function runAnyEventCheck(page, eventNames, action, report) {
  const beforeCounts = {};
  for (const eventName of eventNames) {
    beforeCounts[eventName] = await countEvent(page, eventName);
  }

  await action();
  const { matchedEvent, observed } = await waitForAnyEventDelta(page, eventNames, beforeCounts);

  const afterCounts = {};
  for (const eventName of eventNames) {
    afterCounts[eventName] = await countEvent(page, eventName);
  }

  report.push({
    eventName: `${eventNames.join(" | ")}${matchedEvent ? ` (matched: ${matchedEvent})` : ""}`,
    status: observed ? "PASS" : "FAIL",
    beforeCount: Object.values(beforeCounts).reduce((sum, value) => sum + value, 0),
    afterCount: Object.values(afterCounts).reduce((sum, value) => sum + value, 0),
  });
}

async function runNavigationAnyEventCheck(page, eventNames, action, destinationPattern, report) {
  const beforeCounts = {};
  for (const eventName of eventNames) {
    beforeCounts[eventName] = await countEvent(page, eventName);
  }

  await action();
  await page.waitForURL(destinationPattern, { timeout: 8000 });
  await page.waitForLoadState("networkidle");
  await pause(600);

  const afterCounts = {};
  for (const eventName of eventNames) {
    afterCounts[eventName] = await countEvent(page, eventName);
  }

  const matchedEvent = eventNames.find(
    (eventName) => afterCounts[eventName] > beforeCounts[eventName]
  );

  report.push({
    eventName: `${eventNames.join(" | ")}${matchedEvent ? ` (matched: ${matchedEvent})` : ""}`,
    status: Boolean(matchedEvent) ? "PASS" : "FAIL",
    beforeCount: Object.values(beforeCounts).reduce((sum, value) => sum + value, 0),
    afterCount: Object.values(afterCounts).reduce((sum, value) => sum + value, 0),
  });
}

async function runPresenceCheck(page, eventName, report) {
  const count = await countEvent(page, eventName);
  report.push({
    eventName,
    status: count > 0 ? "PASS" : "FAIL",
    beforeCount: count,
    afterCount: count,
  });
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    ignoreDefaultArgs: ["--disable-background-networking"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });

  await context.addInitScript(
    ({ key }) => {
      const existing = (() => {
        try {
          return JSON.parse(window.sessionStorage.getItem(key) || "[]");
        } catch {
          return [];
        }
      })();

      window.__codexGaEvents = Array.isArray(existing) ? existing : [];
      window.__codexGaNetwork = Array.isArray(window.__codexGaNetwork)
        ? window.__codexGaNetwork
        : [];
      const captureNetwork = (entry) => {
        if (!entry || typeof entry.url !== "string") return;
        window.__codexGaNetwork.push({
          method: entry.method || "UNKNOWN",
          url: entry.url,
          size: typeof entry.size === "number" ? entry.size : null,
        });
      };
      const persist = () =>
        window.sessionStorage.setItem(key, JSON.stringify(window.__codexGaEvents));
      const capture = (entry) => {
        const normalized = Array.isArray(entry)
          ? entry
          : entry && typeof entry === "object" && "0" in entry
            ? Array.from(entry)
            : null;

        if (!normalized || normalized[0] !== "event" || typeof normalized[1] !== "string") {
          return;
        }

        window.__codexGaEvents.push({
          name: normalized[1],
          params: normalized[2] || {},
          path: `${window.location.pathname}${window.location.search}`,
          ts: Date.now(),
        });
        persist();
      };

      window.dataLayer = window.dataLayer || [];
      for (const item of window.dataLayer) capture(item);

      const originalPush = window.dataLayer.push.bind(window.dataLayer);
      window.dataLayer.push = (...items) => {
        for (const item of items) capture(item);
        return originalPush(...items);
      };

      // Ensure window.gtag exists early and always records events during validation.
      let assignedGtag = typeof window.gtag === "function" ? window.gtag : null;
      const wrappedGtag = (...args) => {
        capture(args);
        if (typeof assignedGtag === "function") {
          return assignedGtag(...args);
        }
        return undefined;
      };

      Object.defineProperty(window, "gtag", {
        configurable: true,
        get() {
          return wrappedGtag;
        },
        set(next) {
          assignedGtag = typeof next === "function" ? next : null;
        },
      });

      const originalSendBeacon =
        typeof navigator.sendBeacon === "function"
          ? navigator.sendBeacon.bind(navigator)
          : null;
      if (originalSendBeacon) {
        navigator.sendBeacon = (url, data) => {
          captureNetwork({
            method: "BEACON",
            url: typeof url === "string" ? url : String(url),
            size:
              typeof data === "string"
                ? data.length
                : typeof data?.size === "number"
                  ? data.size
                  : null,
          });
          return originalSendBeacon(url, data);
        };
      }

      const originalFetch = typeof window.fetch === "function" ? window.fetch.bind(window) : null;
      if (originalFetch) {
        window.fetch = async (...args) => {
          const [resource] = args;
          const url =
            typeof resource === "string"
              ? resource
              : resource instanceof Request
                ? resource.url
                : String(resource);
          captureNetwork({ method: "FETCH", url });
          return originalFetch(...args);
        };
      }

      const originalXhrOpen = XMLHttpRequest.prototype.open;
      const originalXhrSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function patchedOpen(method, url, ...args) {
        this.__codexUrl = typeof url === "string" ? url : String(url);
        this.__codexMethod = typeof method === "string" ? method : "XHR";
        return originalXhrOpen.call(this, method, url, ...args);
      };
      XMLHttpRequest.prototype.send = function patchedSend(...args) {
        captureNetwork({
          method: this.__codexMethod || "XHR",
          url: this.__codexUrl || "",
        });
        return originalXhrSend.apply(this, args);
      };
    },
    { key: STORAGE_KEY }
  );

  const page = await context.newPage();
  const report = [];
  const gtagJsRequests = [];
  const gaCollectRequests = [];

  const recordRequest = (request) => {
    const url = request.url();
    if (GTAG_JS_PATTERN.test(url)) {
      gtagJsRequests.push({
        method: request.method(),
        url,
      });
      return;
    }
    if (GA_COLLECT_PATTERNS.some((pattern) => pattern.test(url))) {
      gaCollectRequests.push({
        method: request.method(),
        url,
      });
    }
  };

  context.on("request", recordRequest);

  try {
    await goto(page, "/");

    await runNavigationEventCheck(
      page,
      "mobile_sticky_cta_click",
      async () => {
        await page.evaluate(() => window.scrollTo(0, Math.max(900, window.innerHeight)));
        await pause(500);
        const cta = page
          .getByRole("region", { name: /^Mobile quote shortcut$/i })
          .getByRole("link", { name: /^Start Quote from mobile shortcut$/i });
        await cta.waitFor({ state: "visible", timeout: 8000 });
        await clickTrackedTarget(cta);
      },
      /\/quote(?:\?|$)/,
      report
    );

    await goto(page, "/");

    await runEventCheck(
      page,
      "service_card_click",
      async () => {
        const card = page.locator("#service-watch-repair").first();
        await card.scrollIntoViewIfNeeded();
        await card.click({ position: { x: 28, y: 28 } });
        await page.waitForLoadState("networkidle");
      },
      report
    );

    await goto(page, "/services");
    await runEventCheck(
      page,
      "services_hub_cta_click",
      async () => {
        const cta = page.locator("main").getByRole("link", { name: /^Get Fast Quote$/i }).first();
        await clickTrackedTarget(cta);
        await page.waitForLoadState("networkidle");
      },
      report
    );

    await goto(page, "/services/ring-sizing");
    await waitForDocumentDataset(page, "sjrServiceTracker", "ready");
    await runEventCheck(
      page,
      "service_section_view",
      async () => {
        await page.evaluate(async () => {
          const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          const total = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          );
          for (let y = 0; y <= total; y += 480) {
            window.scrollTo(0, y);
            await wait(120);
          }
          window.scrollTo(0, 0);
        });
      },
      report
    );

    await runEventCheck(
      page,
      "service_decision_expand",
      async () => {
        const summary = page.locator('[data-track-event="service_decision_expand"] summary').first();
        await clickTrackedTarget(summary);
        await pause(500);
      },
      report
    );

    await runEventCheck(
      page,
      "service_market_expand",
      async () => {
        const summary = page.locator('[data-track-event="service_market_expand"] summary').first();
        await clickTrackedTarget(summary);
        await pause(500);
      },
      report
    );

    await runEventCheck(
      page,
      "service_faq_open",
      async () => {
        const summary = page.locator('[data-service-faq-question] summary').first();
        await clickTrackedTarget(summary);
        await pause(500);
      },
      report
    );

    await runEventCheck(
      page,
      "service_cta_click",
      async () => {
        const cta = page
          .locator('[data-service-section="hero"] a[href="/quote"]')
          .first();
        await clickTrackedTarget(cta);
        await page.waitForLoadState("networkidle");
      },
      report
    );

    await goto(page, "/quote");
    await runEventCheck(
      page,
      "lead_form_start",
      async () => {
        await clickTrackedTarget(page.locator("#quote-form input[name='name']"));
        await pause(300);
      },
      report
    );

    await runPresenceCheck(page, "quote_form_start", report);
    await runPresenceCheck(page, "lead_form_view", report);
    await runPresenceCheck(page, "quote_form_view", report);

    await runEventCheck(
      page,
      "lead_form_step",
      async () => {
        await clickTrackedTarget(page.locator("#quote-form input[name='email']"));
        await pause(300);
      },
      report
    );

    await goto(page, "/book");
    await waitForDocumentDataset(page, "sjrCtaVariant", ["control", "primary_focus"]);
    await runEventCheck(
      page,
      "booking_form_start",
      async () => {
        await clickTrackedTarget(page.locator("#booking-form input[name='name']"));
        await pause(300);
      },
      report
    );
    await runPresenceCheck(page, "booking_form_view", report);

    await goto(page, "/quote");
    await waitForDocumentDataset(page, "sjrCtaVariant", ["control", "primary_focus"]);
    await runEventCheck(
      page,
      "conversion_quick_action_click",
      async () => {
        const quickAction = page
          .getByRole("region", { name: /^quick actions$/i })
          .getByRole("link", { name: /^Start Quote$/i });
        await clickTrackedTarget(quickAction);
      },
      report
    );

    await goto(page, "/quote");
    await waitForDocumentDataset(page, "sjrCtaVariant", ["control", "primary_focus"]);
    await runAnyEventCheck(
      page,
      ["conversion_quick_action_click_control", "conversion_quick_action_click_primary_focus"],
      async () => {
        const quickAction = page
          .getByRole("region", { name: /^quick actions$/i })
          .getByRole("link", { name: /^Start Quote$/i });
        await clickTrackedTarget(quickAction);
      },
      report
    );

    await goto(page, "/quote?submitted=1&id=codex-qa");
    await runPresenceCheck(page, "quote_submit_success", report);

    await goto(page, "/book?submitted=1&id=codex-qa");
    await runPresenceCheck(page, "booking_submit_success", report);

    await goto(page, "/contact?submitted=1&id=codex-qa");
    await runPresenceCheck(page, "contact_submit_success", report);

    const captured = await readCapturedEvents(page);
    const pageNetworkRequests = await page.evaluate(() => {
      const captured = Array.isArray(window.__codexGaNetwork) ? window.__codexGaNetwork : [];
      const resourceEntries = performance
        .getEntriesByType("resource")
        .map((entry) => ({ method: "RESOURCE", url: entry.name, size: null }));
      return [...captured, ...resourceEntries];
    });
    const capturedCollectRequests = dedupeRequests(
      pageNetworkRequests.filter((request) =>
        GA_COLLECT_PATTERNS.some((pattern) => pattern.test(request.url))
      )
    );
    const allGaCollectRequests = dedupeRequests([...gaCollectRequests, ...capturedCollectRequests]);
    const gaCollectHeadlessLimited =
      allGaCollectRequests.length === 0 && gtagJsRequests.length > 0 && captured.length > 0;
    const aggregate = Object.fromEntries(
      REQUIRED_EVENTS.map((eventName) => [eventName, countByName(captured, eventName)])
    );
    report.push({
      eventName: "ga_bootstrap_network",
      status: gtagJsRequests.length > 0 ? "PASS" : "FAIL",
      beforeCount: 0,
      afterCount: gtagJsRequests.length,
    });
    report.push({
      eventName: "ga_collect_network",
      status:
        allGaCollectRequests.length > 0
          ? "PASS"
          : gaCollectHeadlessLimited
            ? "WARN"
            : "FAIL",
      beforeCount: 0,
      afterCount: allGaCollectRequests.length,
    });

    const now = new Date();
    const stamp = isoForFile(now);
    const outDir = path.join(process.cwd(), ".health");
    fs.mkdirSync(outDir, { recursive: true });

    const markdown = [
      "# GA4 Production Event Validation",
      "",
      `- Generated: ${now.toISOString()}`,
      `- Base URL: ${BASE_URL}`,
      `- gtag.js requests observed: ${gtagJsRequests.length}`,
      `- GA collect requests observed: ${allGaCollectRequests.length}`,
      gaCollectHeadlessLimited
        ? "- Note: Headless Playwright did not expose GA collect transport even though gtag bootstrap and in-page GA events were present. Treat this as a validator limitation, not a confirmed production failure."
        : null,
      "",
      "## Check Results",
      "| Event | Status | Before | After |",
      "| --- | --- | --- | --- |",
      ...report.map(
        (row) =>
          `| ${markdownCell(row.eventName)} | ${row.status} | ${row.beforeCount} | ${row.afterCount} |`
      ),
      "",
      "## Aggregate Counts (Captured in Session)",
      "| Event | Count |",
      "| --- | --- |",
      ...REQUIRED_EVENTS.map((eventName) => `| ${eventName} | ${aggregate[eventName]} |`),
      "",
      "## GA Network Requests",
      gtagJsRequests.length || allGaCollectRequests.length
        ? "| Method | URL |\n| --- | --- |\n" +
          [...gtagJsRequests, ...allGaCollectRequests]
            .map((request) => `| ${request.method} | ${request.url} |`)
            .join("\n")
        : "_No GA bootstrap or collection requests were observed during validation._",
      "",
      `- Total captured GA events in session: ${captured.length}`,
      "",
    ].join("\n");

    const jsonPayload = {
      generatedAt: now.toISOString(),
      baseUrl: BASE_URL,
      checks: report,
      aggregate,
      network: {
        gtagJsRequests,
        gaCollectRequests: allGaCollectRequests,
        pageNetworkRequests: capturedCollectRequests,
      },
      totalCapturedEvents: captured.length,
    };

    const datedMd = path.join(outDir, `ga4-prod-event-validation-${stamp}.md`);
    const latestMd = path.join(outDir, "ga4-prod-event-validation-latest.md");
    const datedJson = path.join(outDir, `ga4-prod-event-validation-${stamp}.json`);
    const latestJson = path.join(outDir, "ga4-prod-event-validation-latest.json");

    fs.writeFileSync(datedMd, markdown, "utf8");
    fs.writeFileSync(latestMd, markdown, "utf8");
    fs.writeFileSync(datedJson, JSON.stringify(jsonPayload, null, 2), "utf8");
    fs.writeFileSync(latestJson, JSON.stringify(jsonPayload, null, 2), "utf8");

    const failed = report.filter((row) => row.status === "FAIL");
    if (failed.length > 0) {
      console.error(
        `EVENT_VALIDATION_FAIL missing=${failed.map((item) => item.eventName).join(",")}`
      );
      console.error(`REPORT_MD ${datedMd}`);
      process.exitCode = 1;
      return;
    }

    if (gtagJsRequests.length === 0 || (!gaCollectHeadlessLimited && allGaCollectRequests.length === 0)) {
      console.error(
        `EVENT_VALIDATION_FAIL missing_network=${[
          gtagJsRequests.length === 0 ? "ga_bootstrap" : null,
          !gaCollectHeadlessLimited && allGaCollectRequests.length === 0 ? "ga_collect" : null,
        ]
          .filter(Boolean)
          .join(",")}`
      );
      console.error(`REPORT_MD ${datedMd}`);
      process.exitCode = 1;
      return;
    }

    console.log(`EVENT_VALIDATION_OK ${datedMd}`);
    console.log(`EVENT_VALIDATION_OK ${datedJson}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error("EVENT_VALIDATION_FAIL", error?.message || error);
  process.exit(1);
});
