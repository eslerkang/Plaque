import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CONSENT_COOKIE, CONSENT_COOKIE_OPTS } from "@/app/consent/actions";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "";
  // Sanitise: must be a relative path starting with exactly one slash (no open-redirect via `//evil.com`)
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/scrapbook";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check whether this user has already accepted the terms
      const { data: profile } = await supabase
        .from("profiles")
        .select("terms_accepted_at")
        .single();

      if (!profile?.terms_accepted_at) {
        // First login or consent not yet given — send to consent page
        return NextResponse.redirect(`${origin}/consent`);
      }

      // Already consented — set/refresh the consent cookie and proceed
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set(CONSENT_COOKIE, "1", CONSENT_COOKIE_OPTS);
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
