import { Suspense } from "react";
import { SearchClient } from "./SearchClient";
import { withSignedUrls } from "@/lib/supabase/storage";
import type { ArtworkEntry } from "@/lib/types";
import { requireUserWithConsent } from "@/lib/auth";

export default async function SearchPage() {
  const { supabase, user } = await requireUserWithConsent();

  const { data: artworks } = await supabase
    .from("artwork_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rawList = (artworks ?? []) as ArtworkEntry[];
  const artworksWithUrls = await withSignedUrls(rawList, supabase);

  return (
    <Suspense fallback={null}>
      <SearchClient artworks={artworksWithUrls} />
    </Suspense>
  );
}
