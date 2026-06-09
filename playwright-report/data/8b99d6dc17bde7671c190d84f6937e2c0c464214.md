# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs/03-consent-ui.spec.ts >> Consent page — accessibility @stateless >> /consent is publicly accessible (no redirect) @stateless
- Location: e2e/specs/03-consent-ui.spec.ts:15:7

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "/login"
Received string:        "/login"
```

# Test source

```ts
  1  | /**
  2  |  * @stateless
  3  |  * Consent page UI tests — verifies form rendering and checkbox interactions.
  4  |  * The page itself requires Supabase auth to render data, but the UI structure
  5  |  * is verifiable by checking for form elements after the page loads.
  6  |  *
  7  |  * Note: Without real Supabase creds, the server redirects to /login.
  8  |  * These tests verify the page is accessible when session is valid (tier-1)
  9  |  * and the UI renders correctly (tier-2 with real creds).
  10 |  */
  11 | import { test, expect } from "@playwright/test";
  12 | import { setCookies, hasRealCreds } from "../helpers/auth";
  13 | 
  14 | test.describe("Consent page — accessibility @stateless", () => {
  15 |   test("/consent is publicly accessible (no redirect) @stateless", async ({ request }) => {
  16 |     const res = await request.get("/consent", { maxRedirects: 0 });
  17 |     // Should not redirect to /login (public path)
  18 |     const location = res.headers()["location"] ?? "";
> 19 |     expect(location).not.toContain("/login");
     |                          ^ Error: expect(received).not.toContain(expected) // indexOf
  20 |   });
  21 | 
  22 |   test("/consent with session cookie doesn't loop @stateless", async ({ page }) => {
  23 |     await setCookies(page, { session: true });
  24 |     const res = await page.request.get("/consent", { maxRedirects: 0 });
  25 |     const location = res.headers()["location"] ?? "";
  26 |     expect(location).not.toBe("/consent");
  27 |     expect(location).not.toContain("/api/restore-consent");
  28 |   });
  29 | });
  30 | 
  31 | // Tier-2: requires real Supabase session
  32 | test.describe("Consent page — form UI (requires auth)", () => {
  33 |   test.skip(!hasRealCreds, "Requires E2E_TEST_EMAIL + E2E_TEST_PASSWORD");
  34 | 
  35 |   test("renders two checkboxes and submit button", async ({ page }) => {
  36 |     await page.goto("/consent");
  37 |     await expect(page.getByRole("checkbox")).toHaveCount(2);
  38 |     await expect(page.getByRole("button", { name: /동의하고 시작하기/i })).toBeVisible();
  39 |   });
  40 | 
  41 |   test("submit button is disabled until both checkboxes are checked", async ({ page }) => {
  42 |     await page.goto("/consent");
  43 |     const btn = page.getByRole("button", { name: /동의하고 시작하기/i });
  44 |     await expect(btn).toBeDisabled();
  45 | 
  46 |     const checkboxes = page.getByRole("checkbox");
  47 |     await checkboxes.nth(0).check();
  48 |     await expect(btn).toBeDisabled();
  49 | 
  50 |     await checkboxes.nth(1).check();
  51 |     await expect(btn).toBeEnabled();
  52 |   });
  53 | 
  54 |   test("terms link opens /terms", async ({ page }) => {
  55 |     await page.goto("/consent");
  56 |     const termsLink = page.getByRole("link", { name: "이용약관" });
  57 |     const href = await termsLink.getAttribute("href");
  58 |     expect(href).toBe("/terms");
  59 |   });
  60 | 
  61 |   test("privacy link opens /privacy", async ({ page }) => {
  62 |     await page.goto("/consent");
  63 |     const privacyLink = page.getByRole("link", { name: "개인정보처리방침" });
  64 |     const href = await privacyLink.getAttribute("href");
  65 |     expect(href).toBe("/privacy");
  66 |   });
  67 | });
  68 | 
```