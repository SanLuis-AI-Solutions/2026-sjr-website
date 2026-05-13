import { expect, test } from "@playwright/test";
import type { ConsoleMessage, Locator, Page } from "@playwright/test";

function isKnownBenignReactHydrationError(message: string) {
  return (
    message.includes("Minified React error #418") &&
    message.includes("args[]=HTML")
  );
}

function attachConsoleGuards(
  page: Page,
  options?: {
    ignoreConsoleErrors?: RegExp[];
  }
) {
  const errors: string[] = [];

  page.on("pageerror", (err: Error) => {
    const msg = err?.message || String(err);
    if (isKnownBenignReactHydrationError(msg)) return;
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
    if (msg.type?.() !== "error") return;
    const text = msg.text?.() || "";
    if (isKnownBenignReactHydrationError(text)) return;
    if (options?.ignoreConsoleErrors?.some((pattern) => pattern.test(text))) return;
    errors.push(`console.error: ${text}`);
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
    page.getByRole("heading", { name: /Beauty restored\. Elegance preserved\./i })
  ).toBeVisible();

  // Ensure reveal-on-scroll content becomes visible after scrolling.
  const servicesHeading = page.getByRole("heading", { name: /Expert Repair Services/i });
  await servicesHeading.scrollIntoViewIfNeeded();
  await expect(servicesHeading).toBeVisible();
}

async function assertNoBrokenImages(page: Page) {
  await page.evaluate(async () => {
    const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const total = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const step = Math.max(320, Math.floor(window.innerHeight * 0.9));
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y);
      await pause(80);
    }
    window.scrollTo(0, 0);
    await pause(80);
  });

  const broken = await page.evaluate(() => {
    return Array.from(document.images)
      .filter((img) => {
        const src = img.currentSrc || img.src || "";
        if (!src) return false;
        // Only fail on true decode/load failures; in-flight lazy images are not broken.
        return img.complete && img.naturalWidth === 0;
      })
      .map((img) => img.currentSrc || img.src || "<unknown>");
  });

  expect(broken, `Broken images detected:\n${broken.join("\n")}`).toEqual([]);
}

async function expectTapTarget(locator: Locator, label: string, minHeight = 44) {
  const metrics = await locator.evaluate((node) => {
    const element = node as HTMLElement;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      rectHeight: rect.height,
      minHeight: Number.parseFloat(style.minHeight || "0") || 0,
      display: style.display,
      alignItems: style.alignItems,
      justifyContent: style.justifyContent,
    };
  });

  expect(
    Math.max(metrics.rectHeight, metrics.minHeight),
    `${label} tap target too small`
  ).toBeGreaterThanOrEqual(minHeight);
  expect(metrics.display, `${label} should render as a block/flex tap target`).toMatch(
    /flex|block/
  );
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
    await page
      .getByRole("banner")
      .getByRole("link", { name: /Susie’s Jewelry Repair/i })
      .click();
    await assertHomeRenders(page);

    guard.assertNoErrors(`iteration ${i + 1} (from ${from})`);
  }
});

test("mobile nav: menu opens and can reach Services", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { name: /Beauty restored\. Elegance preserved\./i })
  ).toBeVisible();

  const banner = page.getByRole("banner");
  await banner.getByRole("button", { name: /Toggle Menu/i }).click();
  const mobileNav = page.getByRole("dialog", { name: /Mobile navigation/i });
  await expect(mobileNav).toBeVisible();

  await mobileNav.getByRole("link", { name: /^Services$/ }).click();
  await expect(
    page.getByRole("heading", { name: /A curated menu of in-house repairs/i })
  ).toBeVisible();

  guard.assertNoErrors("mobile nav menu");
});

test("mobile conversion: home CTA reaches quote form", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("main").getByRole("link", { name: /^Get Fast Quote$/i }).first().click();

  await expect(
    page.getByRole("heading", { name: /Get a transparent starting/i })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Get My Quote Range/i })).toBeVisible();

  guard.assertNoErrors("home -> quote");
});

test("mobile home flow keeps conversion path uncluttered", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });

  await expect(
    page.getByRole("heading", { name: /Beauty restored\. Elegance preserved\./i })
  ).toBeVisible();
  const heroSection = page.locator("main section").first();
  await expect(heroSection.getByRole("link", { name: /^Get Fast Quote$/i })).toBeVisible();
  await expect(heroSection.getByRole("link", { name: /^Book a Repair$/i })).toBeHidden();

  const servicesHeading = page.getByRole("heading", { name: /Expert Repair Services/i });
  await servicesHeading.scrollIntoViewIfNeeded();
  await expect(servicesHeading).toBeVisible();
  await expect(page.locator("#services").getByText(/More repair services/i)).toBeVisible();
  await expect(page.locator('#services a[href="/services/pearl-restringing"]:visible')).toHaveCount(1);
  const servicesHeight = await page.locator("#services").evaluate((node) =>
    Math.round(node.getBoundingClientRect().height),
  );
  expect(servicesHeight).toBeLessThan(1900);

  const localRepairPaths = page.locator("section", { hasText: "Local repair paths" });
  const nearbyCitySummary = localRepairPaths.locator("summary").filter({ hasText: /^Nearby city pages$/ });
  const decisionGuidesSummary = localRepairPaths.locator("summary").filter({ hasText: /^Decision guides$/ });
  await localRepairPaths.scrollIntoViewIfNeeded();
  await expect(nearbyCitySummary).toBeVisible();
  await expect(decisionGuidesSummary).toBeVisible();
  await expect(localRepairPaths.getByRole("link", { name: /Jewelry repair near Pasadena/i }))
    .toBeHidden();
  await nearbyCitySummary.click();
  await expect(localRepairPaths.getByRole("link", { name: /Jewelry repair near Pasadena/i }))
    .toBeVisible();

  const pricingGuides = page.locator("section", { hasText: "Pricing help" });
  const topGuidesSummary = pricingGuides.locator("summary").filter({ hasText: /^Show top repair guides$/ });
  await pricingGuides.scrollIntoViewIfNeeded();
  await expect(pricingGuides.getByRole("heading", { name: /Need price or timing guidance/i }))
    .toBeVisible();
  await expect(pricingGuides.getByRole("link", { name: /^Get Fast Quote$/i })).toBeVisible();
  await expect(topGuidesSummary).toBeVisible();
  await expect(pricingGuides.getByRole("link", { name: /resize a gold ring/i })).toBeHidden();
  await topGuidesSummary.click();
  await expect(pricingGuides.getByRole("link", { name: /resize a gold ring/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore the Showcase/i })).toBeHidden();

  const finalCta = page.locator("section", { hasText: "Start Today" });
  await finalCta.scrollIntoViewIfNeeded();
  await expect(finalCta.getByRole("link", { name: /^Get Fast Quote$/i })).toBeVisible();
  await expect(finalCta.getByRole("link", { name: /^Book a Repair$/i })).toBeHidden();

  guard.assertNoErrors("mobile home flow");
});

