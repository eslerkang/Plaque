export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

export interface ArtworkEntry {
  id: string;
  user_id: string;
  original_image_url: string;
  cleaned_image_url: string | null;
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

export type ArtworkEntryInsert = Omit<ArtworkEntry, "id" | "created_at" | "updated_at">;
export type ArtworkEntryUpdate = Partial<Omit<ArtworkEntry, "id" | "user_id" | "created_at" | "updated_at">>;
