import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExportView } from "./ExportView";
import type { ArtworkEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ExportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: artworks } = await supabase
    .from("artwork_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("visit_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return <ExportView artworks={(artworks ?? []) as ArtworkEntry[]} />;
}