test("mobile sticky CTA uses one compact quote action", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.addInitScript(() => {
    const storageKey = "sjr_test_ga_events";
    Object.defineProperty(window, "__sjrGaHostAllowed", {
      configurable: true,
      get: () => true,
      set: () => undefined,
    });
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => {
      const existing = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
      existing.push(args);
      window.sessionStorage.setItem(storageKey, JSON.stringify(existing));
      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      window.dataLayer.push(args);
    };
  });

  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.sessionStorage.removeItem("sjr_test_ga_events"));

  const stickyShortcut = page.getByRole("region", { name: /^Mobile quote shortcut$/i });
  await expect(stickyShortcut).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(stickyShortcut).toBeVisible();
  await expect(stickyShortcut.getByRole("link")).toHaveCount(1);

  const fastQuote = stickyShortcut.getByRole("link", {
    name: /^Get Fast Quote from mobile shortcut$/i,
  });
  await expect(fastQuote).toBeVisible();
  await expect(fastQuote).toHaveAttribute(
    "href",
    "/quote?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=quote_shortcut#quote-form",
  );
  await expectTapTarget(fastQuote, "Mobile sticky quote shortcut");
  await fastQuote.click();
  await expect(page).toHaveURL(
    /\/quote\?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=quote_shortcut#quote-form$/,
  );
  await expect(page.locator("#quote-form")).toBeInViewport();

  const events = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("sjr_test_ga_events") || "[]"),
  );
  expect(
    events.some(
      ([type, eventName, params]: [string, string, Record<string, string>]) =>
        type === "event" &&
        eventName === "mobile_sticky_cta_click" &&
        params.page_path === "/" &&
        params.destination ===
          "/quote?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=quote_shortcut#quote-form" &&
        params.placement === "mobile_sticky_bar" &&
        params.cta_target === "quote",
    ),
  ).toBe(true);
  await expect(page.locator('input[name="attribution_utm_source"]')).toHaveValue(
    "mobile_sticky_cta",
  );
  await expect(page.locator('input[name="attribution_utm_medium"]')).toHaveValue("site_cta");
  await expect(page.locator('input[name="attribution_utm_campaign"]')).toHaveValue(
    "quote_shortcut",
  );
  await expect(page.locator('input[name="attribution_submit_path"]')).toHaveValue(
    "/quote?utm_source=mobile_sticky_cta&utm_medium=site_cta&utm_campaign=quote_shortcut",
  );

  guard.assertNoErrors("mobile sticky shortcut");
});

test("mobile conversion pages: quote and book quick actions are clear", async ({ page }) => {
  const guard = attachConsoleGuards(page);
  const routes = [
    { path: "/quote", heading: /Get a transparent starting/i, altAction: /^Book Repair$/i },
    { path: "/book", heading: /Reserve a free 15/i, altAction: /^Get Fast Quote$/i },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();

    const quickActions = page.getByRole("region", { name: /^Quick actions$/i });
    await expect(quickActions).toBeVisible();

    const contact = quickActions.getByRole("link", { name: /^Contact Us$/i });
    const alt = quickActions.getByRole("link", { name: route.altAction });
    await expect(contact).toBeVisible();
    await expect(alt).toBeVisible();

    await expectTapTarget(contact, `Contact tap target on ${route.path}`);
    await expectTapTarget(alt, `Secondary tap target on ${route.path}`);
  }

  guard.assertNoErrors("quote/book quick actions");
});

test("mobile quote form keeps required fields before optional phone", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/quote#quote-form", { waitUntil: "networkidle" });

  const fieldPositions = await page.locator("#quote-form").evaluate((form) => {
    const topFor = (name: string) => {
      const field = form.querySelector(`[name="${name}"]`);
      return field ? Math.round(field.getBoundingClientRect().top) : null;
    };

    return {
      name: topFor("name"),
      email: topFor("email"),
      details: topFor("details"),
      phone: topFor("phone"),
    };
  });

  expect(fieldPositions.name).toBeLessThan(fieldPositions.email ?? Infinity);
  expect(fieldPositions.email).toBeLessThan(fieldPositions.details ?? Infinity);
  expect(fieldPositions.details).toBeLessThan(fieldPositions.phone ?? Infinity);
  await expect(page.getByLabel(/What needs repair/i)).toBeVisible();
  await expect(page.getByLabel(/Phone \(optional\)/i)).toBeVisible();

  guard.assertNoErrors("quote form required field order");
});

test("mobile service detail: what-to-expect content + faqs render", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/jewelry-cleaning", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Jewelry Cleaning/i })).toBeVisible();
  const serviceBreadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
  await expect(serviceBreadcrumb).toBeVisible();
  await expect(serviceBreadcrumb.getByRole("link", { name: /^Services$/i })).toBeVisible();

  // The flagship structure should render scoped expectation cards with bullet points.
  await expect(page.getByText(/What to expect/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: /Service scope/i })).toBeVisible();
  const expectBullets = page.locator("section").filter({ hasText: "What to expect" }).locator("li");
  await expect(expectBullets.first()).toBeVisible();

  // FAQs should exist (service-specific now).
  await expect(page.getByRole("heading", { name: /Answers about/i })).toBeVisible();
  await expect(
    page.getByText(/Is ultrasonic cleaning safe for all jewelry/i)
  ).toBeVisible();

  guard.assertNoErrors("service detail: jewelry-cleaning");
});

test("mobile service and article pages keep quote CTA dominant", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/watch-repair", { waitUntil: "networkidle" });
  const serviceHero = page.locator('[data-service-section="hero"]');
  await expect(serviceHero.getByRole("heading", { level: 1, name: /Watch Repair/i }))
    .toBeVisible();
  await expect(serviceHero.getByRole("link", { name: /^Get Fast Quote$/i })).toBeVisible();
  await expect(serviceHero.getByRole("link", { name: /^Book Repair$/i })).toBeHidden();

  await page.goto("/blog/professional-cleaning-vs-home-care", { waitUntil: "networkidle" });
  const firstDecisionBlock = page.locator("section").filter({ hasText: "Need a repair estimate?" }).first();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Home Jewelry Cleaning: When to Stop and Get an Inspection/i,
    }),
  ).toBeVisible();
  await expect(firstDecisionBlock.getByRole("link", { name: /^Get Fast Quote$/i })).toBeVisible();
  await expect(firstDecisionBlock.getByRole("link", { name: /^Book Repair$/i })).toBeHidden();

  guard.assertNoErrors("mobile quote-first cta hierarchy");
});

test("mobile non-conversion pages avoid competing hero quote and booking CTAs", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);
  const routes = [
    { path: "/blog", heading: /Repair tips and local guidance/i },
    { path: "/about", heading: /Family craftsmanship/i },
    { path: "/faq", heading: /Answers before you hand over/i },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();

    const heroSection = page.locator("main section").first();
    await expect(heroSection.getByRole("link", { name: /^Get Fast Quote$/i })).toBeVisible();
    await expect(heroSection.getByRole("link", { name: /^Book Repair$/i })).toBeHidden();
  }

  guard.assertNoErrors("mobile non-conversion quote-first pages");
});

test("legal pages: privacy + terms exist", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/privacy", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Privacy Policy/i })).toBeVisible();

  await page.goto("/terms", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Terms of Service/i })).toBeVisible();

  guard.assertNoErrors("privacy/terms");
});

