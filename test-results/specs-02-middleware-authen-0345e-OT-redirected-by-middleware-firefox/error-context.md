# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs/02-middleware.spec.ts >> authenticated + consented — protected routes pass through @stateless >> GET /scrapbook with session+consent is NOT redirected by middleware
- Location: e2e/specs/02-middleware.spec.ts:76:9

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "/login"
Received string:        "/login"
```

# Test source

```ts
  1   | /**
  2   |  * @stateless
  3   |  * Middleware route-protection tests — uses HTTP requests and cookie injection only.
  4   |  * No Supabase connection required: middleware only checks cookie *presence*.
  5   |  *
  6   |  * Covers every branch in src/middleware.ts.
  7   |  */
  8   | import { test, expect } from "@playwright/test";
  9   | import { setCookies, SESSION_COOKIE, CONSENT_COOKIE } from "../helpers/auth";
  10  | 
  11  | // ---------------------------------------------------------------------------
  12  | // 1. Unauthenticated → /login
  13  | // ---------------------------------------------------------------------------
  14  | const PROTECTED_PATHS = [
  15  |   "/scrapbook",
  16  |   "/scrapbook/new",
  17  |   "/scrapbook/some-uuid-here",
  18  |   "/search",
  19  |   "/search?q=monet",
  20  |   "/settings",
  21  |   "/settings/profile",
  22  |   "/scrapbook/export",
  23  | ];
  24  | 
  25  | test.describe("unauthenticated user — protected routes redirect to /login @stateless", () => {
  26  |   for (const path of PROTECTED_PATHS) {
  27  |     test(`GET ${path} → /login`, async ({ request }) => {
  28  |       const res = await request.get(path, { maxRedirects: 0 });
  29  |       expect(res.status()).toBeGreaterThanOrEqual(300);
  30  |       expect(res.status()).toBeLessThan(400);
  31  |       expect(res.headers()["location"]).toContain("/login");
  32  |     });
  33  |   }
  34  | });
  35  | 
  36  | // ---------------------------------------------------------------------------
  37  | // 2. Unauthenticated — public routes pass through
  38  | // ---------------------------------------------------------------------------
  39  | const PUBLIC_PATHS = ["/", "/login", "/terms", "/privacy", "/consent"];
  40  | 
  41  | test.describe("unauthenticated user — public routes pass through @stateless", () => {
  42  |   for (const path of PUBLIC_PATHS) {
  43  |     test(`GET ${path} is NOT redirected to /login`, async ({ request }) => {
  44  |       const res = await request.get(path, { maxRedirects: 0 });
  45  |       const location = res.headers()["location"] ?? "";
  46  |       expect(location).not.toContain("/login");
  47  |     });
  48  |   }
  49  | });
  50  | 
  51  | // ---------------------------------------------------------------------------
  52  | // 3. Authenticated + no consent → /consent
  53  | // ---------------------------------------------------------------------------
  54  | const PROTECTED_NO_CONSENT = ["/scrapbook", "/search", "/settings"];
  55  | 
  56  | test.describe("authenticated + no consent → /consent @stateless", () => {
  57  |   for (const path of PROTECTED_NO_CONSENT) {
  58  |     test(`GET ${path} with session but no consent cookie → /consent`, async ({ page, request }) => {
  59  |       // Inject only the session cookie (no consent)
  60  |       await setCookies(page, { session: true });
  61  |       const res = await page.request.get(path, { maxRedirects: 0 });
  62  |       expect(res.status()).toBeGreaterThanOrEqual(300);
  63  |       expect(res.headers()["location"]).toContain("/consent");
  64  |     });
  65  |   }
  66  | });
  67  | 
  68  | // ---------------------------------------------------------------------------
  69  | // 4. Authenticated + consented → passes through (no redirect)
  70  | // ---------------------------------------------------------------------------
  71  | test.describe("authenticated + consented — protected routes pass through @stateless", () => {
  72  |   // We still get a 200 or server error (Supabase might reject the fake JWT),
  73  |   // but crucially middleware must NOT redirect to /login or /consent.
  74  |   const paths = ["/scrapbook", "/search", "/settings"];
  75  |   for (const path of paths) {
  76  |     test(`GET ${path} with session+consent is NOT redirected by middleware`, async ({ page }) => {
  77  |       await setCookies(page, { session: true, consent: true });
  78  |       const res = await page.request.get(path, { maxRedirects: 0 });
  79  |       const location = res.headers()["location"] ?? "";
  80  |       // Middleware should not redirect to /login or /consent
> 81  |       expect(location).not.toContain("/login");
      |                            ^ Error: expect(received).not.toContain(expected) // indexOf
  82  |       expect(location).not.toContain("/consent");
  83  |     });
  84  |   }
  85  | });
  86  | 
  87  | // ---------------------------------------------------------------------------
  88  | // 5. Authenticated + consented visiting /login → /scrapbook
  89  | // ---------------------------------------------------------------------------
  90  | test("authenticated + consented visiting /login is redirected to /scrapbook @stateless", async ({ page }) => {
  91  |   await setCookies(page, { session: true, consent: true });
  92  |   const res = await page.request.get("/login", { maxRedirects: 0 });
  93  |   expect(res.status()).toBeGreaterThanOrEqual(300);
  94  |   expect(res.headers()["location"]).toContain("/scrapbook");
  95  | });
  96  | 
  97  | // ---------------------------------------------------------------------------
  98  | // 6. /consent is accessible (not redirected) even with session but no consent
  99  | // ---------------------------------------------------------------------------
  100 | test("/consent is NOT blocked when authenticated but missing consent cookie @stateless", async ({ page }) => {
  101 |   await setCookies(page, { session: true });
  102 |   const res = await page.request.get("/consent", { maxRedirects: 0 });
  103 |   // Should not redirect back to /consent (infinite loop) or to /login
  104 |   const location = res.headers()["location"] ?? "";
  105 |   expect(location).not.toContain("/consent");
  106 |   expect(location).not.toContain("/login");
  107 | });
  108 | 
  109 | // ---------------------------------------------------------------------------
  110 | // 7. Chunked session cookie (sb-*-auth-token.0, .1) is recognised
  111 | // ---------------------------------------------------------------------------
  112 | test("chunked session cookies trigger consent redirect for protected routes @stateless", async ({ page }) => {
  113 |   // Playwright cookie injection: chunked token format
  114 |   await page.context().addCookies([
  115 |     {
  116 |       name: `${SESSION_COOKIE}.0`,
  117 |       value: "chunk-part-0",
  118 |       domain: "localhost",
  119 |       path: "/",
  120 |       httpOnly: false,
  121 |       secure: false,
  122 |       sameSite: "Lax",
  123 |     },
  124 |     {
  125 |       name: `${SESSION_COOKIE}.1`,
  126 |       value: "chunk-part-1",
  127 |       domain: "localhost",
  128 |       path: "/",
  129 |       httpOnly: false,
  130 |       secure: false,
  131 |       sameSite: "Lax",
  132 |     },
  133 |   ]);
  134 |   const res = await page.request.get("/scrapbook", { maxRedirects: 0 });
  135 |   expect(res.status()).toBeGreaterThanOrEqual(300);
  136 |   expect(res.headers()["location"]).toContain("/consent");
  137 | });
  138 | 
  139 | // ---------------------------------------------------------------------------
  140 | // 8. Query params do not bypass protection
  141 | // ---------------------------------------------------------------------------
  142 | test("query params do not bypass protection @stateless", async ({ request }) => {
  143 |   const res = await request.get("/scrapbook?bypass=true&admin=1", { maxRedirects: 0 });
  144 |   expect(res.headers()["location"]).toContain("/login");
  145 | });
  146 | 
  147 | // ---------------------------------------------------------------------------
  148 | // 9. Static assets are not intercepted
  149 | // ---------------------------------------------------------------------------
  150 | test("/_next/static paths are not intercepted by middleware @stateless", async ({ request }) => {
  151 |   // Next.js static files matcher excludes _next/static — they should not redirect
  152 |   const res = await request.get("/_next/static/chunks/main.js", { maxRedirects: 0 });
  153 |   // Either 200 (file exists) or 404 (doesn't exist in test), but NOT a redirect to /login
  154 |   const location = res.headers()["location"] ?? "";
  155 |   expect(location).not.toContain("/login");
  156 | });
  157 | 
  158 | // ---------------------------------------------------------------------------
  159 | // 10. Open redirect prevention in consent cookie name
  160 | // ---------------------------------------------------------------------------
  161 | test("plaque_terms cookie with value '0' does NOT grant access @stateless", async ({ page }) => {
  162 |   // Inject session cookie + invalid consent cookie value
  163 |   await setCookies(page, { session: true });
  164 |   await page.context().addCookies([{
  165 |     name: CONSENT_COOKIE,
  166 |     value: "0",       // wrong value — middleware uses .has() not value check
  167 |     domain: "localhost",
  168 |     path: "/",
  169 |     httpOnly: true,
  170 |     secure: false,
  171 |     sameSite: "Lax",
  172 |   }]);
  173 |   // Middleware uses cookies.has("plaque_terms") — presence only, value irrelevant
  174 |   // So "0" still satisfies has() → should pass through
  175 |   const res = await page.request.get("/scrapbook", { maxRedirects: 0 });
  176 |   const location = res.headers()["location"] ?? "";
  177 |   expect(location).not.toContain("/consent");
  178 | });
  179 | 
```