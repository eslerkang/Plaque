import { AddArtworkClient } from "./AddArtworkClient";
import { requireUserWithConsent } from "@/lib/auth";

export default async function NewArtworkPage() {
  const { supabase, user } = await requireUserWithConsent();

  // Fetch existing tags for autocomplete
  const { data: artworks } = await supabase
    .from("artwork_entries")
    .select("tags")
    .eq("user_id", user.id);

  const existingTags = Array.from(
    new Set((artworks ?? []).flatMap((a) => a.tags ?? []))
  ).sort();

  return <AddArtworkClient userId={user.id} existingTags={existingTags} />;
}
