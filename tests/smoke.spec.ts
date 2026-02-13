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
