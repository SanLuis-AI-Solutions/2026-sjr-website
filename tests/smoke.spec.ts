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
    assertNoErrors: () => {
      expect(errors, errors.join("\n")).toEqual([]);
    },
  };
}

test("mobile smoke: services -> home -> watch repair -> quote", async ({ page }) => {
  const guard = attachConsoleGuards(page);

  await page.goto("/services", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { name: /A curated menu of in-house repairs/i })
  ).toBeVisible();

  // Client-side nav to Home.
  await page
    .getByRole("link", { name: /Susie’s Jewelry Repair/i })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: /Your jewelry never leaves our hands/i })
  ).toBeVisible();

  // Service detail should render reliably after navigation.
  await page.goto("/services/watch-repair", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { level: 1, name: /Watch Repair/i })
  ).toBeVisible();

  // Quote CTA should always lead to the form.
  await page.getByRole("link", { name: /Get Fast Quote/i }).first().click();
  await expect(
    page.getByRole("heading", { name: /Get a transparent starting/i })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Submit Fast Quote/i })).toBeVisible();

  guard.assertNoErrors();
});
