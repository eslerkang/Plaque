"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { TagInput } from "@/components/TagInput";
import { X } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";
import type { ArtworkMetadata } from "@/lib/artwork-metadata";

interface ArtworkMetadataFieldsProps {
  value: ArtworkMetadata;
  onChange: (next: ArtworkMetadata) => void;
  /** Tag suggestions (the user's previously used tags). */
  existingTags?: string[];
  /** Show example placeholders (add flow). Edit flow keeps fields bare. */
  showPlaceholders?: boolean;
  /** Autofocus the title input (add flow, step 3). */
  autoFocusTitle?: boolean;
}

/**
 * The ten metadata fields shared by the add and edit artwork forms.
 *
 * Controlled component: owns no state. Field ids (`title`, `artist`,
 * `year`, `medium`, `gallery`, `exhibition`, `visit_date`, `note`) are
 * stable — E2E selectors and label `htmlFor`s depend on them.
 */
export function ArtworkMetadataFields({
  value,
  onChange,
  existingTags = [],
  showPlaceholders = false,
  autoFocusTitle = false,
}: ArtworkMetadataFieldsProps) {
  const { t } = useTranslation();

  function update<K extends keyof ArtworkMetadata>(
    key: K,
    fieldValue: ArtworkMetadata[K]
  ) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">
          {t("field.title")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder={showPlaceholders ? t("field.title.placeholder") : undefined}
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
          required
          autoFocus={autoFocusTitle}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="artist">{t("field.artist")}</Label>
        <Input
          id="artist"
          placeholder={showPlaceholders ? t("field.artist.placeholder") : undefined}
          value={value.artist_name}
          onChange={(e) => update("artist_name", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="year">{t("field.year")}</Label>
          <Input
            id="year"
            placeholder={showPlaceholders ? t("field.year.placeholder") : undefined}
            value={value.year}
            onChange={(e) => update("year", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medium">{t("field.medium")}</Label>
          <Input
            id="medium"
            placeholder={showPlaceholders ? t("field.medium.placeholder") : undefined}
            value={value.medium}
            onChange={(e) => update("medium", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gallery">{t("field.gallery")}</Label>
        <Input
          id="gallery"
          placeholder={showPlaceholders ? t("field.gallery.placeholder") : undefined}
          value={value.gallery_name}
          onChange={(e) => update("gallery_name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="exhibition">{t("field.exhibition")}</Label>
        <Input
          id="exhibition"
          placeholder={showPlaceholders ? t("field.exhibition.placeholder") : undefined}
          value={value.exhibition_title}
          onChange={(e) => update("exhibition_title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="visit_date">{t("field.visitDate")}</Label>
        <Input
          id="visit_date"
          type="date"
          value={value.visit_date}
          onChange={(e) => update("visit_date", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("field.rating")}</Label>
        <div className="flex items-center gap-3">
          <StarRating
            value={value.rating}
            onChange={(v) => update("rating", v)}
            size="lg"
          />
          {value.rating && (
            <button
              type="button"
              onClick={() => update("rating", null)}
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
          placeholder={showPlaceholders ? t("field.note.placeholder") : undefined}
          rows={4}
          value={value.personal_note}
          onChange={(e) => update("personal_note", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("field.tags")}</Label>
        <TagInput
          value={value.tags}
          onChange={(tags) => update("tags", tags)}
          suggestions={existingTags}
          placeholder={showPlaceholders ? t("field.tags.placeholder") : undefined}
        />
      </div>
    </>
  );
}
