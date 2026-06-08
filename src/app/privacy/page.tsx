import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "개인정보처리방침 | Plaque",
};

const EFFECTIVE_DATE = "2025년 1월 1일";
const COMPANY = "Plaque";
const CONTACT_EMAIL = "privacy@plaque.app";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-2xl mx-auto">
          <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold">개인정보처리방침</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <p className="text-xs text-muted-foreground mb-6">
          본 방침은 한국어로 작성되었습니다. For the English version, please see below.
        </p>

        {/* Korean */}
        <section className="space-y-6 text-sm leading-relaxed text-foreground">
          <h2 className="text-base font-bold">개인정보처리방침 (한국어)</h2>
          <p className="text-xs text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-1">1. 수집하는 개인정보</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>이름 및 이메일 주소 (Google OAuth 로그인 시 자동 수집)</li>
                <li>이용자가 직접 입력한 작품 정보 (제목, 작가, 방문일, 메모 등)</li>
                <li>이용자가 업로드한 작품 사진</li>
                <li>서비스 이용 기록 (로그인 시각 등 서버 로그)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1">2. 개인정보의 이용 목적</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>계정 인증 및 서비스 제공</li>
                <li>이용자 데이터의 저장·조회 기능 제공</li>
                <li>서비스 오류 해결 및 품질 개선</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                이용자의 개인정보는 광고·마케팅 목적으로 사용되지 않으며, 제3자에게 판매되지 않습니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">3. 개인정보의 보관 및 보호</h3>
              <p>
                데이터는 Supabase(미국 소재 서버)에 암호화되어 저장됩니다. 이미지는
                비공개(private) 스토리지 버킷에 보관되며, 이용자 본인만 접근 가능합니다.
                서비스는 행 수준 보안(RLS)을 적용하여 타 이용자의 데이터 접근을 차단합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">4. 개인정보의 보유·이용 기간</h3>
              <p>
                계정 삭제 요청 시 모든 개인정보 및 작품 데이터가 삭제됩니다.
                법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">5. 제3자 제공</h3>
              <p>
                {COMPANY}는 법적 의무가 있는 경우를 제외하고 이용자의 개인정보를
                제3자에게 제공하지 않습니다.
              </p>
              <p className="mt-1">
                서비스 운영에 사용되는 제3자 서비스: Google (인증), Supabase (데이터베이스·스토리지),
                Vercel (호스팅). 각 서비스의 개인정보처리방침을 확인하시기 바랍니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">6. 이용자의 권리</h3>
              <p>이용자는 다음 권리를 갖습니다.</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>개인정보 열람·수정·삭제 요청권</li>
                <li>개인정보 처리 정지 요청권</li>
                <li>데이터 이동권 (PDF 내보내기 기능 제공)</li>
              </ul>
              <p className="mt-2">
                권리 행사는 <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>으로
                문의하시기 바랍니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">7. 쿠키 및 추적</h3>
              <p>
                서비스는 로그인 세션 유지를 위해 세션 쿠키를 사용합니다. 광고·추적 쿠키는
                사용하지 않습니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">8. 개인정보보호 책임자</h3>
              <p>
                개인정보 관련 문의는{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>로
                연락주십시오.
              </p>
              <p className="mt-1 text-muted-foreground">
                한국 이용자의 경우 개인정보보호위원회(privacy.go.kr)에 피해 신청을 하실 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">9. 방침 변경</h3>
              <p>
                본 방침이 변경되는 경우 변경 사항을 서비스 내 공지를 통해 안내합니다.
                중요한 변경의 경우 이메일로 별도 안내합니다.
              </p>
            </div>
          </div>
        </section>

        <div className="my-10 h-px bg-border" />

        {/* English */}
        <section className="space-y-6 text-sm leading-relaxed text-foreground">
          <h2 className="text-base font-bold">Privacy Policy (English)</h2>
          <p className="text-xs text-muted-foreground">Effective: {EFFECTIVE_DATE}</p>

          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-1">1. Data We Collect</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Name and email address (via Google OAuth at sign-in)</li>
                <li>Artwork metadata you enter (title, artist, visit date, notes, etc.)</li>
                <li>Artwork photos you upload</li>
                <li>Basic server logs (login timestamps, error logs)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1">2. How We Use Your Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>To authenticate you and provide the service</li>
                <li>To store and retrieve your artwork records</li>
                <li>To diagnose errors and improve quality</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                We do not use your data for advertising or marketing, and we never sell it.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">3. Storage and Security</h3>
              <p>
                Data is stored encrypted on Supabase servers (US-based). Images are kept
                in a private storage bucket accessible only by you. Row-Level Security (RLS)
                prevents any user from accessing another user's data.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">4. Data Retention</h3>
              <p>
                All personal data and artwork records are deleted upon account deletion.
                We retain data only as long as required by applicable law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">5. Third-Party Sharing</h3>
              <p>
                We do not share your personal data with third parties except where required
                by law.
              </p>
              <p className="mt-1">
                Sub-processors used to operate the service: Google (authentication),
                Supabase (database & storage), Vercel (hosting). Please review their
                respective privacy policies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">6. Your Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Access, correct, or delete your personal data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability (use the PDF export feature, or contact us)</li>
              </ul>
              <p className="mt-2">
                To exercise these rights contact{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
              </p>
              <p className="mt-1 text-muted-foreground">
                EU/EEA users may also lodge a complaint with their local supervisory
                authority. UK users may contact the ICO (ico.org.uk).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">7. Cookies</h3>
              <p>
                We use session cookies solely to keep you logged in. We do not use
                advertising or tracking cookies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">8. Data Controller</h3>
              <p>
                For privacy enquiries contact{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">9. Changes to This Policy</h3>
              <p>
                We will notify you of material changes via in-app notice or email before
                they take effect.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 pt-4 border-t border-border flex gap-6 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            이용약관 · Terms of Service
          </Link>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            설정으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
