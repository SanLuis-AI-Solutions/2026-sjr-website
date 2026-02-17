import { expect, test } from "@playwright/test";
import type { ConsoleMessage, Page } from "@playwright/test";

function attachConsoleGuards(page: Page) {
  const errors: string[] = [];

  page.on("pageerror", (err: Error) => {
    const msg = err?.message || String(err);
    const stack = err?.stack ? String(err.stack) : "";
    const url = typeof page?.url === "function" ? page.url() : "";
    errors.push(
      [
        `pageerror: ${msg}`,
        url ? `url: ${url}` : null,
        stack && !stack.includes(msg) ? `stack: ${stack}` : stack ? `stack: ${stack}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    );
  });

  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type?.() === "error") errors.push(`console.error: ${msg.text?.() || ""}`);
  });

  return {
    assertNoErrors: (context?: string) => {
      const prefix = context ? `${context}\n` : "";
      expect(errors, prefix + errors.join("\n")).toEqual([]);
      errors.length = 0;
    },
  };
}

async function assertHomeRenders(page: Page) {
  await expect(
    page.getByRole("heading", { name: /Your jewelry never leaves our hands/i })
  ).toBeVisible();

  // Ensure reveal-on-scroll content becomes visible after scrolling.
  const servicesHeading = page.getByRole("heading", { name: /Expert Repair Services/i });
  await servicesHeading.scrollIntoViewIfNeeded();
  await expect(servicesHeading).toBeVisible();
}

test("mobile smoke: repeated nav to Home is stable", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  const routes = ["/services", "/quote", "/services/watch-repair", "/contact"];

  // The reported issue: Home sometimes fails to render correctly after coming from another page.
  // We stress client-side nav back to Home multiple times, and assert reveal-on-scroll sections show.
  for (let i = 0; i < 10; i++) {
    const from = routes[i % routes.length];
    await page.goto(from, { waitUntil: "networkidle" });

    // Client-side nav to Home via logo.
    await page.getByRole("link", { name: /Susie’s Jewelry Repair/i }).first().click();
    await assertHomeRenders(page);

    guard.assertNoErrors(`iteration ${i + 1} (from ${from})`);
  }
});

test("mobile nav: menu opens and can reach Services", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { name: /Your jewelry never leaves our hands/i })
  ).toBeVisible();

  await page.getByRole("button", { name: /Toggle Menu/i }).click();
  await expect(page.getByRole("dialog", { name: /Mobile navigation/i })).toBeVisible();

  await page.getByRole("link", { name: /^Services$/ }).click();
  await expect(
    page.getByRole("heading", { name: /A curated menu of in-house repairs/i })
  ).toBeVisible();

  guard.assertNoErrors("mobile nav menu");
});

test("mobile conversion: home CTA reaches quote form", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: /Get Fast Quote/i }).first().click();

  await expect(
    page.getByRole("heading", { name: /Get a transparent starting/i })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Request Quote/i })).toBeVisible();

  guard.assertNoErrors("home -> quote");
});

test("mobile service detail: includes + faqs render", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/jewelry-cleaning", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Jewelry Cleaning/i })).toBeVisible();

  // Includes list should have multiple items (not a single stringified blob).
  const includesItems = page.locator('[data-testid="service-includes"] li');
  await expect(includesItems).toHaveCount(4);

  // FAQs should exist (service-specific now).
  await expect(page.getByRole("heading", { name: /Answers about/i })).toBeVisible();
  await expect(
    page.getByText(/Is ultrasonic cleaning safe for all jewelry/i)
  ).toBeVisible();

  guard.assertNoErrors("service detail: jewelry-cleaning");
});

test("legal pages: privacy + terms exist", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/privacy", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Privacy Policy/i })).toBeVisible();

  await page.goto("/terms", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Terms of Service/i })).toBeVisible();

  guard.assertNoErrors("privacy/terms");
});

test("services hub: featured detail link routes to service detail", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { name: /A curated menu of in-house repairs/i })
  ).toBeVisible();

  // Keep this smoke simple and stable: featured "View details" must route correctly.
  await page.getByRole("link", { name: /View details/i }).first().click();
  await expect(
    page.getByRole("heading", { level: 1, name: /Watch Repair/i })
  ).toBeVisible();

  // Watch page sections below the hero use reveal-on-scroll; scroll to trigger the reveal.
  const whatNext = page.getByText(/What happens next/i);
  await whatNext.scrollIntoViewIfNeeded();
  await expect(whatNext).toBeVisible();

  guard.assertNoErrors("services featured link");
});

test("mobile service detail: ring sizing follows flagship section order", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/ring-sizing", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Ring Sizing/i })).toBeVisible();

  await expect(page.getByText(/How it works/i).first()).toBeVisible();
  await expect(page.getByText(/What to expect/i).first()).toBeVisible();
  await expect(page.getByText(/Pricing & timing/i).first()).toBeVisible();
  await expect(page.getByText(/Why customers choose us/i).first()).toBeVisible();
  await expect(page.getByText(/^FAQs$/i).first()).toBeVisible();
  await expect(page.getByText(/Related services/i).first()).toBeVisible();

  await expect(page.getByRole("link", { name: /Get Fast Quote/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Book a Repair/i }).first()).toBeVisible();

  guard.assertNoErrors("service detail: ring-sizing flagship sections");
});
