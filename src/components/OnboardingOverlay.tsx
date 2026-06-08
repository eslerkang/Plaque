"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "plaque_welcomed_v1";

const steps = [
  {
    icon: Camera,
    title: "작품을 사진으로 담기",
    description: "전시장에서 마음에 드는 작품을 찍으세요. 원근 보정으로 반듯하게 정리해드려요.",
  },
  {
    icon: BookOpen,
    title: "나만의 도슨트 기록",
    description: "작가, 연도, 갤러리, 감상 메모까지. 당신만을 위한 작품 해설을 남기세요.",
  },
  {
    icon: Sparkles,
    title: "개인 미술관 완성",
    description: "기록이 쌓일수록 세상에 하나뿐인 당신의 미술관이 완성됩니다.",
  },
];

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);

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
            나만의 미술관을<br />시작해보세요
          </h2>
          <p className="text-sm text-muted-foreground">
            방문한 작품을 기록하고 영원히 소장하세요
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
          <Link href="/scrapbook/new">첫 작품 기록하기</Link>
        </Button>

        <button
          onClick={dismiss}
          className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          나중에 둘러보기
        </button>
      </div>
    </div>
  );
}