test("custom 404 page routes visitors back to key actions", async ({ page }) => {
  const guard = attachConsoleGuards(page, {
    ignoreConsoleErrors: [/Failed to load resource: the server responded with a status of 404/i],
  });

  const response = await page.goto("/missing-page-for-smoke", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(404);

  await expect(
    page.getByRole("heading", { level: 1, name: /That page is not here anymore/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /^Get Fast Quote$/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Contact Us$/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /^Watch Repair$/i })).toBeVisible();

  guard.assertNoErrors("custom 404 page");
});

test("admin routes: protected nexus and inbox redirect unauthenticated users to login", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/admin/nexus", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { level: 1, name: /Secure login/i })).toBeVisible();

  await page.goto("/admin/inbox?tab=quotes&status=spam", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { level: 1, name: /Secure login/i })).toBeVisible();

  guard.assertNoErrors("admin auth redirect");
});

test("home schema: local business hours and external entity links are valid", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });

  const localBusinessSchema = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const script of scripts) {
      try {
        const parsed = JSON.parse(script.textContent || "");
        if (parsed?.["@type"] === "JewelryStore" || parsed?.["@type"] === "LocalBusiness") {
          return parsed;
        }
      } catch {
        // Ignore non-JSON payloads in unrelated scripts.
      }
    }
    return null;
  });

  expect(localBusinessSchema).not.toBeNull();
  expect(Array.isArray(localBusinessSchema.sameAs)).toBe(true);
  expect(localBusinessSchema.sameAs).toEqual(
    expect.arrayContaining([
      expect.stringContaining("google.com/maps/place/"),
      expect.stringContaining("yelp.com/biz/"),
      expect.stringContaining("facebook.com/"),
    ])
  );
  expect(localBusinessSchema.hasMap).toContain("google.com/maps/place/");
  expect(localBusinessSchema.aggregateRating).toBeUndefined();
  expect(localBusinessSchema.review).toBeUndefined();

  const sundayHours = Array.isArray(localBusinessSchema.openingHoursSpecification)
    ? localBusinessSchema.openingHoursSpecification.find(
        (entry: { dayOfWeek?: string }) => entry.dayOfWeek === "Sunday"
      )
    : undefined;

  expect(sundayHours).toBeUndefined();

  guard.assertNoErrors("home schema");
});

test("analytics guard: localhost does not load the production GA script", async ({ page }) => {
  const guard = attachConsoleGuards(page);
  const gaRequests: string[] = [];

  page.on("request", (request) => {
    if (request.url().includes("googletagmanager.com/gtag/js")) {
      gaRequests.push(request.url());
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });
  await page.mouse.click(24, 24);
  await page.keyboard.press("Tab");
  await page.waitForTimeout(300);

  const hostAllowed = await page.evaluate(() =>
    typeof window.__sjrGaHostAllowed === "boolean" ? window.__sjrGaHostAllowed : null
  );
  expect(hostAllowed === false || hostAllowed === null).toBe(true);
  expect(gaRequests).toEqual([]);

  guard.assertNoErrors("localhost analytics guard");
});

test("analytics: services finder lead context reaches CTA, form start, and conversion", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.addInitScript(() => {
    const storageKey = "sjr_test_ga_events";
    Object.defineProperty(window, "__sjrGaHostAllowed", {
      configurable: true,
      get: () => true,
      set: () => undefined,
    });
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => {
      const existing = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
      existing.push(args);
      window.sessionStorage.setItem(storageKey, JSON.stringify(existing));
      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      window.dataLayer.push(args);
    };
  });

  await page.goto("/services", { waitUntil: "networkidle" });
  await page.evaluate(() => window.sessionStorage.removeItem("sjr_test_ga_events"));

  const finder = page.getByTestId("services-finder-region");
  await finder.getByLabel(/Describe the repair you need/i).fill("watch battery");
  await finder.getByRole("link", { name: /Use this for a quote/i }).click();
  await expect(page).toHaveURL(
    /\/quote\?from=services_finder&service=watch-repair&query=watch\+battery$/,
  );
  await page.getByLabel(/Full name/i).focus();

  let events = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("sjr_test_ga_events") || "[]"),
  );
  expect(
    events.some(
      ([type, eventName, params]: [string, string, Record<string, string>]) =>
        type === "event" &&
        eventName === "lead_form_start" &&
        params.prefill_source === "services_finder" &&
        params.service_slug === "watch-repair" &&
        params.finder_query === "watch battery",
    ),
  ).toBe(true);

  await page.goto(
    "/quote?submitted=1&id=smoke-context-quote&from=services_finder&service=watch-repair&query=watch%20battery",
    { waitUntil: "networkidle" },
  );
  events = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("sjr_test_ga_events") || "[]"),
  );
  expect(
    events.some(
      ([type, eventName, params]: [string, string, Record<string, string>]) =>
        type === "event" &&
        eventName === "quote_submit_success" &&
        params.prefill_source === "services_finder" &&
        params.service_slug === "watch-repair" &&
        params.finder_query === "watch battery",
    ),
  ).toBe(true);

  guard.assertNoErrors("services finder analytics context");
});

test("analytics: contact business-action links emit generic lead events", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.addInitScript(() => {
    const storageKey = "sjr_test_ga_events";
    Object.defineProperty(window, "__sjrGaHostAllowed", {
      configurable: true,
      get: () => true,
      set: () => undefined,
    });
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => {
      const existing = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
      existing.push(args);
      window.sessionStorage.setItem(storageKey, JSON.stringify(existing));
      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      window.dataLayer.push(args);
    };
  });

  await page.goto("/contact", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    for (const selector of ['a[href^="tel:"]', 'a[href^="mailto:"]', 'a[href*="maps.app.goo.gl"]']) {
      document.querySelectorAll<HTMLAnchorElement>(selector).forEach((anchor) => {
        anchor.addEventListener("click", (event) => event.preventDefault(), {
          capture: true,
        });
      });
    }
    window.sessionStorage.removeItem("sjr_test_ga_events");
  });

  await page.getByRole("link", { name: /Call now/i }).first().click();
  await page
    .getByRole("link", { name: /contact@susiesjewelryrepair\.com/i })
    .first()
    .click();
  await page.getByRole("link", { name: /^Open in Google Maps$/i }).first().click();

  const events = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("sjr_test_ga_events") || "[]"),
  );

  expect(
    events.some(
      ([type, eventName, params]: [string, string, Record<string, string>]) =>
        type === "event" &&
        eventName === "phone_call_click" &&
        params.placement === "contact_hero",
    ),
  ).toBe(true);
  expect(
    events.some(
      ([type, eventName, params]: [string, string, Record<string, string>]) =>
        type === "event" &&
        eventName === "email_contact_click" &&
        params.placement === "contact_direct_panel",
    ),
  ).toBe(true);
  expect(
    events.some(
      ([type, eventName, params]: [string, string, Record<string, string>]) =>
        type === "event" &&
        eventName === "directions_click" &&
        params.placement === "contact_visit_panel",
    ),
  ).toBe(true);

  guard.assertNoErrors("contact business-action analytics");
});

