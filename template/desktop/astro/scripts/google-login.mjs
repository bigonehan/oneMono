import { chromium } from "playwright";

const email = process.env.GOOGLE_EMAIL ?? "";
const password = process.env.GOOGLE_PASSWORD ?? "";
const headless = process.env.PW_HEADLESS !== "false";

const log = (message) => {
  console.log(message);
};

const run = async () => {
  const browser = await chromium.launch({ headless, slowMo: 120 });
  const page = await browser.newPage();

  try {
    log("launch: chromium");
    await page.goto("https://accounts.google.com/signin", { waitUntil: "domcontentloaded", timeout: 60_000 });
    log("navigate: accounts.google.com/signin");

    if (!email || !password) {
      log("credential: GOOGLE_EMAIL / GOOGLE_PASSWORD 미설정");
      await page.waitForTimeout(5_000);
      await browser.close();
      return;
    }

    await page.getByLabel("Email or phone").fill(email);
    log("interact: fill email");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByLabel("Enter your password").waitFor({ timeout: 25_000 });
    await page.getByLabel("Enter your password").fill(password);
    log("interact: fill password");
    await page.getByRole("button", { name: "Next" }).click();

    await page.waitForTimeout(4_000);
    log(`result_url: ${page.url()}`);
    await browser.close();
  } catch (error) {
    await browser.close();
    console.error(`automation_error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

await run();
