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
import { TagInput } from "@/components/TagInput";
import type { ArtworkWithUrls } from "@/lib/types";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";

interface EditArtworkClientProps {
  artwork: ArtworkWithUrls;
  existingTags?: string[];
}

export function EditArtworkClient({ artwork, existingTags = [] }: EditArtworkClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
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
  const [tags, setTags] = useState<string[]>(artwork.tags ?? []);
  const [selectedType, setSelectedType] = useState<"original" | "cleaned">(
    artwork.selected_image_type ?? "original"
  );

  const displayImageUrl =
    selectedType === "cleaned" && artwork.cleanedUrl
      ? artwork.cleanedUrl
      : artwork.originalUrl;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("field.title.error"));
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const tagList = tags;

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
      setError(t("edit.error"));
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
            aria-label={t("edit.cancel")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold flex-1">{t("edit.title")}</h1>
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
                preload
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 640px) calc(100vw - 2rem), 512px"
                unoptimized
              />
            </div>

            {artwork.cleanedUrl && (
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
                  {t("edit.original")}
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
                  {t("edit.cleaned")}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              {t("field.title")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">{t("field.artist")}</Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="year">{t("field.year")}</Label>
              <Input
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium">{t("field.medium")}</Label>
              <Input
                id="medium"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery">{t("field.gallery")}</Label>
            <Input
              id="gallery"
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exhibition">{t("field.exhibition")}</Label>
            <Input
              id="exhibition"
              value={exhibition}
              onChange={(e) => setExhibition(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visit_date">{t("field.visitDate")}</Label>
            <Input
              id="visit_date"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("field.rating")}</Label>
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating && (
                <button
                  type="button"
                  onClick={() => setRating(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="clear rating"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">{t("field.note")}</Label>
            <Textarea
              id="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("field.tags")}</Label>
            <TagInput
              value={tags}
              onChange={setTags}
              suggestions={existingTags}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="flex gap-3 pt-2 pb-4">
            <Button type="button" variant="outline" className="flex-1" asChild>
              <Link href={`/scrapbook/${artwork.id}`}>{t("edit.cancel")}</Link>
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("edit.save")
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