test("legacy Wix routes: best-fit redirects resolve to live pages", async ({ page }) => {
  const guard = attachConsoleGuards(page);
  const routes = [
    {
      path: "/ring-sizing-repair",
      url: /\/services\/ring-sizing$/,
      heading: /Ring Sizing/i,
    },
    {
      path: "/book-online?utm_source=google&utm_medium=book_button",
      url: /\/book\?utm_source=google&utm_medium=book_button$/,
      heading: /Reserve a free 15/i,
    },
    {
      path: "/watch-repair-battery",
      url: /\/services\/watch-repair$/,
      heading: /Watch Repair/i,
    },
    {
      path: "/custom-work-restorations",
      url: /\/services\/heirloom-restoration$/,
      heading: /Heirloom Restoration/i,
    },
    {
      path: "/accessibility",
      url: /\/contact$/,
      heading: /Talk to a local expert/i,
    },
    {
      path: "/blank-2",
      url: /\/services$/,
      heading: /A curated menu of in-house repairs/i,
    },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(route.url);
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
  }

  guard.assertNoErrors("legacy Wix redirects");
});

test("commercial blog guides expose repair decision signals", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/does-my-watch-need-battery-or-repair-pasadena", {
    waitUntil: "networkidle",
  });

  await expect(page.getByText(/Repair decision guide/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Second hand jumps every few seconds", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /The intake details that separate battery service from repair/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/when the watch stopped, whether it was exposed to water/i))
    .toBeVisible();
  await expect(page.getByText(/Best next action:/i).first()).toBeVisible();

  guard.assertNoErrors("commercial blog decision signals");
});

test("heirloom planning guide exposes bench-intake differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/heirloom-restoration-planning-guide", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      name: /The bench-intake checklist that prevents vague restoration quotes/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/preserve the engraving/i)).toBeVisible();

  await page.goto("/blog/heirloom-jewelry-restoration-repair-or-redesign", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("link", { name: /Plan an Heirloom Restoration Visit/i }),
  ).toBeVisible();

  guard.assertNoErrors("heirloom planning differentiation");
});

test("chain repair guide exposes intake triage differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/chain-repair-weak-points", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      name: /Necklace & Bracelet Chain Repair: Weak Points to Check/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /The chain intake triage we use before recommending a repair/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/failed at a jump ring, clasp, solder joint/i)).toBeVisible();
  await expect(page.getByText(/bring the pendant, charm, or bracelet exactly as you wear it/i))
    .toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Can I get a necklace or bracelet chain repair quote from photos/i,
    }),
  ).toBeVisible();

  guard.assertNoErrors("chain repair intake triage");
});

test("stone security guide exposes bench-check differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/stone-security-checklist", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      name: /The stone-security bench check we want before quoting repair/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/worn prong tips, a bent prong, a shallow seat/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "The stone clicks or rattles", exact: true }))
    .toBeVisible();

  await page.goto("/blog/can-a-severely-bent-ring-prong-be-fixed", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("link", { name: /Run the Stone Security Checklist/i }),
  ).toBeVisible();

  guard.assertNoErrors("stone security bench-check differentiation");
});

test("trustworthy jeweler guide exposes repair-intake differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/how-to-choose-a-jeweler", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      name: /The counter-level questions that separate a repair shop from a sales counter/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/whether it spins, catches on clothing, has a loose stone/i))
    .toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Our Pasadena repair-intake checklist before we quote/i }),
  ).toBeVisible();
  await expect(page.getByText(/clasp tongue, spring ring, jump ring, hollow link/i))
    .toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Photo evidence that helps us give a better first answer/i }),
  ).toBeVisible();
  await expect(page.getByText(/one full-piece photo for scale, one close photo of the failing area/i))
    .toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The shop cannot say who will do the repair", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /See Watch Repair Service/i })).toBeVisible();

  await page.goto("/blog/heirloom-jewelry-restoration-repair-or-redesign", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("link", { name: /Choose a Trustworthy Jeweler/i }),
  ).toBeVisible();

  guard.assertNoErrors("trustworthy jeweler intake differentiation");
});

test("pearl timing guide exposes event-deadline intake differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/pearl-restringing-timing-guide", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      name: /The pearl-strand timing check we want before an event deadline/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/one close photo of the clasp and end knots/i)).toBeVisible();

  await page.goto("/blog/how-much-does-pearl-restringing-cost-pasadena", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("link", { name: /Check Pearl Restringing Timing/i }),
  ).toBeVisible();

  guard.assertNoErrors("pearl timing event-deadline differentiation");
});

test("cleaning guides expose inspection-risk differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/professional-cleaning-vs-home-care", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Home Jewelry Cleaning: When to Stop and Get an Inspection/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Direct answer: clean only if the structure is boring/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/a stone shifts or clicks/i)).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /The cleaning-intake check we want before polishing anything sentimental/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/one side photo that shows prong height or clasp condition/i))
    .toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "The piece is vintage, inherited, or stone-heavy",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/What photos help with a cleaning or inspection quote/i),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Check Vintage Ring Cleaning Risk/i }),
  ).toBeVisible();

  await page.goto("/blog/safe-to-clean-vintage-diamond-ring-at-home", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("heading", {
      name: /The vintage-ring red flags we want checked before any stronger cleaner/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/A vintage diamond can tolerate more than the mounting around it/i))
    .toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "The ring has filigree, old solder, or a thin shank",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Compare Professional vs Home Cleaning/i }),
  ).toBeVisible();

  guard.assertNoErrors("cleaning guide inspection-risk differentiation");
});

test("same-day watch battery guide exposes local intake differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/where-to-get-watch-battery-replaced-pasadena", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      name: /The same-day watch battery intake we want before you drive over/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/send a quick photo of the dial and the back of the case/i))
    .toBeVisible();

  await page.goto("/blog/does-my-watch-need-battery-or-repair-pasadena", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("link", { name: /Find Same-Day Watch Battery Help/i }),
  ).toBeVisible();

  guard.assertNoErrors("same-day watch battery intake differentiation");
});

test("battery-vs-repair guide exposes pre-open watch triage", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/does-my-watch-need-battery-or-repair-pasadena", {
    waitUntil: "networkidle",
  });

  await expect(
    page.getByRole("heading", {
      name: /The five-minute Pasadena watch triage we want before opening the case/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/fog under the crystal, green or white residue around the crown/i))
    .toBeVisible();
  await expect(page.getByText(/dial photo, a caseback photo, and a crown-side photo/i))
    .toBeVisible();
  await expect(
    page.getByText(/What watch photos should I send before asking for a battery quote/i),
  ).toBeVisible();

  guard.assertNoErrors("battery vs repair pre-open triage");
});

test("sitemap excludes legacy Wix URLs and includes current geo routes", async ({ page }) => {
  await page.goto("/sitemap.xml", { waitUntil: "networkidle" });
  const bodyText = (await page.textContent("body")) || "";

  expect(bodyText).toContain("https://www.susiesjewelryrepair.com/services/deer-park");
  expect(bodyText).toContain("https://www.susiesjewelryrepair.com/services/clear-lake");
  expect(bodyText).toContain("https://www.susiesjewelryrepair.com/site-map");
  expect(bodyText).toContain("<lastmod>2026-05-13T17:00:00.000Z</lastmod>");
  expect(bodyText).not.toContain("/book-online");
  expect(bodyText).not.toContain("/ring-sizing-repair");
});

