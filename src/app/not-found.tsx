import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="space-y-6 max-w-sm">
        <div className="space-y-2">
          <p className="text-5xl font-bold text-muted-foreground/30 tabular-nums">404</p>
          <h1 className="text-xl font-bold">페이지를 찾을 수 없어요</h1>
          <p className="text-sm text-muted-foreground">
            링크가 잘못되었거나 이미 삭제된 페이지입니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/scrapbook">스크랩북으로 돌아가기</Link>
        </Button>
      </div>
    </main>
  );
}
