"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const CONSENT_COOKIE = "plaque_terms";
export const CONSENT_COOKIE_OPTS = {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
};

/**
 * Record consent in DB + set the `plaque_terms` cookie on the response.
 * Called by ConsentClient after the user checks both boxes and submits.
 */
export async function acceptTerms() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ terms_accepted_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  const cookieStore = await cookies();
  cookieStore.set(CONSENT_COOKIE, "1", CONSENT_COOKIE_OPTS);
}