test("html site map exposes crawlable commercial and geo paths", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/site-map", { waitUntil: "networkidle" });

  await expect(
    page.getByRole("heading", { level: 1, name: /Every repair path/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /^XML Sitemap$/i })).toHaveAttribute(
    "href",
    "/sitemap.xml",
  );
  await expect(page.getByText("Jewelry repair near Clear Lake")).toBeVisible();
  await expect(page.locator('main a[href="/services/clear-lake"]')).toHaveCount(1);
  await expect(page.locator('main a[href="/services/pearl-restringing"]')).toHaveCount(1);
  await expect(
    page.locator('main a[href="/blog/does-my-watch-need-battery-or-repair-pasadena"]'),
  ).toHaveCount(1);

  guard.assertNoErrors("html sitemap crawl paths");
});

test("mobile informational pages: about, faq, and blog hero actions are clear", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);
  const routes = [
    { path: "/about", heading: /Family craftsmanship, refined over four decades/i },
    {
      path: "/faq",
      heading: /Answers before you hand over a meaningful piece/i,
    },
    { path: "/blog", heading: /Repair tips and local guidance/i },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();

    await expect(page.getByRole("region", { name: /^Quick actions$/i })).toHaveCount(0);

    const heroSection = page.locator("main section").first();
    const quote = heroSection.getByRole("link", { name: /^Get Fast Quote$/i }).first();
    const book = heroSection.getByRole("link", { name: /^Book Repair$/i }).first();
    await expect(quote).toBeVisible();
    await expect(book).toBeHidden();

    await expectTapTarget(quote, `Quote tap target on ${route.path}`);

    await assertNoBrokenImages(page);
  }

  await page.goto("/blog", { waitUntil: "networkidle" });
  const blogHeroSection = page.locator("main section").first();
  await expect(
    blogHeroSection.getByRole("link", { name: /Watch Repair & Battery Replacement/i }).first()
  ).toBeVisible();
  await expect(
    blogHeroSection.getByRole("link", { name: /Ring Sizing & Repair/i }).first()
  ).toBeVisible();

  guard.assertNoErrors("informational pages hero actions");
});

test("mobile contact page: direct actions remain clear", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/contact", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Talk to a local expert/i })).toBeVisible();

  const quickActions = page.getByRole("region", { name: /^Contact actions$/i });
  await expect(quickActions).toBeVisible();

  const message = quickActions.getByRole("link", { name: /^Send Message$/i });
  const call = quickActions.getByRole("link", { name: /^Call Now$/i });
  await expect(message).toBeVisible();
  await expect(call).toBeVisible();
  await expect(quickActions.getByRole("link")).toHaveCount(2);

  await expectTapTarget(message, "Message tap target on /contact");
  await expectTapTarget(call, "Call tap target on /contact");

  guard.assertNoErrors("contact direct actions");
});

test("mobile blog detail: article content, related services, and CTAs render", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/ring-sizing-guide", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Ring Sizing/i })).toBeVisible();
  const blogBreadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
  await expect(blogBreadcrumb).toBeVisible();
  await expect(blogBreadcrumb.getByRole("link", { name: /^Blog$/i })).toBeVisible();
  await expect(page.getByText(/Key takeaways/i)).toBeVisible();
  await expect(page.getByText(/Related services/i)).toBeVisible();

  await expect(page.getByRole("link", { name: /^Get Fast Quote$/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /^View Services$/i }).first()).toBeVisible();

  await assertNoBrokenImages(page);
  guard.assertNoErrors("blog detail");
});

test("mobile blog detail: commercial-intent article renders in-body faq and next steps", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/cost-to-resize-gold-ring-pasadena", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { level: 1, name: /How much does it cost to resize a gold ring in Pasadena/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Quick answers for Pasadena ring resizing/i })
  ).toBeVisible();
  await expect(
    page.getByText(/How much does it cost to size a simple gold ring down in Pasadena/i)
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Best next step if your ring feels too loose or too tight/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /See Ring Sizing Service/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Get Deer Park Repair Guidance/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /See Friendswood Ring Repair Guidance/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Get Fast Quote$/i }).first()).toBeVisible();

  guard.assertNoErrors("blog detail faq/next-steps");
});

test("mobile blog detail: heirloom article renders in-body faq and next steps", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/heirloom-jewelry-restoration-repair-or-redesign", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Heirloom Jewelry Restoration: Should I Repair It or Redesign It/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Quick answers about heirloom repair vs redesign/i,
    })
  ).toBeVisible();
  await expect(
    page.getByText(/Can you reuse the original diamonds or gold in a redesign/i)
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Best next step for inherited jewelry you want to wear again/i,
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore Heirloom Restoration/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /See La Porte Repair Guidance/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /See Clear Lake Heirloom Guidance/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore Custom Design/i })).toBeVisible();

  guard.assertNoErrors("blog detail heirloom faq/next-steps");
});

test("mobile blog detail: watch battery article links into deer park geo guidance", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/where-to-get-watch-battery-replaced-pasadena", {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Where to get a watch battery replaced today near Deer Park \/ Pasadena/i,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Get Deer Park Watch Repair Help/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Get Clear Lake Watch Repair Help/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Decide Battery vs Repair/i })).toBeVisible();

  guard.assertNoErrors("blog detail watch battery geo link");
});

test("mobile service-area pages: nearby city pages render local guidance and hero actions", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);
  const routes = [
    {
      path: "/services/deer-park",
      heading: /Jewelry repair near Deer Park for fast quote-first service/i,
      serviceLink: /Jewelry repair near Deer Park/i,
    },
    {
      path: "/services/la-porte",
      heading: /Jewelry repair near La Porte for coastal watches/i,
      serviceLink: /Jewelry repair near La Porte/i,
    },
    {
      path: "/services/webster",
      heading: /Jewelry repair near Webster for watch, ring, and before-you-drive triage/i,
      serviceLink: /Jewelry repair near Webster/i,
    },
    {
      path: "/services/friendswood",
      heading: /Jewelry repair near Friendswood for heirlooms and engagement-ring confidence/i,
      serviceLink: /Jewelry repair near Friendswood/i,
    },
    {
      path: "/services/clear-lake",
      heading: /Jewelry repair near Clear Lake for watch moisture/i,
      serviceLink: /Jewelry repair near Clear Lake/i,
    },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    const areaBreadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
    await expect(areaBreadcrumb).toBeVisible();
    await expect(areaBreadcrumb.getByRole("link", { name: /^Services$/i })).toBeVisible();
    const heroSection = page.locator("main section").first();
    await expect(heroSection.getByRole("link", { name: /^Get Fast Quote$/i }).first())
      .toBeVisible();
    await expect(heroSection.getByRole("link", { name: /^Book Repair$/i }).first())
      .toBeHidden();
    await expect(page.getByText(route.serviceLink).first()).toBeVisible();
    await assertNoBrokenImages(page);
  }

  guard.assertNoErrors("service-area pages");
});

