import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AddArtworkClient } from "./AddArtworkClient";

export default async function NewArtworkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AddArtworkClient userId={user.id} />;
}
