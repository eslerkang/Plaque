"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/types";
import { Loader2, LogOut, User, BarChart2, Download, Globe } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/components/LocaleProvider";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n";

interface SettingsClientProps {
  profile: Profile | null;
  userEmail: string;
  artworkCount: number;
  galleryCount: number;
}

export function SettingsClient({ profile, userEmail, artworkCount, galleryCount }: SettingsClientProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChangingLocale, startLocaleTransition] = useTransition();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null })
      .eq("id", profile?.id ?? "");

    if (updateError) {
      setError(t("settings.error"));
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function handleLocaleChange(next: Locale) {
    if (next === locale || isChangingLocale) return;
    startLocaleTransition(async () => {
      await setLocale(next);
      // Also sync to profiles.language if column exists
      const supabase = createClient();
      supabase
        .from("profiles")
        .update({ language: next })
        .eq("id", profile?.id ?? "")
        .then(() => {}) // best-effort, ignore result
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {/* Profile section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {t("settings.profile")}
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("settings.email")}</Label>
            <Input id="email" value={userEmail} disabled className="opacity-70" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">{t("settings.displayName")}</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("settings.displayName.placeholder")}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              t("settings.saved")
            ) : (
              t("settings.save")
            )}
          </Button>
        </form>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Archive stats */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {t("settings.archive")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold tabular-nums">{artworkCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("settings.artworks")}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold tabular-nums">{galleryCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("settings.galleries")}</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Language toggle */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {t("settings.language")}
          </h2>
        </div>
        <div className="flex gap-2">
          {(["ko", "en"] as Locale[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLocaleChange(lang)}
              disabled={isChangingLocale}
              className={[
                "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                locale === lang
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground/40",
                isChangingLocale ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {lang === "ko" ? "한국어" : "English"}
            </button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* App info */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {t("settings.appInfo")}
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("settings.version")}</span>
            <span>0.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("settings.appName")}</span>
            <span>Plaque</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Export */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {t("settings.export")}
        </h2>
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href="/scrapbook/export">
            <Download className="h-4 w-4" />
            {t("settings.exportPdf")}
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          {t("settings.exportPdfDesc")}
        </p>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Legal */}
      <section className="space-y-2">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {t("settings.legal")}
        </h2>
        <div className="space-y-1">
          <Link
            href="/terms"
            className="flex items-center justify-between py-2 text-sm hover:text-foreground text-muted-foreground transition-colors"
          >
            <span>{t("settings.terms")}</span>
            <span className="text-xs">→</span>
          </Link>
          <Link
            href="/privacy"
            className="flex items-center justify-between py-2 text-sm hover:text-foreground text-muted-foreground transition-colors"
          >
            <span>{t("settings.privacy")}</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Sign out */}
      <section>
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {signingOut ? t("settings.signingOut") : t("settings.signOut")}
        </Button>
      </section>
    </div>
  );
}
