/**
 * Shared artwork-metadata form model.
 *
 * Both the add flow (`AddArtworkClient`, step 3) and the edit flow
 * (`EditArtworkClient`) collect the same ten fields. This module owns the
 * form-state shape and the normalization applied before the row hits
 * Supabase (trim strings, convert empties to NULL), so insert and update
 * can never drift apart.
 */

import type { ArtworkEntry } from "@/lib/types";

export interface ArtworkMetadata {
  title: string;
  artist_name: string;
  year: string;
  medium: string;
  gallery_name: string;
  exhibition_title: string;
  visit_date: string;
  personal_note: string;
  rating: number | null;
  tags: string[];
}

export const EMPTY_ARTWORK_METADATA: ArtworkMetadata = {
  title: "",
  artist_name: "",
  year: "",
  medium: "",
  gallery_name: "",
  exhibition_title: "",
  visit_date: "",
  personal_note: "",
  rating: null,
  tags: [],
};

/** Build the editable form state from an existing row. */
export function metadataFromArtwork(a: ArtworkEntry): ArtworkMetadata {
  return {
    title: a.title,
    artist_name: a.artist_name ?? "",
    year: a.year ?? "",
    medium: a.medium ?? "",
    gallery_name: a.gallery_name ?? "",
    exhibition_title: a.exhibition_title ?? "",
    visit_date: a.visit_date ?? "",
    personal_note: a.personal_note ?? "",
    rating: a.rating ?? null,
    tags: a.tags ?? [],
  };
}

/** Database column payload shared by INSERT (add) and UPDATE (edit). */
export interface ArtworkMetadataRow {
  title: string;
  artist_name: string | null;
  year: string | null;
  medium: string | null;
  gallery_name: string | null;
  exhibition_title: string | null;
  visit_date: string | null;
  personal_note: string | null;
  rating: number | null;
  tags: string[] | null;
}

/**
 * Normalize form state into the column payload:
 * trim every text field, store NULL instead of empty strings/arrays.
 */
export function metadataToRow(m: ArtworkMetadata): ArtworkMetadataRow {
  return {
    title: m.title.trim(),
    artist_name: m.artist_name.trim() || null,
    year: m.year.trim() || null,
    medium: m.medium.trim() || null,
    gallery_name: m.gallery_name.trim() || null,
    exhibition_title: m.exhibition_title.trim() || null,
    visit_date: m.visit_date || null,
    personal_note: m.personal_note.trim() || null,
    rating: m.rating,
    tags: m.tags.length > 0 ? m.tags : null,
  };
}

/** True when the metadata can be saved (title is the only required field). */
export function isMetadataValid(m: ArtworkMetadata): boolean {
  return m.title.trim().length > 0;
}
