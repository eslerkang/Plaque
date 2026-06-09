import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { LocaleProvider } from "@/components/LocaleProvider";
import { LocaleToggle } from "@/components/LocaleToggle";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n";

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

  const [{ error }, locale] = await Promise.all([
    searchParams,
    getLocale(),
  ]);

  return (
    <LocaleProvider locale={locale}>
      <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Wordmark */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground font-serif">
              {t("login.title", locale)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("login.subtitle", locale)}
            </p>
          </div>

          <LoginForm error={error} />

          <p className="text-center text-xs text-muted-foreground">
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
              {t("settings.terms", locale)}
            </Link>
            {locale === "ko" ? " 및 " : " and "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
              {t("settings.privacy", locale)}
            </Link>
          </p>

          <LocaleToggle className="justify-center" />
        </div>
      </main>
    </LocaleProvider>
  );
}
