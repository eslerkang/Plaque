# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs/01-public-pages.spec.ts >> Privacy page >> contains privacy content @stateless
- Location: e2e/specs/01-public-pages.spec.ts:72:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /개인정보처리방침/i })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: /개인정보처리방침/i }) resolved to 2 elements:
    1) <h1 class="font-semibold">개인정보처리방침</h1> aka getByRole('heading', { name: '개인정보처리방침', exact: true })
    2) <h2 class="text-base font-bold">개인정보처리방침 (한국어)</h2> aka getByRole('heading', { name: '개인정보처리방침 (한국어)' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /개인정보처리방침/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link [ref=e5] [cursor=pointer]:
          - /url: /settings
          - img [ref=e6]
        - heading "개인정보처리방침" [level=1] [ref=e8]
    - main [ref=e9]:
      - paragraph [ref=e10]: 본 방침은 한국어로 작성되었습니다. For the English version, please see below.
      - generic [ref=e11]:
        - heading "개인정보처리방침 (한국어)" [level=2] [ref=e12]
        - paragraph [ref=e13]: "시행일: 2025년 1월 1일"
        - generic [ref=e14]:
          - generic [ref=e15]:
            - heading "1. 수집하는 개인정보" [level=3] [ref=e16]
            - list [ref=e17]:
              - listitem [ref=e18]: 이름 및 이메일 주소 (Google OAuth 로그인 시 자동 수집)
              - listitem [ref=e19]: 이용자가 직접 입력한 작품 정보 (제목, 작가, 방문일, 메모 등)
              - listitem [ref=e20]: 이용자가 업로드한 작품 사진
              - listitem [ref=e21]: 서비스 이용 기록 (로그인 시각 등 서버 로그)
          - generic [ref=e22]:
            - heading "2. 개인정보의 이용 목적" [level=3] [ref=e23]
            - list [ref=e24]:
              - listitem [ref=e25]: 계정 인증 및 서비스 제공
              - listitem [ref=e26]: 이용자 데이터의 저장·조회 기능 제공
              - listitem [ref=e27]: 서비스 오류 해결 및 품질 개선
            - paragraph [ref=e28]: 이용자의 개인정보는 광고·마케팅 목적으로 사용되지 않으며, 제3자에게 판매되지 않습니다.
          - generic [ref=e29]:
            - heading "3. 개인정보의 보관 및 보호" [level=3] [ref=e30]
            - paragraph [ref=e31]: 데이터는 Supabase(미국 소재 서버)에 암호화되어 저장됩니다. 이미지는 비공개(private) 스토리지 버킷에 보관되며, 이용자 본인만 접근 가능합니다. 서비스는 행 수준 보안(RLS)을 적용하여 타 이용자의 데이터 접근을 차단합니다.
          - generic [ref=e32]:
            - heading "4. 개인정보의 보유·이용 기간" [level=3] [ref=e33]
            - paragraph [ref=e34]: 계정 삭제 요청 시 모든 개인정보 및 작품 데이터가 삭제됩니다. 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
          - generic [ref=e35]:
            - heading "5. 제3자 제공" [level=3] [ref=e36]
            - paragraph [ref=e37]: Plaque는 법적 의무가 있는 경우를 제외하고 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            - paragraph [ref=e38]: "서비스 운영에 사용되는 제3자 서비스: Google (인증), Supabase (데이터베이스·스토리지), Vercel (호스팅). 각 서비스의 개인정보처리방침을 확인하시기 바랍니다."
          - generic [ref=e39]:
            - heading "6. 이용자의 권리" [level=3] [ref=e40]
            - paragraph [ref=e41]: 이용자는 다음 권리를 갖습니다.
            - list [ref=e42]:
              - listitem [ref=e43]: 개인정보 열람·수정·삭제 요청권
              - listitem [ref=e44]: 개인정보 처리 정지 요청권
              - listitem [ref=e45]: 데이터 이동권 (PDF 내보내기 기능 제공)
            - paragraph [ref=e46]:
              - text: 권리 행사는
              - link "tjkang.kor@gmail.com" [ref=e47] [cursor=pointer]:
                - /url: mailto:tjkang.kor@gmail.com
              - text: 으로 문의하시기 바랍니다.
          - generic [ref=e48]:
            - heading "7. 쿠키 및 추적" [level=3] [ref=e49]
            - paragraph [ref=e50]: 서비스는 로그인 세션 유지를 위해 세션 쿠키를 사용합니다. 광고·추적 쿠키는 사용하지 않습니다.
          - generic [ref=e51]:
            - heading "8. 개인정보보호 책임자" [level=3] [ref=e52]
            - paragraph [ref=e53]:
              - text: 개인정보 관련 문의는
              - link "tjkang.kor@gmail.com" [ref=e54] [cursor=pointer]:
                - /url: mailto:tjkang.kor@gmail.com
              - text: 로 연락주십시오.
            - paragraph [ref=e55]: 한국 이용자의 경우 개인정보보호위원회(privacy.go.kr)에 피해 신청을 하실 수 있습니다.
          - generic [ref=e56]:
            - heading "9. 방침 변경" [level=3] [ref=e57]
            - paragraph [ref=e58]: 본 방침이 변경되는 경우 변경 사항을 서비스 내 공지를 통해 안내합니다. 중요한 변경의 경우 이메일로 별도 안내합니다.
      - generic [ref=e60]:
        - heading "Privacy Policy (English)" [level=2] [ref=e61]
        - paragraph [ref=e62]: "Effective: 2025년 1월 1일"
        - generic [ref=e63]:
          - generic [ref=e64]:
            - heading "1. Data We Collect" [level=3] [ref=e65]
            - list [ref=e66]:
              - listitem [ref=e67]: Name and email address (via Google OAuth at sign-in)
              - listitem [ref=e68]: Artwork metadata you enter (title, artist, visit date, notes, etc.)
              - listitem [ref=e69]: Artwork photos you upload
              - listitem [ref=e70]: Basic server logs (login timestamps, error logs)
          - generic [ref=e71]:
            - heading "2. How We Use Your Data" [level=3] [ref=e72]
            - list [ref=e73]:
              - listitem [ref=e74]: To authenticate you and provide the service
              - listitem [ref=e75]: To store and retrieve your artwork records
              - listitem [ref=e76]: To diagnose errors and improve quality
            - paragraph [ref=e77]: We do not use your data for advertising or marketing, and we never sell it.
          - generic [ref=e78]:
            - heading "3. Storage and Security" [level=3] [ref=e79]
            - paragraph [ref=e80]: Data is stored encrypted on Supabase servers (US-based). Images are kept in a private storage bucket accessible only by you. Row-Level Security (RLS) prevents any user from accessing another user's data.
          - generic [ref=e81]:
            - heading "4. Data Retention" [level=3] [ref=e82]
            - paragraph [ref=e83]: All personal data and artwork records are deleted upon account deletion. We retain data only as long as required by applicable law.
          - generic [ref=e84]:
            - heading "5. Third-Party Sharing" [level=3] [ref=e85]
            - paragraph [ref=e86]: We do not share your personal data with third parties except where required by law.
            - paragraph [ref=e87]: "Sub-processors used to operate the service: Google (authentication), Supabase (database & storage), Vercel (hosting). Please review their respective privacy policies."
          - generic [ref=e88]:
            - heading "6. Your Rights" [level=3] [ref=e89]
            - paragraph [ref=e90]: "You have the right to:"
            - list [ref=e91]:
              - listitem [ref=e92]: Access, correct, or delete your personal data
              - listitem [ref=e93]: Object to or restrict processing
              - listitem [ref=e94]: Data portability (use the PDF export feature, or contact us)
            - paragraph [ref=e95]:
              - text: To exercise these rights contact
              - link "tjkang.kor@gmail.com" [ref=e96] [cursor=pointer]:
                - /url: mailto:tjkang.kor@gmail.com
              - text: .
            - paragraph [ref=e97]: EU/EEA users may also lodge a complaint with their local supervisory authority. UK users may contact the ICO (ico.org.uk).
          - generic [ref=e98]:
            - heading "7. Cookies" [level=3] [ref=e99]
            - paragraph [ref=e100]: We use session cookies solely to keep you logged in. We do not use advertising or tracking cookies.
          - generic [ref=e101]:
            - heading "8. Data Controller" [level=3] [ref=e102]
            - paragraph [ref=e103]:
              - text: For privacy enquiries contact
              - link "tjkang.kor@gmail.com" [ref=e104] [cursor=pointer]:
                - /url: mailto:tjkang.kor@gmail.com
              - text: .
          - generic [ref=e105]:
            - heading "9. Changes to This Policy" [level=3] [ref=e106]
            - paragraph [ref=e107]: We will notify you of material changes via in-app notice or email before they take effect.
      - generic [ref=e108]:
        - link "이용약관 · Terms of Service" [ref=e109] [cursor=pointer]:
          - /url: /terms
        - link "설정으로 돌아가기" [ref=e110] [cursor=pointer]:
          - /url: /settings
  - button "Open Next.js Dev Tools" [ref=e116] [cursor=pointer]:
    - img [ref=e117]
  - alert [ref=e120]
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
  62 |     await expect(page.getByRole("heading", { name: /이용약관/i })).toBeVisible();
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
> 74 |     await expect(page.getByRole("heading", { name: /개인정보처리방침/i })).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
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