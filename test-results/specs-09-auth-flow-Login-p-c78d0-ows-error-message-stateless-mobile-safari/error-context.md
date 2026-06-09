# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs/09-auth-flow.spec.ts >> Login page — OAuth button behaviour @stateless >> login?error=auth shows error message @stateless
- Location: e2e/specs/09-auth-flow.spec.ts:50:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/오류|error/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/오류|error/i)

```

```yaml
- main:
  - heading "Plaque" [level=1]
  - paragraph: 나만의 미술관 스크랩북
  - text: 로그인에 실패했습니다. 다시 시도해 주세요.
  - button "Google로 계속하기"
  - paragraph:
    - link "이용약관":
      - /url: /terms
    - text: 및
    - link "개인정보처리방침":
      - /url: /privacy
- alert
```

# Test source

```ts
  1  | /**
  2  |  * Authentication flow E2E tests.
  3  |  *
  4  |  * Tier-1 (@stateless): Redirect behaviour after auth callback.
  5  |  * Tier-2: Full OAuth simulation (not feasible without Google credentials).
  6  |  *
  7  |  * The auth callback (/auth/callback) exchanges a Google OAuth code with
  8  |  * Supabase — this requires a real code and cannot be mocked without a running
  9  |  * Supabase instance.  Tier-1 tests verify the callback route handles invalid
  10 |  * input gracefully.
  11 |  */
  12 | import { test, expect } from "@playwright/test";
  13 | 
  14 | test.describe("Auth callback — error handling @stateless", () => {
  15 |   test("callback with no code redirects to /login?error=auth @stateless", async ({ request }) => {
  16 |     // No code param → should redirect to login with error
  17 |     const res = await request.get("/auth/callback", { maxRedirects: 0 });
  18 |     expect(res.status()).toBeGreaterThanOrEqual(300);
  19 |     const location = res.headers()["location"] ?? "";
  20 |     expect(location).toContain("/login");
  21 |   });
  22 | 
  23 |   test("callback with invalid code redirects to /login?error=auth @stateless", async ({ request }) => {
  24 |     const res = await request.get("/auth/callback?code=invalid_code_xyz", { maxRedirects: 0 });
  25 |     expect(res.status()).toBeGreaterThanOrEqual(300);
  26 |     const location = res.headers()["location"] ?? "";
  27 |     expect(location).toContain("/login");
  28 |   });
  29 | 
  30 |   test("open redirect via next param is blocked @stateless", async ({ request }) => {
  31 |     const res = await request.get("/auth/callback?code=x&next=//evil.com", { maxRedirects: 0 });
  32 |     // Either error redirect or safe redirect — must not go to evil.com
  33 |     const location = res.headers()["location"] ?? "";
  34 |     expect(location).not.toContain("evil.com");
  35 |   });
  36 | 
  37 |   test("open redirect via absolute URL is blocked @stateless", async ({ request }) => {
  38 |     const res = await request.get("/auth/callback?code=x&next=https://evil.com", { maxRedirects: 0 });
  39 |     const location = res.headers()["location"] ?? "";
  40 |     expect(location).not.toContain("evil.com");
  41 |   });
  42 | });
  43 | 
  44 | test.describe("Login page — OAuth button behaviour @stateless", () => {
  45 |   test("login page renders without auth error @stateless", async ({ page }) => {
  46 |     const res = await page.goto("/login");
  47 |     expect(res?.status()).toBe(200);
  48 |   });
  49 | 
  50 |   test("login?error=auth shows error message @stateless", async ({ page }) => {
  51 |     await page.goto("/login?error=auth");
  52 |     // Error state should be visible
> 53 |     await expect(page.getByText(/오류|error/i)).toBeVisible();
     |                                               ^ Error: expect(locator).toBeVisible() failed
  54 |   });
  55 | 
  56 |   test("Google OAuth button is present and clickable @stateless", async ({ page }) => {
  57 |     await page.goto("/login");
  58 |     const btn = page.getByRole("button", { name: /Google/i });
  59 |     await expect(btn).toBeVisible();
  60 |     await expect(btn).not.toBeDisabled();
  61 |   });
  62 | });
  63 | 
```