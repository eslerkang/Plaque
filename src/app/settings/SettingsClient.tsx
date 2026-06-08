"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/types";
import { Loader2, LogOut, User, BarChart2, Download } from "lucide-react";
import Link from "next/link";

interface SettingsClientProps {
  profile: Profile | null;
  userEmail: string;
  artworkCount: number;
  galleryCount: number;
}

export function SettingsClient({ profile, userEmail, artworkCount, galleryCount }: SettingsClientProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("저장 중 오류가 발생했습니다.");
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

  return (
    <div className="space-y-8">
      {/* Profile section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            프로필
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" value={userEmail} disabled className="opacity-70" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">표시 이름</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="표시 이름을 입력하세요"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              "저장되었습니다 ✓"
            ) : (
              "저장"
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
            나의 아카이브
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold tabular-nums">{artworkCount}</p>
            <p className="text-xs text-muted-foreground mt-1">기록한 작품</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold tabular-nums">{galleryCount}</p>
            <p className="text-xs text-muted-foreground mt-1">방문한 갤러리</p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* App info */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          앱 정보
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">버전</span>
            <span>0.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">이름</span>
            <span>Plaque</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Export */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          내보내기
        </h2>
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href="/scrapbook/export">
            <Download className="h-4 w-4" />
            컬렉션 PDF로 저장
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          모든 작품을 미술관 카탈로그 형식으로 내보냅니다
        </p>
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
          로그아웃
        </Button>
      </section>
    </div>
  );
}
