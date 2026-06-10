import { ExportView } from "./ExportView";
import { withSignedUrls } from "@/lib/supabase/storage";
import type { ArtworkEntry } from "@/lib/types";
import { requireUserWithConsent } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ExportPage() {
  const { supabase, user } = await requireUserWithConsent();

  const { data: artworks } = await supabase
    .from("artwork_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("visit_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const rawList = (artworks ?? []) as ArtworkEntry[];
  const artworksWithUrls = await withSignedUrls(rawList, supabase);
  const exportDate = new Date().toISOString().split("T")[0];

  return <ExportView artworks={artworksWithUrls} exportDate={exportDate} />;
}
