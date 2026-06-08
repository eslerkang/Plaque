import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ConsentClient } from "./ConsentClient";
import { CONSENT_COOKIE, CONSENT_COOKIE_OPTS } from "./constants";

export const metadata = { title: "서비스 동의 | Plaque" };

export default async function ConsentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → send to login
  if (!user) redirect("/login");

  // Check whether this user has already accepted
  const { data: profile } = await supabase
    .from("profiles")
    .select("terms_accepted_at")
    .eq("id", user.id)
    .single();

  if (profile?.terms_accepted_at) {
    // Already consented — ensure cookie is present and redirect
    const cookieStore = await cookies();
    cookieStore.set(CONSENT_COOKIE, "1", CONSENT_COOKIE_OPTS);
    redirect("/scrapbook");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Plaque</h1>
          <p className="text-sm text-muted-foreground">서비스 이용 동의</p>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Plaque를 이용하기 위해 아래 약관에 동의해 주세요.
            개인 미술 아카이브 서비스로, 기록하신 사진 및 정보는{" "}
            <strong className="text-foreground">개인 사용 목적</strong>에 한하여
            보관됩니다.
          </p>
        </div>

        {/* Consent form */}
        <ConsentClient />
      </div>
    </main>
  );
}
