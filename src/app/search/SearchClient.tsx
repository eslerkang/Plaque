"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArtworkCard } from "@/components/ArtworkCard";
import { StarRating } from "@/components/StarRating";
import type { ArtworkEntry } from "@/lib/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface SearchClientProps {
  artworks: ArtworkEntry[];
}

interface Filters {
  query: string;
  rating: number | null;
  tag: string;
}

export function SearchClient({ artworks }: SearchClientProps) {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") ?? "";

  const [filters, setFilters] = useState<Filters>({
    query: "",
    rating: null,
    tag: initialTag,
  });
  const [showFilters, setShowFilters] = useState(!!initialTag);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    artworks.forEach((a) => a.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [artworks]);

  // Filter logic
  const results = useMemo(() => {
    const q = filters.query.toLowerCase().trim();
    return artworks.filter((a) => {
      if (q) {
        const searchable = [
          a.title,
          a.artist_name,
          a.gallery_name,
          a.exhibition_title,
          a.tags?.join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (filters.rating && a.rating !== filters.rating) return false;
      if (filters.tag && !a.tags?.includes(filters.tag)) return false;
      return true;
    });
  }, [artworks, filters]);

  const hasFilters =
    filters.query || filters.rating || filters.tag;

  function clearFilters() {
    setFilters({ query: "", rating: null, tag: "" });
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="px-4 py-3 max-w-lg mx-auto space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="작품, 작가, 갤러리 검색..."
                value={filters.query}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, query: e.target.value }))
                }
                className="pl-9"
                autoComplete="off"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, query: "" }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="검색어 지우기"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${
                showFilters || (filters.rating || filters.tag)
                  ? "bg-foreground text-primary-foreground border-foreground"
                  : "border-border hover:bg-muted"
              }`}
              aria-label="필터"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div className="space-y-3 pb-1">
              {/* Rating filter */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">평점</p>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          rating: f.rating === r ? null : r,
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        filters.rating === r
                          ? "bg-foreground text-primary-foreground border-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {"★".repeat(r)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag filter */}
              {allTags.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">태그</p>
                  <div className="flex gap-2 flex-wrap">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            tag: f.tag === tag ? "" : tag,
                          }))
                        }
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          filters.tag === tag
                            ? "bg-foreground text-primary-foreground border-foreground"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {/* Results summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            {hasFilters
              ? `${results.length}개의 결과`
              : `${artworks.length}점의 작품`}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              필터 초기화
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center">
            <p className="text-2xl">🔍</p>
            <p className="font-medium">검색 결과가 없어요.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground underline underline-offset-2"
              >
                필터를 초기화해 보세요
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {results.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
