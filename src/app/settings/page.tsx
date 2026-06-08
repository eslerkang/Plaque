import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: artworks }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("artwork_entries")
      .select("id, gallery_name")
      .eq("user_id", user.id),
  ]);

  const artworkCount = artworks?.length ?? 0;
  const galleryCount = new Set(
    artworks?.map((a) => a.gallery_name).filter(Boolean) ?? []
  ).size;

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center px-4 h-14 max-w-lg mx-auto">
          <h1 className="font-semibold text-base">설정</h1>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <SettingsClient
          profile={profile as Profile | null}
          userEmail={user.email ?? ""}
          artworkCount={artworkCount}
          galleryCount={galleryCount}
        />
      </main>
    </div>
  );
}
