import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";
import { withSignedUrls } from "@/lib/supabase/storage";
import type { ArtworkEntry } from "@/lib/types";

export default async function SearchPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
