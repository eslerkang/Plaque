export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

export interface ArtworkEntry {
  id: string;
  user_id: string;
  /** Storage path within `artwork-images` bucket, e.g. `userId/1234_original.jpg` */
  original_image_path: string;
  /** Storage path for perspective-corrected image. NULL if none. */
  cleaned_image_path: string | null;
  selected_image_type: "original" | "cleaned" | null;
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
  created_at: string;
  updated_at: string;
}

/** ArtworkEntry enriched with pre-generated signed URLs for display */
export interface ArtworkWithUrls extends ArtworkEntry {
  /** Signed URL for the user-selected image (original or cleaned) */
  displayUrl: string;
  /** Signed URL for original image */
  originalUrl: string;
  /** Signed URL for cleaned image (null if none) */
  cleanedUrl: string | null;
}

export type ArtworkEntryInsert = Omit<ArtworkEntry, "id" | "created_at" | "updated_at">;
export type ArtworkEntryUpdate = Partial<Omit<ArtworkEntry, "id" | "user_id" | "created_at" | "updated_at">>;
