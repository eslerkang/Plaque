import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditArtworkClient } from "./EditArtworkClient";
import type { ArtworkEntry } from "@/lib/types";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: artwork, error } = await supabase
    .from("artwork_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !artwork) notFound();

  return <EditArtworkClient artwork={artwork as ArtworkEntry} />;
}
