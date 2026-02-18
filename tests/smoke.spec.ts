import { expect, test } from "@playwright/test";
import type { ConsoleMessage, Page } from "@playwright/test";

function isKnownBenignReactHydrationError(message: string) {
  return (
    message.includes("Minified React error #418") &&
    message.includes("args[]=HTML")
  );
}

function attachConsoleGuards(page: Page) {
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
    page.getByRole("heading", { name: /Your jewelry never leaves our hands/i })
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
        return !img.complete || img.naturalWidth === 0;
      })
      .map((img) => img.currentSrc || img.src || "<unknown>");
  });

  expect(broken, `Broken images detected:\n${broken.join("\n")}`).toEqual([]);
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

    const contactBox = await contact.boundingBox();
    const altBox = await alt.boundingBox();
    expect(contactBox?.height ?? 0, `Contact tap target too small on ${route.path}`).toBeGreaterThanOrEqual(
      44
    );
    expect(altBox?.height ?? 0, `Secondary tap target too small on ${route.path}`).toBeGreaterThanOrEqual(
      44
    );
  }

  guard.assertNoErrors("quote/book quick actions");
});

test("mobile service detail: what-to-expect content + faqs render", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services/jewelry-cleaning", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Jewelry Cleaning/i })).toBeVisible();

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

test("legal pages: privacy + terms exist", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/privacy", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Privacy Policy/i })).toBeVisible();

  await page.goto("/terms", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Terms of Service/i })).toBeVisible();

  guard.assertNoErrors("privacy/terms");
});

test("mobile core pages: about, faq, contact, and blog quick actions are clear", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);
  const routes = [
    { path: "/about", heading: /Family craftsmanship, refined over four decades/i },
    {
      path: "/faq",
      heading: /Answers before you hand over a meaningful piece/i,
    },
    { path: "/contact", heading: /Talk to a local expert/i },
    { path: "/blog", heading: /Repair tips and local guidance/i },
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();

    const quickActions = page.getByRole("region", { name: /^Quick actions$/i });
    await expect(quickActions).toBeVisible();

    const quote = quickActions.getByRole("link", { name: /^Get Fast Quote$/i });
    const book = quickActions.getByRole("link", { name: /^Book Repair$/i });
    await expect(quote).toBeVisible();
    await expect(book).toBeVisible();

    const quoteBox = await quote.boundingBox();
    const bookBox = await book.boundingBox();
    expect(quoteBox?.height ?? 0, `Quote tap target too small on ${route.path}`).toBeGreaterThanOrEqual(
      44
    );
    expect(bookBox?.height ?? 0, `Book tap target too small on ${route.path}`).toBeGreaterThanOrEqual(
      44
    );

    await assertNoBrokenImages(page);
  }

  guard.assertNoErrors("core pages quick actions");
});

test("mobile blog detail: article content, related services, and CTAs render", async ({
  page,
}) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/blog/ring-sizing-guide", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: /Ring Sizing/i })).toBeVisible();
  await expect(page.getByText(/Key takeaways/i)).toBeVisible();
  await expect(page.getByText(/Related services/i)).toBeVisible();

  await expect(page.getByRole("link", { name: /^Get Fast Quote$/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /^View Services$/i }).first()).toBeVisible();

  await assertNoBrokenImages(page);
  guard.assertNoErrors("blog detail");
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
          const raw = img.currentSrc || img.getAttribute("src") || "";
          try {
            return decodeURIComponent(raw);
          } catch {
            return raw;
          }
        })
        .filter((src) => src.includes("/site-assets/services/"));
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
  await expect(page.getByRole("link", { name: /Book Repair/i }).first()).toBeVisible();

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
    await expect(page.getByRole("link", { name: /Book Repair/i }).first()).toBeVisible();

    if (slug === "custom-design") {
      await expect(page.getByText(/7 business days/i).first()).toBeVisible();
    }
  }

  guard.assertNoErrors("service detail: all flagship section sequences");
});

test("mobile services pages: quick actions are clear and image assets load", async ({
  page,
}) => {
  const routes = ["/services", "/services/watch-repair", "/services/ring-sizing"];

  for (const route of routes) {
    await page.goto(route, { waitUntil: "networkidle" });

    const quickActions = page.getByRole("region", { name: /Quick actions/i });
    await expect(quickActions).toBeVisible();

    const quote = quickActions.getByRole("link", { name: /^Get Fast Quote$/i });
    const book = quickActions.getByRole("link", { name: /^Book Repair$/i });
    await expect(quote).toBeVisible();
    await expect(book).toBeVisible();

    const quoteBox = await quote.boundingBox();
    const bookBox = await book.boundingBox();
    expect(quoteBox?.height ?? 0, `Quote tap target too small on ${route}`).toBeGreaterThanOrEqual(
      44
    );
    expect(bookBox?.height ?? 0, `Book tap target too small on ${route}`).toBeGreaterThanOrEqual(
      44
    );

    await assertNoBrokenImages(page);
  }
});
