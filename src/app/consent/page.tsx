import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConsentClient } from "./ConsentClient";

export const metadata = { title: "서비스 동의 | Plaque" };

export default async function ConsentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → send to login
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("terms_accepted_at")
    .eq("id", user.id)
    .single();

  // If already consented in DB, ConsentClient will auto-restore the cookie via
  // Server Action (which reliably sets Set-Cookie) and redirect to /scrapbook.
  const hasAccepted = !!profile?.terms_accepted_at;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight font-serif">Plaque</h1>
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
        <ConsentClient hasAccepted={hasAccepted} />
      </div>
    </main>
  );
}
