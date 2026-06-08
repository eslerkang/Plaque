import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";
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

  return (
    <Suspense fallback={null}>
      <SearchClient artworks={(artworks ?? []) as ArtworkEntry[]} />
    </Suspense>
  );
}
