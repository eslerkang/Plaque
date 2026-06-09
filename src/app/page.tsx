import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/scrapbook");

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-sm space-y-6">
          {/* Wordmark */}
          <div className="space-y-1">
            <h1 className="text-5xl font-bold tracking-tight text-foreground font-serif">
              Plaque
            </h1>
            <p className="text-lg text-muted-foreground">나만의 미술관 스크랩북</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Value props */}
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              전시장에서 마주친 작품을 사진으로 기록하고,
              <br />
              감상과 평점을 남겨두세요.
            </p>
            <p>
              나중에 언제든 꺼내볼 수 있는
              <br />
              나만의 미술관 아카이브.
            </p>
          </div>

          <Button asChild size="lg" className="w-full">
            <Link href="/login">시작하기</Link>
          </Button>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="border-t border-border bg-muted/50 px-6 py-10">
        <div className="max-w-sm mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "📷", label: "사진 기록" },
            { icon: "✍️", label: "감상 메모" },
            { icon: "🏛", label: "나만의 아카이브" },
          ].map(({ icon, label }) => (
            <div key={label} className="space-y-2">
              <div className="text-2xl">{icon}</div>
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
