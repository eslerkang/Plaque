import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StarRating } from "@/components/StarRating";
import type { ArtworkWithUrls } from "@/lib/types";
import { t, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

interface VisitGroup {
  key: string;
  gallery: string | null;
  exhibition: string | null;
  visitDate: string | null;
  artworks: ArtworkWithUrls[];
}

function groupByVisit(artworks: ArtworkWithUrls[]): VisitGroup[] {
  const map = new Map<string, VisitGroup>();

  for (const a of artworks) {
    // Group key: visit_date + gallery + exhibition (coarse deduplication)
    const key = [
      a.visit_date ?? "",
      a.gallery_name ?? "",
      a.exhibition_title ?? "",
    ].join("||");

    if (!map.has(key)) {
      map.set(key, {
        key,
        gallery: a.gallery_name,
        exhibition: a.exhibition_title,
        visitDate: a.visit_date,
        artworks: [],
      });
    }
    map.get(key)!.artworks.push(a);
  }

  // Sort groups: dated groups first (newest), then undated by created_at
  return Array.from(map.values()).sort((a, b) => {
    if (a.visitDate && b.visitDate) {
      return b.visitDate.localeCompare(a.visitDate);
    }
    if (a.visitDate) return -1;
    if (b.visitDate) return 1;
    const aLatest = a.artworks[0]?.created_at ?? "";
    const bLatest = b.artworks[0]?.created_at ?? "";
    return bLatest.localeCompare(aLatest);
  });
}

function ArtworkRow({ artwork }: { artwork: ArtworkWithUrls }) {
  return (
    <Link
      href={`/scrapbook/${artwork.id}`}
      className="flex gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
    >
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <Image
          src={artwork.displayUrl}
          alt={artwork.title}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-sm font-semibold truncate">{artwork.title}</p>
        {artwork.artist_name && (
          <p className="text-xs text-muted-foreground truncate">{artwork.artist_name}</p>
        )}
        {artwork.rating && (
          <div className="mt-1">
            <StarRating value={artwork.rating} readonly size="sm" />
          </div>
        )}
      </div>
      {artwork.year && (
        <p className="text-xs text-muted-foreground self-center flex-shrink-0">{artwork.year}</p>
      )}
    </Link>
  );
}

export function TimelineView({
  artworks,
  locale = DEFAULT_LOCALE,
}: {
  artworks: ArtworkWithUrls[];
  locale?: Locale;
}) {
  const groups = groupByVisit(artworks);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key} className="relative pl-5">
          {/* Timeline dot + line */}
          <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-accent border-2 border-background ring-1 ring-accent" />
          <div className="absolute left-[4px] top-5 bottom-0 w-px bg-border" />

          {/* Group header */}
          <div className="mb-3 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {group.visitDate ? (
                <>
                  <CalendarDays className="h-3 w-3 flex-shrink-0" />
                  <span>{formatDate(group.visitDate)}</span>
                </>
              ) : (
                <span>{t("timeline.undated", locale)}</span>
              )}
            </div>
            {(group.gallery || group.exhibition) && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {[group.gallery, group.exhibition].filter(Boolean).join(" · ")}
                </span>
              </div>
            )}
            <p className="text-xs font-medium text-foreground">
              {t("timeline.artworkCount", locale, { n: group.artworks.length })}
            </p>
          </div>

          {/* Artwork rows */}
          <div className="rounded-xl border border-border bg-card px-3">
            {group.artworks.map((artwork) => (
              <ArtworkRow key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