test("service area: webster page exposes Bay Area intake differentiation", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/webster", { waitUntil: "networkidle" });

  await expect(page.getByText(/Baybrook errands, or a NASA\/Clear Lake-area appointment/i))
    .toBeVisible();
  await expect(page.getByText(/Include one close photo of the problem area/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Watch intake details before you make the drive/i }),
  ).toBeVisible();

  guard.assertNoErrors("service area webster differentiation");
});

test("service area: clear lake page exposes moisture and stone-risk differentiation", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/clear-lake", { waitUntil: "networkidle" });

  await expect(page.getByText(/NASA-area schedules, Bay Area Boulevard errands/i)).toBeVisible();
  await expect(page.getByText(/water exposure, humidity, fog under the crystal/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Does my watch need a battery or deeper repair/i }))
    .toBeVisible();

  guard.assertNoErrors("service area clear lake differentiation");
});

test("service area: friendswood page exposes heirloom and ring-intake differentiation", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/friendswood", { waitUntil: "networkidle" });

  await expect(page.getByText(/family schedules, school events, church weekends/i)).toBeVisible();
  await expect(page.getByText(/whether the ring spins, feels tight by the end of the day/i))
    .toBeVisible();
  await expect(page.getByRole("link", { name: /Gold ring resizing cost and timing guide/i }))
    .toBeVisible();

  guard.assertNoErrors("service area friendswood differentiation");
});

test("service area: la porte page exposes coastal watch and workwear differentiation", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/la-porte", { waitUntil: "networkidle" });

  await expect(page.getByText(/Humidity, water exposure, boating weekends/i)).toBeVisible();
  await expect(page.getByText(/daily workwear, weekend\/event jewelry, or inherited/i))
    .toBeVisible();
  await expect(page.getByRole("heading", { name: /Coastal watch concern/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Where weak chains usually fail first/i }))
    .toBeVisible();

  guard.assertNoErrors("service area la porte differentiation");
});

test("mobile service detail: non-watch routes use a varied image set", async ({ page }) => {
  const guard = attachConsoleGuards(page);
  const routes = ["/services/ring-sizing", "/services/necklace-repair"];

  for (const route of routes) {
    await page.goto(route, { waitUntil: "networkidle" });
    await assertNoBrokenImages(page);

    const uniqueServiceImageCount = await page.evaluate(() => {
      const urls = Array.from(document.querySelectorAll("main img"))
        .map((img) => {
          const image = img as HTMLImageElement;
          const raw = image.currentSrc || image.getAttribute("src") || "";
          try {
            return decodeURIComponent(raw);
          } catch {
            return raw;
          }
        })
        .filter(
          (src) => src.includes("/images/services/") || src.includes("/site-assets/services/")
        );
      return new Set(urls).size;
    });

    expect(
      uniqueServiceImageCount,
      `Expected richer image variety on ${route}, got ${uniqueServiceImageCount} unique service images.`
    ).toBeGreaterThanOrEqual(4);
  }

  guard.assertNoErrors("service detail image variety");
});

test("services hub: featured detail link routes to service detail", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services", { waitUntil: "networkidle" });
  const helpfulGuidesSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: /Research the repair before you bring it in/i }),
  }).first();
  await expect(
    page.getByRole("heading", { name: /A curated menu of in-house repairs/i })
  ).toBeVisible();
  await expect(helpfulGuidesSection.getByRole("link", { name: /watch/i }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: /Watch Repair & Battery Replacement/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /^View details$/i }).first()).toBeVisible();

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

test("services hub: repair planning paths expose priority routes", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services", { waitUntil: "networkidle" });

  const planningPaths = page.getByLabel(/^Repair planning paths$/i);
  await expect(planningPaths).toBeVisible();
  await expect(
    planningPaths.getByRole("link", { name: /Pearl restringing service/i }),
  ).toHaveAttribute("href", "/services/pearl-restringing");
  await expect(
    planningPaths.getByRole("link", { name: /Heirloom repair planning/i }),
  ).toHaveAttribute("href", "/blog/heirloom-restoration-planning-guide");
  await expect(
    planningPaths.getByRole("link", { name: /Watch battery or repair/i }),
  ).toHaveAttribute("href", "/blog/does-my-watch-need-battery-or-repair-pasadena");

  guard.assertNoErrors("services hub repair planning paths");
});

test("services hub: intent finder narrows results and resets cleanly", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services", { waitUntil: "networkidle" });
  const finder = page.getByTestId("services-finder-region");
  const results = page.getByTestId("services-finder-results");

  await expect(finder.getByRole("heading", { name: /What do you need fixed/i })).toBeVisible();
  await expect(results.getByRole("heading", { level: 2, name: /Watch Services/i })).toBeVisible();

  await finder.getByRole("button", { name: /Broken necklace or chain/i }).click();
  await expect(
    results.getByRole("heading", { level: 2, name: /Chains & Bracelets/i }),
  ).toBeVisible();
  await expect(
    results.getByRole("heading", { level: 3, name: /^Necklace Repair$/i }),
  ).toBeVisible();
  await expect(
    results.getByRole("heading", { level: 3, name: /Watch Repair & Battery Replacement/i }),
  ).toHaveCount(0);

  const query = finder.getByLabel(/Describe the repair you need/i);
  await query.fill("watch battery");
  await expect(
    results.getByRole("heading", { level: 2, name: /Watch Services/i }),
  ).toBeVisible();
  await expect(
    results.getByRole("heading", { level: 3, name: /Watch Repair & Battery Replacement/i }),
  ).toBeVisible();

  await query.fill("broken toaster");
  await expect(finder.getByText(/No direct service match yet/i)).toBeVisible();
  await finder.getByRole("button", { name: /Clear finder/i }).click();
  await expect(
    results.getByRole("heading", { level: 2, name: /Watch Services/i }),
  ).toBeVisible();
  await expect(
    results.getByRole("heading", { level: 3, name: /Watch Repair & Battery Replacement/i }),
  ).toBeVisible();

  guard.assertNoErrors("services hub intent finder");
});

test("services hub: finder quote CTA carries context into quote form", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services", { waitUntil: "networkidle" });
  const finder = page.getByTestId("services-finder-region");
  await finder.getByLabel(/Describe the repair you need/i).fill("watch battery");
  await finder.getByRole("link", { name: /Use this for a quote/i }).click();

  await expect(page).toHaveURL(
    /\/quote\?from=services_finder&service=watch-repair&query=watch\+battery$/,
  );
  await expect(page.getByText(/Repair focus/i).first()).toBeVisible();
  await expect(page.getByText(/Suggested service:/i)).toContainText(/Watch Repair/i);
  await expect(page.locator('textarea[name="details"]')).toHaveValue(
    /Repair focus: Watch Repair & Battery Replacement[\s\S]*Issue: watch battery/i,
  );

  guard.assertNoErrors("services finder quote context");
});

test("services hub: finder booking CTA carries context into booking form", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto("/services", { waitUntil: "networkidle" });
  const finder = page.getByTestId("services-finder-region");
  await finder.getByRole("button", { name: /Redesign or heirloom help/i }).click();
  await finder.getByRole("link", { name: /Use this for booking/i }).click();

  await expect(page).toHaveURL(
    /\/book\?from=services_finder&service=custom-design&intent=Redesign\+or\+heirloom\+help$/,
  );
  await expect(page.getByText(/Repair focus/i).first()).toBeVisible();
  await expect(page.getByText(/Suggested service:/i)).toContainText(/Custom Design/i);
  await expect(page.locator('textarea[name="details"]')).toHaveValue(
    /Repair focus: Custom Design[\s\S]*Issue: Redesign or heirloom help/i,
  );

  guard.assertNoErrors("services finder booking context");
});

