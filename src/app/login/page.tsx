import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/scrapbook");

  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Wordmark */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Plaque
          </h1>
          <p className="text-sm text-muted-foreground">
            나만의 미술관 스크랩북
          </p>
        </div>

        <LoginForm error={error} />

        <p className="text-center text-xs text-muted-foreground">
          로그인하면{" "}
          <span className="underline underline-offset-2">이용약관</span>에
          동의한 것으로 간주됩니다.
        </p>
      </div>
    </main>
  );
}
