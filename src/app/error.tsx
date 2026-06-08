"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring (console in dev, could be Sentry etc. in prod)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="space-y-6 max-w-sm">
        <div className="space-y-2">
          <p className="text-4xl">⚠️</p>
          <h1 className="text-xl font-bold">문제가 발생했어요</h1>
          <p className="text-sm text-muted-foreground">
            일시적인 오류입니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/scrapbook")}>
            홈으로
          </Button>
        </div>
      </div>
    </main>
  );
}
