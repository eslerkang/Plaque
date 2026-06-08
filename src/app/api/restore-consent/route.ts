import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CONSENT_COOKIE, CONSENT_COOKIE_OPTS } from "@/app/consent/constants";

/**
 * Restores the plaque_terms cookie when the user has already consented in the DB
 * but the cookie is missing (e.g. cleared by iOS Safari, new device, etc.)
 *
 * Called by middleware instead of redirecting directly to /consent.
 * Using a Route Handler guarantees the Set-Cookie header is reliably sent.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const nextParam = searchParams.get("next") ?? "/scrapbook";
  // Sanitise: must be a relative path (no open redirect)
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/scrapbook";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("terms_accepted_at")
    .eq("id", user.id)
    .single();

  if (profile?.terms_accepted_at) {
    // Already consented in DB — restore the cookie and send to destination
    const response = NextResponse.redirect(`${origin}${next}`);
    response.cookies.set(CONSENT_COOKIE, "1", CONSENT_COOKIE_OPTS);
    return response;
  }

  // Not yet consented — go to consent page
  return NextResponse.redirect(`${origin}/consent`);
}
