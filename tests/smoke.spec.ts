import { expect, test } from "@playwright/test";

function attachConsoleGuards(page: any) {
  const errors: string[] = [];

  page.on("pageerror", (err: Error) => {
    errors.push(`pageerror: ${err?.message || String(err)}`);
  });

  page.on("console", (msg: any) => {
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

async function assertHomeRenders(page: any) {
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