test("services hub: zero-result quote CTA preserves finder query", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services", { waitUntil: "networkidle" });
  const finder = page.getByTestId("services-finder-region");
  await finder.getByLabel(/Describe the repair you need/i).fill("broken toaster");
  await expect(finder.getByText(/No direct service match yet/i)).toBeVisible();
  await finder.getByRole("link", { name: /^Get Fast Quote$/i }).click();

  await expect(page).toHaveURL(/\/quote\?from=services_finder&query=broken\+toaster$/);
  await expect(page.getByText(/Repair focus/i).first()).toBeVisible();
  await expect(page.locator('textarea[name="details"]')).toHaveValue(/Issue: broken toaster/i);

  guard.assertNoErrors("services finder zero-result quote");
});

test("service area: pasadena page ships local schema and nearby city links", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/pasadena", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { level: 1, name: /Jewelry repair near Pasadena/i }),
  ).toBeVisible();
  await expect(page.getByText(/Nearby cities we also serve/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Jewelry repair near Deer Park/i }),
  ).toBeVisible();
  await expect(page.getByText(/Best starting points for Pasadena/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /Fairmont Parkway repair stop/i })).toBeVisible();
  await expect(page.getByText(/safe for normal wear today/i)).toBeVisible();
  await expect(page.getByText(/clasp, jump ring, hollow link, or solder point/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /How Pasadena customers should choose the right repair path/i }),
  ).toBeVisible();
  await expect(page.getByText(/Battery-first assessment/i)).toBeVisible();
  await expect(page.getByText(/Restoration-first conversation/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Gold ring resizing cost and timing guide/i }))
    .toBeVisible();

  const schemaScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(
    schemaScripts.some(
      (script) =>
        script.includes('"@id":"https://www.susiesjewelryrepair.com/services/pasadena#service-area"') &&
        script.includes('"provider":{"@id":"https://www.susiesjewelryrepair.com/#localbusiness"}'),
    ),
  ).toBe(true);

  guard.assertNoErrors("service area pasadena schema");
});

test("service area: quote CTA carries city context into quote form and analytics", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.addInitScript(() => {
    const storageKey = "sjr_test_ga_events";
    Object.defineProperty(window, "__sjrGaHostAllowed", {
      configurable: true,
      get: () => true,
      set: () => undefined,
    });
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => {
      const existing = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
      existing.push(args);
      window.sessionStorage.setItem(storageKey, JSON.stringify(existing));
      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      window.dataLayer.push(args);
    };
  });

  await page.goto("/services/pasadena", { waitUntil: "networkidle" });
  await page.evaluate(() => window.sessionStorage.removeItem("sjr_test_ga_events"));
  await page.getByRole("link", { name: /^Get Fast Quote$/i }).click();

  await expect(page).toHaveURL(/\/quote\?from=service_area&area=pasadena$/);
  await expect(page.getByText(/Customer area: Pasadena/i).first()).toBeVisible();
  await expect(page.locator('textarea[name="details"]')).toHaveValue(/Customer area: Pasadena/i);

  await page.getByLabel(/Full name/i).focus();
  const events = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("sjr_test_ga_events") || "[]"),
  );
  expect(
    events.some(
      ([type, eventName, params]: [string, string, Record<string, string>]) =>
        type === "event" &&
        eventName === "lead_form_start" &&
        params.prefill_source === "service_area" &&
        params.area_slug === "pasadena",
    ),
  ).toBe(true);

  guard.assertNoErrors("service area quote context");
});

test("lead forms preserve first-touch attribution fields", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.addInitScript(() => {
    window.sessionStorage.setItem(
      "sjr_first_touch",
      JSON.stringify({
        landing_path: "/quote",
        landing_search: "?utm_source=google&utm_medium=cpc&utm_campaign=repair-test&gclid=test-click",
        referrer: "https://www.google.com/",
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "repair-test",
        utm_term: null,
        utm_content: null,
        utm_id: null,
        gclid: "test-click",
        gbraid: null,
        wbraid: null,
        msclkid: null,
        first_touch_at: "2026-05-05T00:00:00.000Z",
      }),
    );
  });
  await page.goto("/book", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/book$/);

  await expect(page.locator('input[name="attribution_landing_path"]')).toHaveValue("/quote");
  await expect(page.locator('input[name="attribution_landing_search"]')).toHaveValue(
    "?utm_source=google&utm_medium=cpc&utm_campaign=repair-test&gclid=test-click",
  );
  await expect(page.locator('input[name="attribution_utm_source"]')).toHaveValue("google");
  await expect(page.locator('input[name="attribution_utm_medium"]')).toHaveValue("cpc");
  await expect(page.locator('input[name="attribution_utm_campaign"]')).toHaveValue(
    "repair-test",
  );
  await expect(page.locator('input[name="attribution_gclid"]')).toHaveValue("test-click");
  await expect(page.locator('input[name="attribution_referrer"]')).toHaveValue(
    "https://www.google.com/",
  );
  await expect(page.locator('input[name="attribution_submit_path"]')).toHaveValue("/book");

  guard.assertNoErrors("lead attribution fields");
});

test("lead forms capture current URL attribution before first-touch storage settles", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto(
    "/contact?utm_source=codex&utm_medium=verification&utm_campaign=lead-attribution&gclid=test-click",
    { waitUntil: "networkidle" },
  );

  await expect(page.locator('input[name="attribution_landing_path"]')).toHaveValue("/contact");
  await expect(page.locator('input[name="attribution_landing_search"]')).toHaveValue(
    "?utm_source=codex&utm_medium=verification&utm_campaign=lead-attribution&gclid=test-click",
  );
  await expect(page.locator('input[name="attribution_utm_source"]')).toHaveValue("codex");
  await expect(page.locator('input[name="attribution_utm_medium"]')).toHaveValue("verification");
  await expect(page.locator('input[name="attribution_utm_campaign"]')).toHaveValue(
    "lead-attribution",
  );
  await expect(page.locator('input[name="attribution_gclid"]')).toHaveValue("test-click");

  guard.assertNoErrors("current URL attribution fields");
});

test("home services grid: full card click navigates to service detail", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });
  const card = page.locator("#service-watch-repair").first();
  await expect(card).toBeVisible();

  await card.click({ position: { x: 36, y: 36 } });
  await expect(page).toHaveURL(/\/services\/watch-repair$/);
  await expect(page.getByRole("heading", { level: 1, name: /Watch Repair/i })).toBeVisible();

  guard.assertNoErrors("home services card click");
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
  await expect(page.getByRole("link", { name: /Book Repair/i }).first()).toBeHidden();

  guard.assertNoErrors("service detail: ring-sizing flagship sections");
});

