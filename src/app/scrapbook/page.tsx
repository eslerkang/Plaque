import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ScrapbookSortSelector } from "@/components/ScrapbookSortSelector";
import { Suspense } from "react";
import type { ArtworkEntry } from "@/lib/types";

type SortKey = "created_at" | "visit_date" | "rating";

function isValidSort(s: string | undefined): s is SortKey {
  return s === "visit_date" || s === "rating";
}

export default async function ScrapbookPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const sortKey: SortKey = isValidSort(params.sort) ? params.sort : "created_at";

  let query = supabase
    .from("artwork_entries")
    .select("*")
    .eq("user_id", user.id);

  if (sortKey === "visit_date") {
    query = query
      .order("visit_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
  } else if (sortKey === "rating") {
    query = query
      .order("rating", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: artworks, error } = await query;
  const list = (artworks ?? []) as ArtworkEntry[];

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <h1 className="text-xl font-bold tracking-tight">Plaque</h1>
          {list.length > 0 && (
            <Link
              href="/scrapbook/new"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="작품 추가"
            >
              <PlusCircle className="h-5 w-5" />
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {error && (
          <p className="text-sm text-destructive text-center py-4">
            작품을 불러오는 중 오류가 발생했습니다.
          </p>
        )}

        {list.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <div className="space-y-2">
              <p className="text-2xl">🖼</p>
              <p className="font-semibold text-foreground">첫 작품을 기록해보세요.</p>
              <p className="text-sm text-muted-foreground">
                전시장에서 만난 작품을 사진으로 남기고
                <br />
                나만의 미술관을 만들어보세요.
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/scrapbook/new">
                <PlusCircle className="h-5 w-5" />
                작품 추가하기
              </Link>
            </Button>
          </div>
        )}

        {list.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground">{list.length}점의 작품</p>
              <Suspense fallback={null}>
                <ScrapbookSortSelector current={sortKey} />
              </Suspense>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {list.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
