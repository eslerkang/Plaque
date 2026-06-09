"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";
import { acceptTerms } from "./actions";

export function ConsentClient({ hasAccepted = false }: { hasAccepted?: boolean }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user already consented in DB but cookie is missing (e.g. cleared by browser),
  // restore the cookie via Server Action (reliable Set-Cookie) and redirect.
  useEffect(() => {
    if (!hasAccepted) return;
    startTransition(async () => {
      try {
        await acceptTerms();
        router.push("/scrapbook");
        router.refresh();
      } catch {
        // Ignore — user can still manually accept if auto-restore fails
      }
    });
  }, [hasAccepted]); // eslint-disable-line react-hooks/exhaustive-deps

  const canSubmit = agreedTerms && agreedPrivacy && !isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);

    startTransition(async () => {
      try {
        await acceptTerms();
        router.push("/scrapbook");
        router.refresh();
      } catch {
        setError(t("consent.error"));
      }
    });
  }

  // Show loading state while auto-restoring cookie
  if (hasAccepted) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Checkbox: Terms */}
      <label className="flex gap-3 items-start cursor-pointer group">
        <div className="mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="w-4 h-4 accent-foreground cursor-pointer"
          />
        </div>
        <span className="text-sm leading-relaxed">
          <span className="text-destructive">*</span>{" "}
          {t("consent.agreePrefix")}
          <Link
            href="/terms"
            target="_blank"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {t("settings.terms")}
          </Link>
          {t("consent.agreeSuffix")}
        </span>
      </label>

      {/* Checkbox: Privacy */}
      <label className="flex gap-3 items-start cursor-pointer group">
        <div className="mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={agreedPrivacy}
            onChange={(e) => setAgreedPrivacy(e.target.checked)}
            className="w-4 h-4 accent-foreground cursor-pointer"
          />
        </div>
        <span className="text-sm leading-relaxed">
          <span className="text-destructive">*</span>{" "}
          {t("consent.agreePrefix")}
          <Link
            href="/privacy"
            target="_blank"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {t("settings.privacy")}
          </Link>
          {t("consent.agreeSuffix")}
        </span>
      </label>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!canSubmit}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {t("consent.submitting")}
          </>
        ) : (
          t("consent.submit")
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {t("consent.required")}
      </p>
    </form>
  );
}
