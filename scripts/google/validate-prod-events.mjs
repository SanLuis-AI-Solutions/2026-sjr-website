import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE_URL =
  process.env.SJR_PROD_URL || "https://sjr-new-website-aiproject.vercel.app";
const STORAGE_KEY = "__codex_ga_events__";

const REQUIRED_EVENTS = [
  "service_card_click",
  "services_hub_cta_click",
  "service_section_view",
  "service_decision_expand",
  "service_market_expand",
  "service_faq_open",
  "service_cta_click",
  "conversion_quick_action_click",
  "conversion_quick_action_click_control",
  "conversion_quick_action_click_primary_focus",
  "lead_form_start",
  "lead_form_step",
  "quote_submit_success",
  "booking_submit_success",
  "contact_submit_success",
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

async function countEvent(page, eventName) {
  const events = await readCapturedEvents(page);
  return countByName(events, eventName);
}

async function goto(page, urlPath) {
  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: "networkidle" });
  await pause(900);
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
  const browser = await chromium.launch({ headless: true });
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
    },
    { key: STORAGE_KEY }
  );

  const page = await context.newPage();
  const report = [];

  try {
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
        await cta.scrollIntoViewIfNeeded();
        await cta.click();
        await page.waitForLoadState("networkidle");
      },
      report
    );

    await goto(page, "/services/ring-sizing");
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
        await summary.scrollIntoViewIfNeeded();
        await summary.click();
        await pause(500);
      },
      report
    );

    await runEventCheck(
      page,
      "service_market_expand",
      async () => {
        const summary = page.locator('[data-track-event="service_market_expand"] summary').first();
        await summary.scrollIntoViewIfNeeded();
        await summary.click();
        await pause(500);
      },
      report
    );

    await runEventCheck(
      page,
      "service_faq_open",
      async () => {
        const summary = page.locator('[data-service-faq-question] summary').first();
        await summary.scrollIntoViewIfNeeded();
        await summary.click();
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
        await cta.scrollIntoViewIfNeeded();
        await cta.click();
        await page.waitForLoadState("networkidle");
      },
      report
    );

    await goto(page, "/quote");
    await runEventCheck(
      page,
      "lead_form_start",
      async () => {
        await page.locator("#quote-form input[name='name']").click();
        await pause(300);
      },
      report
    );

    await runEventCheck(
      page,
      "lead_form_step",
      async () => {
        await page.locator("#quote-form input[name='email']").click();
        await pause(300);
      },
      report
    );

    await goto(page, "/book");
    await runEventCheck(
      page,
      "conversion_quick_action_click",
      async () => {
        const quickAction = page
          .getByRole("region", { name: /^quick actions$/i })
          .getByRole("link", { name: /^Contact Us$/i });
        await quickAction.scrollIntoViewIfNeeded();
        await quickAction.click();
        await page.waitForLoadState("networkidle");
      },
      report
    );

    await goto(page, "/contact");
    await runAnyEventCheck(
      page,
      ["conversion_quick_action_click_control", "conversion_quick_action_click_primary_focus"],
      async () => {
        const quickAction = page
          .getByRole("region", { name: /^quick actions$/i })
          .getByRole("link", { name: /^Get Fast Quote$/i });
        await quickAction.scrollIntoViewIfNeeded();
        await quickAction.click();
        await page.waitForLoadState("networkidle");
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
    const aggregate = Object.fromEntries(
      REQUIRED_EVENTS.map((eventName) => [eventName, countByName(captured, eventName)])
    );

    const now = new Date();
    const stamp = isoForFile(now);
    const outDir = path.join(process.cwd(), ".health");
    fs.mkdirSync(outDir, { recursive: true });

    const markdown = [
      "# GA4 Production Event Validation",
      "",
      `- Generated: ${now.toISOString()}`,
      `- Base URL: ${BASE_URL}`,
      "",
      "## Check Results",
      "| Event | Status | Before | After |",
      "| --- | --- | --- | --- |",
      ...report.map(
        (row) =>
          `| ${row.eventName} | ${row.status} | ${row.beforeCount} | ${row.afterCount} |`
      ),
      "",
      "## Aggregate Counts (Captured in Session)",
      "| Event | Count |",
      "| --- | --- |",
      ...REQUIRED_EVENTS.map((eventName) => `| ${eventName} | ${aggregate[eventName]} |`),
      "",
      `- Total captured GA events in session: ${captured.length}`,
      "",
    ].join("\n");

    const jsonPayload = {
      generatedAt: now.toISOString(),
      baseUrl: BASE_URL,
      checks: report,
      aggregate,
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

    const failed = report.filter((row) => row.status !== "PASS");
    if (failed.length > 0) {
      console.error(
        `EVENT_VALIDATION_FAIL missing=${failed.map((item) => item.eventName).join(",")}`
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
