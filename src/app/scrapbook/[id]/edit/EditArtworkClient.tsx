"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import type { ArtworkEntry } from "@/lib/types";
import { ArrowLeft, Loader2, X } from "lucide-react";

interface EditArtworkClientProps {
  artwork: ArtworkEntry;
}

export function EditArtworkClient({ artwork }: EditArtworkClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(artwork.title);
  const [artist, setArtist] = useState(artwork.artist_name ?? "");
  const [year, setYear] = useState(artwork.year ?? "");
  const [medium, setMedium] = useState(artwork.medium ?? "");
  const [gallery, setGallery] = useState(artwork.gallery_name ?? "");
  const [exhibition, setExhibition] = useState(artwork.exhibition_title ?? "");
  const [visitDate, setVisitDate] = useState(artwork.visit_date ?? "");
  const [note, setNote] = useState(artwork.personal_note ?? "");
  const [rating, setRating] = useState<number | null>(artwork.rating ?? null);
  const [tags, setTags] = useState(artwork.tags?.join(", ") ?? "");
  const [selectedType, setSelectedType] = useState<"original" | "cleaned">(
    artwork.selected_image_type ?? "original"
  );

  const displayImageUrl =
    selectedType === "cleaned" && artwork.cleaned_image_url
      ? artwork.cleaned_image_url
      : artwork.original_image_url;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("작품 제목은 필수입니다.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error: updateError } = await supabase
      .from("artwork_entries")
      .update({
        title: title.trim(),
        artist_name: artist.trim() || null,
        year: year.trim() || null,
        medium: medium.trim() || null,
        gallery_name: gallery.trim() || null,
        exhibition_title: exhibition.trim() || null,
        visit_date: visitDate || null,
        personal_note: note.trim() || null,
        rating,
        tags: tagList.length > 0 ? tagList : null,
        selected_image_type: selectedType,
      })
      .eq("id", artwork.id);

    if (updateError) {
      setError("저장 중 오류가 발생했습니다.");
      setSubmitting(false);
      return;
    }

    router.push(`/scrapbook/${artwork.id}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
          <Link
            href={`/scrapbook/${artwork.id}`}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold flex-1">작품 편집</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image preview + selection */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <Image
                src={displayImageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {artwork.cleaned_image_url && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedType("original")}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedType === "original"
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border bg-transparent text-foreground"
                  }`}
                >
                  원본
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("cleaned")}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedType === "cleaned"
                      ? "border-foreground bg-foreground text-primary-foreground"
                      : "border-border bg-transparent text-foreground"
                  }`}
                >
                  보정본
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              작품 제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">작가</Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="year">제작 연도</Label>
              <Input
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium">재료/기법</Label>
              <Input
                id="medium"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery">미술관 / 갤러리</Label>
            <Input
              id="gallery"
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exhibition">전시명</Label>
            <Input
              id="exhibition"
              value={exhibition}
              onChange={(e) => setExhibition(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visit_date">방문 날짜</Label>
            <Input
              id="visit_date"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>평점</Label>
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating && (
                <button
                  type="button"
                  onClick={() => setRating(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="평점 삭제"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">감상 메모</Label>
            <Textarea
              id="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">태그</Label>
            <Input
              id="tags"
              placeholder="쉼표(,)로 구분"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="flex gap-3 pt-2 pb-4">
            <Button type="button" variant="outline" className="flex-1" asChild>
              <Link href={`/scrapbook/${artwork.id}`}>취소</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "저장"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
