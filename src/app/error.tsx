"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/LocaleProvider";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log to error monitoring (console in dev, could be Sentry etc. in prod)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="space-y-6 max-w-sm">
        <div className="space-y-2">
          <p className="text-4xl">⚠️</p>
          <h1 className="text-xl font-bold">{t("error.general.heading")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("error.general.body")}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>{t("error.retry")}</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/scrapbook")}>
            {t("error.home")}
          </Button>
        </div>
      </div>
    </main>
  );
}
