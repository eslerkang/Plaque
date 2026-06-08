import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ScrapbookSortSelector } from "@/components/ScrapbookSortSelector";
import { ScrapbookViewToggle } from "@/components/ScrapbookViewToggle";
import { TimelineView } from "@/components/TimelineView";
import { OnboardingOverlay } from "@/components/OnboardingOverlay";
import { Suspense } from "react";
import { withSignedUrls } from "@/lib/supabase/storage";
import type { ArtworkEntry } from "@/lib/types";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n";

type SortKey = "created_at" | "visit_date" | "rating";
type ViewMode = "grid" | "timeline";

function isValidSort(s: string | undefined): s is SortKey {
  return s === "visit_date" || s === "rating";
}

export default async function ScrapbookPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; view?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const sortKey: SortKey = isValidSort(params.sort) ? params.sort : "created_at";
  const viewMode: ViewMode = params.view === "timeline" ? "timeline" : "grid";

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
  const rawList = (artworks ?? []) as ArtworkEntry[];
  const list = await withSignedUrls(rawList, supabase);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
          <h1 className="text-xl font-bold tracking-tight">{t("scrapbook.title", locale)}</h1>
          {list.length > 0 && (
            <Link
              href="/scrapbook/new"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={t("scrapbook.addArtwork", locale)}
            >
              <PlusCircle className="h-5 w-5" />
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {error && (
          <p className="text-sm text-destructive text-center py-4">
            {t("scrapbook.error", locale)}
          </p>
        )}

        {list.length === 0 && !error && <OnboardingOverlay />}

        {list.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <div className="space-y-2">
              <p className="text-2xl">🖼</p>
              <p className="font-semibold text-foreground">{t("scrapbook.empty.headline", locale)}</p>
              <p className="text-sm text-muted-foreground">
                {t("scrapbook.empty.body", locale).split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/scrapbook/new">
                <PlusCircle className="h-5 w-5" />
                {t("scrapbook.empty.cta", locale)}
              </Link>
            </Button>
          </div>
        )}

        {list.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground">{t("scrapbook.count", locale, { n: list.length })}</p>
              <div className="flex items-center gap-2">
                <Suspense fallback={null}>
                  {viewMode === "grid" && <ScrapbookSortSelector current={sortKey} />}
                  <ScrapbookViewToggle current={viewMode} />
                </Suspense>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3">
                {list.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <TimelineView artworks={list} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
