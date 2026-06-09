"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/i18n/actions";
import { useTranslation } from "@/components/LocaleProvider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

interface LocaleToggleProps {
  className?: string;
}

export function LocaleToggle({ className }: LocaleToggleProps) {
  const { locale } = useTranslation();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div className={cn("flex items-center text-xs", className)}>
      {(["ko", "en"] as Locale[]).map((lang, i) => (
        <span key={lang} className="flex items-center">
          {i > 0 && (
            <span className="mx-1 text-muted-foreground/40 select-none">·</span>
          )}
          <button
            onClick={() => handleToggle(lang)}
            disabled={isPending}
            className={cn(
              "px-1 py-0.5 rounded transition-colors disabled:opacity-50",
              locale === lang
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground cursor-pointer"
            )}
          >
            {lang === "ko" ? "한국어" : "English"}
          </button>
        </span>
      ))}
    </div>
  );
}
