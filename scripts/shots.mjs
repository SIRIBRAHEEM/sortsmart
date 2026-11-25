// Screenshot + smoke-test script for SortSmart (production build).
// Usage: node scripts/shots.mjs   (serves dist/ itself on port 4399)
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const DIST = new URL("../dist", import.meta.url).pathname;
const DOCS = new URL("../docs", import.meta.url).pathname;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/") p = "/index.html";
  try {
    const data = await readFile(join(DIST, p));
    res.writeHead(200, { "Content-Type": MIME[extname(p)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
await new Promise((r) => server.listen(4399, r));

const browser = await chromium.launch({
  executablePath: "/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome",
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:4399/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

// 1. Lookup with a search typed
await page.fill('input[type="text"]', "bottle");
await page.waitForTimeout(400);
await page.screenshot({ path: join(DOCS, "lookup.png") });

// 2. Item detail (battery, hazardous)
await page.fill('input[type="text"]', "battery");
await page.waitForTimeout(300);
await page.click('button:has-text("Old battery")');
await page.waitForTimeout(400);
await page.screenshot({ path: join(DOCS, "detail.png") });

// 3. Quiz, answer one question
await page.click('button:has-text("Sorting quiz")');
await page.waitForTimeout(500);
const options = page.locator("main button").filter({ hasText: /Recyclable|Organic|Hazardous|General/ });
await options.first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: join(DOCS, "quiz.png") });

// 4. Waste log with a few entries added
await page.click('button:has-text("My waste log")');
await page.waitForTimeout(400);
for (const name of ["Plastic water bottle", "Yam peels", "Plastic water bottle", "Old battery (AA, AAA, phone battery)", "Styrofoam food pack"]) {
  await page.selectOption("#log-item", { label: new RegExp(name.replace(/[()]/g, "\\$&")) }).catch(async () => {
    await page.selectOption("#log-item", name);
  });
  await page.click('button:has-text("Add to log")');
  await page.waitForTimeout(200);
}
await page.waitForTimeout(400);
await page.screenshot({ path: join(DOCS, "log.png") });

// 5. Guide
await page.click('button:has-text("Guide")');
await page.waitForTimeout(500);
await page.screenshot({ path: join(DOCS, "guide.png") });

// 6. Mobile lookup
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => { if (m.type() === "error") errors.push("mobile: " + m.text()); });
mobile.on("pageerror", (e) => errors.push("mobile: " + String(e)));
await mobile.goto("http://localhost:4399/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: join(DOCS, "mobile.png") });

await browser.close();
server.close();
console.log("screenshots done");
console.log("console errors:", errors.length ? errors : "none");
process.exit(errors.length ? 1 : 0);
