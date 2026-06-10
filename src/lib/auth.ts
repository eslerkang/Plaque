import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** The slice of `profiles` every authenticated request needs. */
export interface AuthProfile {
  terms_accepted_at: string | null;
  locale: string | null;
}

export interface AuthContext {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User | null;
  profile: AuthProfile | null;
}

/**
 * Per-request memoized auth context: Supabase client + user + the profile
 * columns needed by both the consent gate and locale resolution.
 *
 * Before this existed, a typical authenticated page paid 4 round trips
 * (`getUser` + profile select in `requireUserWithConsent`, then the same
 * pair again inside `getLocale`). With `React.cache` the request pays for
 * one `getUser` and one profile select, shared across all callers.
 */
export const getAuthContext = cache(async (): Promise<AuthContext> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("terms_accepted_at, locale")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile: (profile as AuthProfile | null) ?? null };
});

export async function requireUserWithConsent(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User;
}> {
  const { supabase, user, profile } = await getAuthContext();

  if (!user) redirect("/login");
  if (!profile?.terms_accepted_at) redirect("/consent");

  return { supabase, user };
}
