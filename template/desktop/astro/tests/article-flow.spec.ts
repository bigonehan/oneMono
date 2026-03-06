import { expect, test } from "@playwright/test";

test("sidebar button triggers google login workflow state change", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("app-ready")).toHaveText("ready");
  await expect(page.getByTestId("status-badge")).toHaveText("IDLE");
  await page.getByTestId("login-trigger").click({ force: true });
  await expect(page.getByTestId("status-badge")).toHaveText("SUCCESS");
  await expect(page.getByTestId("status-logs")).toContainText("UI trigger: runGoogleLogin");
});
