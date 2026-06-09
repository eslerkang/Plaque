# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs/01-public-pages.spec.ts >> Terms page >> contains terms content @stateless
- Location: e2e/specs/01-public-pages.spec.ts:60:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /이용약관/i })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: /이용약관/i }) resolved to 2 elements:
    1) <h1 class="font-semibold">이용약관</h1> aka getByRole('heading', { name: '이용약관', exact: true })
    2) <h2 class="text-base font-bold">서비스 이용약관 (한국어)</h2> aka getByRole('heading', { name: '서비스 이용약관 (한국어)' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /이용약관/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link [ref=e5]:
          - /url: /settings
          - img [ref=e6]
        - heading "이용약관" [level=1] [ref=e8]
    - main [ref=e9]:
      - paragraph [ref=e10]: 본 약관은 한국어로 작성되었습니다. For the English version, please see below.
      - generic [ref=e11]:
        - heading "서비스 이용약관 (한국어)" [level=2] [ref=e12]
        - paragraph [ref=e13]: "시행일: 2025년 1월 1일"
        - generic [ref=e14]:
          - generic [ref=e15]:
            - heading "제1조 (목적)" [level=3] [ref=e16]
            - paragraph [ref=e17]: 본 약관은 Plaque(이하 "서비스")가 제공하는 개인 미술 아카이브 서비스의 이용 조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
          - generic [ref=e18]:
            - heading "제2조 (서비스의 성격)" [level=3] [ref=e19]
            - paragraph [ref=e20]:
              - text: Plaque는 이용자가 전시장 및 미술관에서 직접 관람한 미술 작품의 사진과 메모를 기록·보관하는
              - strong [ref=e21]: 개인용 아카이브 서비스
              - text: 입니다. 본 서비스는 소셜 미디어 서비스가 아니며, 이용자의 콘텐츠는 외부에 공개되지 않습니다.
          - generic [ref=e22]:
            - heading "제3조 (저작권 및 이용 범위)" [level=3] [ref=e23]
            - paragraph [ref=e24]: 이용자는 본 서비스를 통해 미술 작품 사진을 기록할 때 다음 사항을 준수해야 합니다.
            - list [ref=e25]:
              - listitem [ref=e26]: 본인이 직접 관람한 작품에 한하여 사진을 기록할 수 있습니다.
              - listitem [ref=e27]:
                - text: 기록된 사진 및 정보는
                - strong [ref=e28]: 개인적인 사용 목적
                - text: (저작권법 제30조 사적이용을 위한 복제)에 한하여만 이용 가능합니다.
              - listitem [ref=e29]: 기록된 미술 작품 이미지를 상업적 목적으로 이용하는 것을 금지합니다.
              - listitem [ref=e30]: 이용자의 이미지는 해당 이용자 계정 내에서만 접근 가능하며 제3자와 공유되지 않습니다.
              - listitem [ref=e31]: 일부 미술관·전시장은 촬영을 금지하거나 제한할 수 있습니다. 이용자는 해당 공간의 촬영 정책을 반드시 확인하고 준수해야 하며, 이로 인한 분쟁에 대해Plaque는 책임을 지지 않습니다.
          - generic [ref=e32]:
            - heading "제4조 (계정 및 보안)" [level=3] [ref=e33]
            - paragraph [ref=e34]: 서비스는 Google OAuth를 통해 로그인합니다. 이용자는 본인 계정의 보안 유지에 책임이 있습니다. 계정 도용 등 보안 문제 발생 시 즉시 서비스에 알려주시기 바랍니다.
          - generic [ref=e35]:
            - heading "제5조 (서비스 변경 및 중단)" [level=3] [ref=e36]
            - paragraph [ref=e37]: Plaque는 서비스의 내용을 변경하거나 중단할 수 있습니다. 중요한 변경이 있을 경우 사전에 공지하며, 이용자의 데이터 내보내기 기회를 제공합니다.
          - generic [ref=e38]:
            - heading "제6조 (면책 조항)" [level=3] [ref=e39]
            - paragraph [ref=e40]: 본 서비스는 "있는 그대로(as-is)" 제공됩니다. Plaque는 서비스 이용으로 인한 데이터 손실, 이미지 손실에 대해 법적으로 허용되는 한도 내에서 책임을 제한합니다. 중요한 데이터는 별도로 백업하시기 바랍니다.
          - generic [ref=e41]:
            - heading "제7조 (준거법)" [level=3] [ref=e42]
            - paragraph [ref=e43]: 본 약관은 대한민국 법률에 따라 해석되며, 분쟁이 발생할 경우 대한민국 법원에 관할권이 있습니다.
      - generic [ref=e45]:
        - heading "Terms of Service (English)" [level=2] [ref=e46]
        - paragraph [ref=e47]: "Effective: 2025년 1월 1일"
        - generic [ref=e48]:
          - generic [ref=e49]:
            - heading "1. Purpose" [level=3] [ref=e50]
            - paragraph [ref=e51]: These Terms govern your use of Plaque, a personal art-archive service, and set out the rights and obligations of all users.
          - generic [ref=e52]:
            - heading "2. Nature of the Service" [level=3] [ref=e53]
            - paragraph [ref=e54]:
              - text: Plaque is a
              - strong [ref=e55]: personal-use archiving tool
              - text: for recording artworks you have viewed in person. It is not a social media platform. Your content is never shared publicly or with other users.
          - generic [ref=e56]:
            - heading "3. Copyright and Permitted Use" [level=3] [ref=e57]
            - paragraph [ref=e58]: "When recording artwork images you agree to the following:"
            - list [ref=e59]:
              - listitem [ref=e60]: You may only record artworks you have personally viewed.
              - listitem [ref=e61]:
                - text: All recorded images and information are for
                - strong [ref=e62]: personal, non-commercial use only
                - text: ", consistent with private copying rights under applicable law (e.g. Article 30 of the Korean Copyright Act; fair use / fair dealing in other jurisdictions)."
              - listitem [ref=e63]: Commercial use of recorded images is strictly prohibited.
              - listitem [ref=e64]: Your images are accessible only within your own account and are never shared with third parties.
              - listitem [ref=e65]: Some venues prohibit photography. You are solely responsible for complying with venue policies; Plaque bears no liability for violations.
          - generic [ref=e66]:
            - heading "4. Accounts and Security" [level=3] [ref=e67]
            - paragraph [ref=e68]: The service uses Google OAuth for authentication. You are responsible for maintaining the security of your account. Please notify us immediately of any unauthorised access.
          - generic [ref=e69]:
            - heading "5. Service Changes and Termination" [level=3] [ref=e70]
            - paragraph [ref=e71]: We may modify or discontinue the service. For significant changes we will give advance notice and offer a data-export opportunity.
          - generic [ref=e72]:
            - heading "6. Disclaimer" [level=3] [ref=e73]
            - paragraph [ref=e74]: The service is provided "as is". To the extent permitted by law, Plaque limits its liability for data loss or service interruptions. Please back up any data you consider important.
          - generic [ref=e75]:
            - heading "7. Governing Law" [level=3] [ref=e76]
            - paragraph [ref=e77]: These Terms are governed by the laws of the Republic of Korea. Disputes shall be resolved in Korean courts. Users outside Korea may also have rights under local consumer-protection laws that these Terms do not override.
      - generic [ref=e78]:
        - link "개인정보처리방침 · Privacy Policy" [ref=e79]:
          - /url: /privacy
        - link "설정으로 돌아가기" [ref=e80]:
          - /url: /settings
  - button "Open Next.js Dev Tools" [ref=e86] [cursor=pointer]:
    - img [ref=e87]
  - alert [ref=e92]
```

# Test source

```ts
  1  | /**
  2  |  * @stateless
  3  |  * Public page rendering — no auth, no Supabase required.
  4  |  * Verifies that all publicly accessible pages render key content.
  5  |  */
  6  | import { test, expect } from "@playwright/test";
  7  | 
  8  | test.describe("Landing page", () => {
  9  |   test("renders headline and CTA @stateless", async ({ page }) => {
  10 |     await page.goto("/");
  11 |     await expect(page.getByRole("heading", { name: "Plaque" })).toBeVisible();
  12 |     await expect(page.getByRole("link", { name: /시작하기/i })).toBeVisible();
  13 |   });
  14 | 
  15 |   test("시작하기 links to /login @stateless", async ({ page }) => {
  16 |     await page.goto("/");
  17 |     const href = await page.getByRole("link", { name: /시작하기/i }).getAttribute("href");
  18 |     expect(href).toBe("/login");
  19 |   });
  20 | 
  21 |   test("shows three feature highlights @stateless", async ({ page }) => {
  22 |     await page.goto("/");
  23 |     await expect(page.getByText("사진 기록")).toBeVisible();
  24 |     await expect(page.getByText("감상 메모")).toBeVisible();
  25 |     await expect(page.getByText("나만의 아카이브")).toBeVisible();
  26 |   });
  27 | });
  28 | 
  29 | test.describe("Login page", () => {
  30 |   test("renders Google sign-in button @stateless", async ({ page }) => {
  31 |     await page.goto("/login");
  32 |     await expect(page.getByRole("button", { name: /Google/i })).toBeVisible();
  33 |   });
  34 | 
  35 |   test("renders terms and privacy links @stateless", async ({ page }) => {
  36 |     await page.goto("/login");
  37 |     await expect(page.getByRole("link", { name: "이용약관" })).toBeVisible();
  38 |     await expect(page.getByRole("link", { name: "개인정보처리방침" })).toBeVisible();
  39 |   });
  40 | 
  41 |   test("terms link points to /terms @stateless", async ({ page }) => {
  42 |     await page.goto("/login");
  43 |     const href = await page.getByRole("link", { name: "이용약관" }).getAttribute("href");
  44 |     expect(href).toBe("/terms");
  45 |   });
  46 | 
  47 |   test("privacy link points to /privacy @stateless", async ({ page }) => {
  48 |     await page.goto("/login");
  49 |     const href = await page.getByRole("link", { name: "개인정보처리방침" }).getAttribute("href");
  50 |     expect(href).toBe("/privacy");
  51 |   });
  52 | });
  53 | 
  54 | test.describe("Terms page", () => {
  55 |   test("renders without error @stateless", async ({ page }) => {
  56 |     const res = await page.goto("/terms");
  57 |     expect(res?.status()).toBe(200);
  58 |   });
  59 | 
  60 |   test("contains terms content @stateless", async ({ page }) => {
  61 |     await page.goto("/terms");
> 62 |     await expect(page.getByRole("heading", { name: /이용약관/i })).toBeVisible();
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  63 |   });
  64 | });
  65 | 
  66 | test.describe("Privacy page", () => {
  67 |   test("renders without error @stateless", async ({ page }) => {
  68 |     const res = await page.goto("/privacy");
  69 |     expect(res?.status()).toBe(200);
  70 |   });
  71 | 
  72 |   test("contains privacy content @stateless", async ({ page }) => {
  73 |     await page.goto("/privacy");
  74 |     await expect(page.getByRole("heading", { name: /개인정보처리방침/i })).toBeVisible();
  75 |   });
  76 | 
  77 |   test("shows correct contact email @stateless", async ({ page }) => {
  78 |     await page.goto("/privacy");
  79 |     await expect(page.getByText("tjkang.kor@gmail.com")).toBeVisible();
  80 |   });
  81 | });
  82 | 
  83 | test.describe("404 page", () => {
  84 |   test("renders custom 404 for unknown routes @stateless", async ({ page }) => {
  85 |     const res = await page.goto("/this-path-does-not-exist-xyz");
  86 |     // Next.js 404 returns 404 status
  87 |     expect(res?.status()).toBe(404);
  88 |   });
  89 | });
  90 | 
```