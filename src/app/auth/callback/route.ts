import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CONSENT_COOKIE, CONSENT_COOKIE_OPTS } from "@/app/consent/constants";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

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
      // Fetch profile fields we need in one query
      const { data: profile } = await supabase
        .from("profiles")
        .select("terms_accepted_at, locale")
        .single();

      if (!profile?.terms_accepted_at) {
        // First login or consent not yet given — send to consent page
        return NextResponse.redirect(`${origin}/consent`);
      }

      // Already consented — build the redirect response
      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set(CONSENT_COOKIE, "1", CONSENT_COOKIE_OPTS);

      // Sync locale from profile to cookie so the user's language preference
      // is immediately active on this device without an extra DB round-trip.
      const dbLocale = profile.locale as Locale | null;
      if (dbLocale === "ko" || dbLocale === "en") {
        response.cookies.set(LOCALE_COOKIE, dbLocale, {
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
          httpOnly: false,
          sameSite: "lax",
        });
      }

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
