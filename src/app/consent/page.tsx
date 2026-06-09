import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LocaleProvider } from "@/components/LocaleProvider";
import { LocaleToggle } from "@/components/LocaleToggle";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n";
import { ConsentClient } from "./ConsentClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: `${t("consent.title", locale)} | Plaque`,
  };
}

export default async function ConsentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → send to login
  if (!user) redirect("/login");

  const [{ data: profile }, locale] = await Promise.all([
    supabase
      .from("profiles")
      .select("terms_accepted_at")
      .eq("id", user.id)
      .single(),
    getLocale(),
  ]);

  // If already consented in DB, ConsentClient will auto-restore the cookie via
  // Server Action (which reliably sets Set-Cookie) and redirect to /scrapbook.
  const hasAccepted = !!profile?.terms_accepted_at;

  return (
    <LocaleProvider locale={locale}>
      <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Brand */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold tracking-tight font-serif">Plaque</h1>
            <p className="text-sm text-muted-foreground">{t("consent.title", locale)}</p>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground leading-relaxed">
            <p>{t("consent.description", locale)}</p>
          </div>

          {/* Consent form */}
          <ConsentClient hasAccepted={hasAccepted} />

          <LocaleToggle className="justify-center" />
        </div>
      </main>
    </LocaleProvider>
  );
}
