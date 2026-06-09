import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LocaleProvider } from "@/components/LocaleProvider";
import { LocaleToggle } from "@/components/LocaleToggle";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/scrapbook");

  const locale = await getLocale();

  const features = [
    { icon: "📷", label: t("landing.feature.photo", locale) },
    { icon: "✍️", label: t("landing.feature.memo", locale) },
    { icon: "🏛", label: t("landing.feature.archive", locale) },
  ] as const;

  return (
    <LocaleProvider locale={locale}>
      <main className="min-h-screen flex flex-col bg-background">
        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="max-w-sm space-y-6">
            {/* Wordmark */}
            <div className="space-y-1">
              <h1 className="text-5xl font-bold tracking-tight text-foreground font-serif">
                {t("landing.headline", locale)}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("landing.subline", locale)}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-border" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Value props */}
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p style={{ whiteSpace: "pre-line" }}>{t("landing.body1", locale)}</p>
              <p style={{ whiteSpace: "pre-line" }}>{t("landing.body2", locale)}</p>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/login">{t("landing.cta", locale)}</Link>
            </Button>

            <LocaleToggle className="justify-center" />
          </div>
        </div>

        {/* Feature highlights */}
        <div className="border-t border-border bg-muted/50 px-6 py-10">
          <div className="max-w-sm mx-auto grid grid-cols-3 gap-4 text-center">
            {features.map(({ icon, label }) => (
              <div key={label} className="space-y-2">
                <div className="text-2xl">{icon}</div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </LocaleProvider>
  );
}