test("mobile service detail: all services follow flagship section sequence", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);
  const slugs = [
    "watch-repair",
    "ring-sizing",
    "stone-setting",
    "jewelry-cleaning",
    "necklace-repair",
    "bracelet-repair",
    "pearl-restringing",
    "custom-design",
    "heirloom-restoration",
  ];

  for (const slug of slugs) {
    await page.goto(`/services/${slug}`, { waitUntil: "networkidle" });

    await expect(page.getByText(/How it works/i).first()).toBeVisible();
    await expect(page.getByText(/What to expect/i).first()).toBeVisible();
    await expect(page.getByText(/Pricing & timing/i).first()).toBeVisible();
    await expect(page.getByText(/Why customers choose us/i).first()).toBeVisible();
    await expect(page.getByText(/^FAQs$/i).first()).toBeVisible();
    await expect(page.getByText(/Related services/i).first()).toBeVisible();

    await expect(page.getByRole("link", { name: /Get Fast Quote/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Book Repair/i }).first()).toBeHidden();

    if (slug === "custom-design") {
      await expect(page.getByText(/7 business days/i).first()).toBeVisible();
    }
  }

  guard.assertNoErrors("service detail: all flagship section sequences");
});

test("mobile service detail: decision module and proof blocks render", async ({ page }) => {
  const guard = attachConsoleGuards(page);
  const slugs = [
    "watch-repair",
    "ring-sizing",
    "stone-setting",
    "jewelry-cleaning",
    "necklace-repair",
    "bracelet-repair",
    "pearl-restringing",
    "custom-design",
    "heirloom-restoration",
  ];

  for (const slug of slugs) {
    await page.goto(`/services/${slug}`, { waitUntil: "networkidle" });

    await expect(page.getByTestId("service-decision-module")).toBeVisible();
    await expect(page.getByTestId("service-proof-blocks")).toBeVisible();
    await expect(page.getByTestId("service-market-snapshot")).toBeVisible();
    await expect(page.getByTestId("service-market-snapshot-item")).toHaveCount(3);
  }

  guard.assertNoErrors("service decision/proof modules");
});

test("mobile service detail: secondary content stays restrained", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/watch-repair", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: /Watch Repair/i })).toBeVisible();
  await expect(page.locator('[data-service-section="hero"] picture').first()).toBeHidden();
  await expect(page.locator('[data-service-section="how-it-works"] img').first()).toBeHidden();
  await expect(page.locator('[data-service-section="what-to-expect"] img').first()).toBeHidden();
  await expect(page.getByTestId("service-market-snapshot-item").first()).toBeHidden();

  const proofCards = page.getByTestId("service-proof-blocks").locator("figure");
  await expect(proofCards).toHaveCount(3);
  await expect(proofCards.nth(0)).toBeVisible();
  await expect(proofCards.nth(1)).toBeHidden();
  await expect(proofCards.nth(2)).toBeHidden();

  const guideLinks = page
    .locator('[data-service-section="related-services"]')
    .getByRole("link")
    .filter({ hasText: /Blog guide/i });
  await expect(guideLinks).toHaveCount(2);
  await expect(guideLinks.nth(0)).toBeVisible();
  await expect(guideLinks.nth(1)).toBeVisible();

  guard.assertNoErrors("mobile service detail restrained secondary content");
});

test("mobile service detail: commercial pages expose direct answer blocks", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);
  const slugs = [
    "watch-repair",
    "ring-sizing",
    "stone-setting",
    "pearl-restringing",
  ];

  for (const slug of slugs) {
    await page.goto(`/services/${slug}`, { waitUntil: "networkidle" });

    const directAnswer = page.getByTestId("service-direct-answer");
    await expect(directAnswer).toBeVisible();
    await expect(directAnswer.getByText(/Direct answer/i)).toBeVisible();
    await expect(directAnswer.getByText(/Best next step/i)).toBeVisible();
    await expect(directAnswer.getByText(/Why this matters/i)).toBeVisible();
  }

  guard.assertNoErrors("service direct answer blocks");
});

test("mobile service detail: pearl restringing exposes strand-specific decisions", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/pearl-restringing", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: /Pearl Restringing/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Thread condition/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Knotting and spacing/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Clasp decisions/i })).toBeVisible();
  await expect(page.getByText("Fraying near the clasp", { exact: true })).toBeVisible();
  await expect(page.getByText(/The full pearl strand, including any loose pearls/i)).toBeVisible();

  guard.assertNoErrors("pearl restringing strand-specific decisions");
});

test("mobile service detail: non-watch and non-ring routes provide 7 FAQs", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);
  const slugs = [
    "stone-setting",
    "jewelry-cleaning",
    "necklace-repair",
    "bracelet-repair",
    "pearl-restringing",
    "custom-design",
    "heirloom-restoration",
  ];

  for (const slug of slugs) {
    await page.goto(`/services/${slug}`, { waitUntil: "networkidle" });
    const faqItems = page.locator("section:has-text('FAQs') details");
    await expect(
      faqItems,
      `Expected 7 FAQs on /services/${slug} for expanded intent depth`,
    ).toHaveCount(7);
  }

  guard.assertNoErrors("service faq depth");
});

test("mobile services pages: hero actions are clear and image assets load", async ({
  page,
}) => {
  const routes = ["/services", "/services/watch-repair", "/services/ring-sizing"];

  for (const route of routes) {
    await page.goto(route, { waitUntil: "networkidle" });

    await expect(page.getByRole("region", { name: /^Quick actions$/i })).toHaveCount(0);

    const heroSection = page.locator("main section").first();
    const quote = heroSection.getByRole("link", { name: /^Get Fast Quote$/i }).first();
    const book = heroSection.getByRole("link", { name: /^Book Repair$/i }).first();
    await expect(quote).toBeVisible();
    await expect(book).toBeHidden();

    await expectTapTarget(quote, `Quote tap target on ${route}`);

    await assertNoBrokenImages(page);
  }
});

test("footer brand lockup includes full business name", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(
    page
      .locator("footer")
      .getByRole("link", { name: /Susie.?s Jewelry Repair/i })
      .first()
  ).toBeVisible();

  guard.assertNoErrors("footer brand lockup");
});

test("footer exposes full priority repair crawl set", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/", { waitUntil: "networkidle" });
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();

  await expect(
    footer.getByRole("link", { name: /^Pearl restringing service$/i }),
  ).toHaveAttribute("href", "/services/pearl-restringing");
  await expect(
    footer.getByRole("link", { name: /^Watch battery replacement near Pasadena$/i }),
  ).toHaveAttribute("href", "/blog/where-to-get-watch-battery-replaced-pasadena");
  await expect(
    footer.getByRole("link", { name: /^Choose a repair jeweler$/i }),
  ).toHaveAttribute("href", "/blog/how-to-choose-a-jeweler");
  await expect(
    footer.getByRole("link", { name: /^Professional cleaning vs home care$/i }),
  ).toHaveAttribute("href", "/blog/professional-cleaning-vs-home-care");
  await expect(
    footer.getByRole("link", { name: /^Vintage diamond cleaning risk$/i }),
  ).toHaveAttribute("href", "/blog/safe-to-clean-vintage-diamond-ring-at-home");

  guard.assertNoErrors("footer priority crawl set");
});
