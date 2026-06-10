"use client";

import { createContext, useContext, useCallback } from "react";
import { type Locale, type TranslationKey, t as tFn, DEFAULT_LOCALE } from "@/lib/i18n";

// ── Context ───────────────────────────────────────────────────────────────────
interface LocaleContextValue {
  locale: Locale;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  t: (key, vars) => tFn(key, DEFAULT_LOCALE, vars),
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      tFn(key, locale, vars),
    [locale]
  );
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTranslation() {
  return useContext(LocaleContext);
}
