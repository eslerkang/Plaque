import { notFound } from "next/navigation";
import { EditArtworkClient } from "./EditArtworkClient";
import { withSignedUrls } from "@/lib/supabase/storage";
import type { ArtworkEntry } from "@/lib/types";
import { requireUserWithConsent } from "@/lib/auth";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user } = await requireUserWithConsent();

  const [{ data: artwork, error }, { data: allArtworks }] = await Promise.all([
    supabase
      .from("artwork_entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("artwork_entries")
      .select("tags")
      .eq("user_id", user.id),
  ]);

  if (error || !artwork) notFound();

  const existingTags = Array.from(
    new Set((allArtworks ?? []).flatMap((a) => a.tags ?? []))
  ).sort();

  const [artworkWithUrls] = await withSignedUrls([artwork as ArtworkEntry], supabase);

  return (
    <EditArtworkClient
      artwork={artworkWithUrls}
      existingTags={existingTags}
    />
  );
}
