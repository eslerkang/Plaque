import { cookies, headers } from "next/headers";
import { type Locale, LOCALE_COOKIE } from "./index";
import { getAuthContext } from "@/lib/auth";

function isLocale(v: unknown): v is Locale {
  return v === "ko" || v === "en";
}

/**
 * Resolve the request locale.
 *
 * 1. `plaque_locale` cookie — set by the locale toggle (server action) and
 *    synced from the profile at login (`auth/callback`).
 * 2. Logged-in user's saved profile preference. Served from the per-request
 *    `getAuthContext()` cache, so this adds no extra DB round trip on
 *    authenticated pages that already called `requireUserWithConsent()`.
 *    (Note: cookies cannot be written during Server Component render, so the
 *    cookie back-fill happens in the locale server action / auth callback,
 *    never here.)
 * 3. `Accept-Language` header fallback.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  try {
    const { profile } = await getAuthContext();
    if (isLocale(profile?.locale)) return profile.locale;
  } catch {
    // Non-fatal — fall through to Accept-Language detection
  }

  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") ?? "";
  return acceptLang.toLowerCase().includes("ko") ? "ko" : "en";
}
