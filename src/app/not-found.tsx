import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="space-y-6 max-w-sm">
        <div className="space-y-2">
          <p className="text-5xl font-bold text-muted-foreground/30 tabular-nums">404</p>
          <h1 className="text-xl font-bold">{t("error.404.heading", locale)}</h1>
          <p className="text-sm text-muted-foreground">
            {t("error.404.body", locale)}
          </p>
        </div>
        <Button asChild>
          <Link href="/scrapbook">{t("error.404.cta", locale)}</Link>
        </Button>
      </div>
    </main>
  );
}
