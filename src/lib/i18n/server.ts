import { cookies, headers } from "next/headers";
import { type Locale, LOCALE_COOKIE } from "./index";
import { createClient } from "@/lib/supabase/server";

export async function getLocale(): Promise<Locale> {
  // 1. Cookie fast path — set on prior visit or after login sync
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  if (saved === "ko" || saved === "en") return saved;

  // 2. If no cookie, check whether the logged-in user has a saved preference
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("locale")
        .eq("id", user.id)
        .single();
      const dbLocale = profile?.locale;
      if (dbLocale === "ko" || dbLocale === "en") {
        // Back-fill the cookie so subsequent requests skip the DB lookup
        cookieStore.set(LOCALE_COOKIE, dbLocale, {
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
          httpOnly: false,
          sameSite: "lax",
        });
        return dbLocale;
      }
    }
  } catch {
    // Non-fatal — fall through to Accept-Language detection
  }

  // 3. Fall back to browser/OS language
  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") ?? "";
  return acceptLang.toLowerCase().includes("ko") ? "ko" : "en";
}
