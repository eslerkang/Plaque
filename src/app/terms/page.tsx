import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "이용약관 | Plaque",
};

const EFFECTIVE_DATE = "2025년 1월 1일";
const COMPANY = "Plaque";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-2xl mx-auto">
          <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold">이용약관</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Language note */}
        <p className="text-xs text-muted-foreground mb-6">
          본 약관은 한국어로 작성되었습니다. For the English version, please see below.
        </p>

        {/* Korean */}
        <section className="prose prose-sm max-w-none space-y-6 text-sm leading-relaxed text-foreground">
          <h2 className="text-base font-bold">서비스 이용약관 (한국어)</h2>
          <p className="text-xs text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-1">제1조 (목적)</h3>
              <p>
                본 약관은 {COMPANY}(이하 &quot;서비스&quot;)가 제공하는 개인 미술 아카이브 서비스의
                이용 조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">제2조 (서비스의 성격)</h3>
              <p>
                {COMPANY}는 이용자가 전시장 및 미술관에서 직접 관람한 미술 작품의 사진과
                메모를 기록·보관하는 <strong>개인용 아카이브 서비스</strong>입니다.
                본 서비스는 소셜 미디어 서비스가 아니며, 이용자의 콘텐츠는 외부에 공개되지 않습니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">제3조 (저작권 및 이용 범위)</h3>
              <p>
                이용자는 본 서비스를 통해 미술 작품 사진을 기록할 때 다음 사항을 준수해야 합니다.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>본인이 직접 관람한 작품에 한하여 사진을 기록할 수 있습니다.</li>
                <li>
                  기록된 사진 및 정보는 <strong>개인적인 사용 목적</strong>(저작권법 제30조
                  사적이용을 위한 복제)에 한하여만 이용 가능합니다.
                </li>
                <li>기록된 미술 작품 이미지를 상업적 목적으로 이용하는 것을 금지합니다.</li>
                <li>이용자의 이미지는 해당 이용자 계정 내에서만 접근 가능하며 제3자와 공유되지 않습니다.</li>
                <li>
                  일부 미술관·전시장은 촬영을 금지하거나 제한할 수 있습니다. 이용자는
                  해당 공간의 촬영 정책을 반드시 확인하고 준수해야 하며, 이로 인한 분쟁에 대해
                  {COMPANY}는 책임을 지지 않습니다.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1">제4조 (계정 및 보안)</h3>
              <p>
                서비스는 Google OAuth를 통해 로그인합니다. 이용자는 본인 계정의 보안 유지에
                책임이 있습니다. 계정 도용 등 보안 문제 발생 시 즉시 서비스에 알려주시기 바랍니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">제5조 (서비스 변경 및 중단)</h3>
              <p>
                {COMPANY}는 서비스의 내용을 변경하거나 중단할 수 있습니다. 중요한 변경이 있을 경우
                사전에 공지하며, 이용자의 데이터 내보내기 기회를 제공합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">제6조 (면책 조항)</h3>
              <p>
                본 서비스는 &quot;있는 그대로(as-is)&quot; 제공됩니다. {COMPANY}는 서비스 이용으로 인한
                데이터 손실, 이미지 손실에 대해 법적으로 허용되는 한도 내에서 책임을 제한합니다.
                중요한 데이터는 별도로 백업하시기 바랍니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">제7조 (준거법)</h3>
              <p>
                본 약관은 대한민국 법률에 따라 해석되며, 분쟁이 발생할 경우 대한민국 법원에
                관할권이 있습니다.
              </p>
            </div>
          </div>
        </section>

        <div className="my-10 h-px bg-border" />

        {/* English */}
        <section className="space-y-6 text-sm leading-relaxed text-foreground">
          <h2 className="text-base font-bold">Terms of Service (English)</h2>
          <p className="text-xs text-muted-foreground">Effective: {EFFECTIVE_DATE}</p>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-1">1. Purpose</h3>
              <p>
                These Terms govern your use of {COMPANY}, a personal art-archive service,
                and set out the rights and obligations of all users.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">2. Nature of the Service</h3>
              <p>
                {COMPANY} is a <strong>personal-use archiving tool</strong> for recording
                artworks you have viewed in person. It is not a social media platform. Your
                content is never shared publicly or with other users.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">3. Copyright and Permitted Use</h3>
              <p>When recording artwork images you agree to the following:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>You may only record artworks you have personally viewed.</li>
                <li>
                  All recorded images and information are for <strong>personal,
                  non-commercial use only</strong>, consistent with private copying
                  rights under applicable law (e.g. Article 30 of the Korean Copyright Act;
                  fair use / fair dealing in other jurisdictions).
                </li>
                <li>Commercial use of recorded images is strictly prohibited.</li>
                <li>
                  Your images are accessible only within your own account and are never
                  shared with third parties.
                </li>
                <li>
                  Some venues prohibit photography. You are solely responsible for
                  complying with venue policies; {COMPANY} bears no liability for
                  violations.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1">4. Accounts and Security</h3>
              <p>
                The service uses Google OAuth for authentication. You are responsible for
                maintaining the security of your account. Please notify us immediately of
                any unauthorised access.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">5. Service Changes and Termination</h3>
              <p>
                We may modify or discontinue the service. For significant changes we will
                give advance notice and offer a data-export opportunity.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">6. Disclaimer</h3>
              <p>
                The service is provided &quot;as is&quot;. To the extent permitted by law, {COMPANY}{" "}
                limits its liability for data loss or service interruptions. Please back up
                any data you consider important.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">7. Governing Law</h3>
              <p>
                These Terms are governed by the laws of the Republic of Korea. Disputes
                shall be resolved in Korean courts. Users outside Korea may also have
                rights under local consumer-protection laws that these Terms do not override.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 pt-4 border-t border-border flex gap-6 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            개인정보처리방침 · Privacy Policy
          </Link>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            설정으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
