"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArtworkMetadataFields } from "@/components/ArtworkMetadataFields";
import {
  isMetadataValid,
  metadataFromArtwork,
  metadataFromFormData,
  metadataToRow,
  type ArtworkMetadata,
} from "@/lib/artwork-metadata";
import type { ArtworkWithUrls } from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";
import { useHydrated } from "@/lib/use-hydrated";

interface EditArtworkClientProps {
  artwork: ArtworkWithUrls;
  existingTags?: string[];
}

export function EditArtworkClient({ artwork, existingTags = [] }: EditArtworkClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const hydrated = useHydrated();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ArtworkMetadata>(() =>
    metadataFromArtwork(artwork)
  );
  const [selectedType, setSelectedType] = useState<"original" | "cleaned">(
    artwork.selected_image_type ?? "original"
  );

  const displayImageUrl =
    selectedType === "cleaned" && artwork.cleanedUrl
      ? artwork.cleanedUrl
      : artwork.originalUrl;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const submittedForm = metadataFromFormData(
      form,
      new FormData(e.currentTarget as HTMLFormElement)
    );
    if (!isMetadataValid(submittedForm)) {
      setError(t("field.title.error"));
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("artwork_entries")
      .update({
        ...metadataToRow(submittedForm),
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

          <ArtworkMetadataFields
            value={form}
            onChange={setForm}
            existingTags={existingTags}
          />

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
              disabled={!hydrated || submitting}
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
