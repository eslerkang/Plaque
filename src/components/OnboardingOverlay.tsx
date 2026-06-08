"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/LocaleProvider";

const STORAGE_KEY = "plaque_welcomed_v1";

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const steps = [
    {
      icon: Camera,
      title: t("onboarding.feature1.title"),
      description: t("onboarding.feature1.body"),
    },
    {
      icon: BookOpen,
      title: t("onboarding.feature2.title"),
      description: t("onboarding.feature2.body"),
    },
    {
      icon: Sparkles,
      title: t("onboarding.feature3.title"),
      description: t("onboarding.feature3.body"),
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-lg bg-background rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-8" />

        {/* Headline */}
        <div className="text-center mb-8 space-y-2">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">Plaque</p>
          <h2 className="text-2xl font-bold leading-snug">
            {t("onboarding.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("onboarding.subtitle")}
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-5 mb-8">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button asChild size="lg" className="w-full" onClick={dismiss}>
          <Link href="/scrapbook/new">{t("onboarding.cta")}</Link>
        </Button>

        <button
          onClick={dismiss}
          className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("onboarding.dismiss")}
        </button>
      </div>
    </div>
  );
}
