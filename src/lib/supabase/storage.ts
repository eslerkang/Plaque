/**
 * Supabase Storage helpers for the private `artwork-images` bucket.
 *
 * Images are stored as paths (e.g. `userId/timestamp_original.jpg`).
 * To display them, callers must generate short-lived signed URLs.
 *
 * - Server components: use `withSignedUrls()` — batches all paths in one RPC call.
 * - Client components: receive pre-signed URLs as props from their server parent.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArtworkEntry, ArtworkWithUrls } from "@/lib/types";

export const BUCKET = "artwork-images";
/** How long signed URLs are valid (seconds). 1 hour is generous for a page render. */
const SIGNED_URL_TTL = 3600;

/**
 * Given a list of ArtworkEntry rows (whose image fields are storage paths),
 * batch-generates signed URLs and returns ArtworkWithUrls[].
 *
 * Uses `createSignedUrls` (single RPC) rather than one call per image.
 */
export async function withSignedUrls(
  artworks: ArtworkEntry[],
  supabase: SupabaseClient
): Promise<ArtworkWithUrls[]> {
  if (artworks.length === 0) return [];

  // Collect unique paths that need signing
  const pathSet = new Set<string>();
  for (const a of artworks) {
    pathSet.add(a.original_image_path);
    if (a.cleaned_image_path) pathSet.add(a.cleaned_image_path);
  }
  const paths = Array.from(pathSet);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL);

  if (error) {
    console.error("[storage] createSignedUrls error:", error.message);
    // Fallback: return artworks with empty URLs rather than crashing
    return artworks.map((a) => ({
      ...a,
      originalUrl: "",
      cleanedUrl: null,
      displayUrl: "",
    }));
  }

  // Build a path → signedUrl map
  const urlMap: Record<string, string> = {};
  for (const item of data ?? []) {
    if (item.signedUrl && item.path) urlMap[item.path] = item.signedUrl;
  }

  return artworks.map((a) => {
    const originalUrl = urlMap[a.original_image_path] ?? "";
    const cleanedUrl = a.cleaned_image_path
      ? (urlMap[a.cleaned_image_path] ?? null)
      : null;
    const displayUrl =
      a.selected_image_type === "cleaned" && cleanedUrl ? cleanedUrl : originalUrl;
    return { ...a, originalUrl, cleanedUrl, displayUrl };
  });
}
