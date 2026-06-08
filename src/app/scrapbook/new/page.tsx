import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AddArtworkClient } from "./AddArtworkClient";

export default async function NewArtworkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
