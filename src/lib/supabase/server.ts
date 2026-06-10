import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Per-request memoized Supabase server client.
 *
 * `React.cache` deduplicates within a single server request, so layouts,
 * pages, and helpers (`requireUserWithConsent`, `getLocale`, …) all share
 * one client instead of re-creating it per call site. In non-RSC contexts
 * (Route Handlers, Server Actions) `cache` degrades to a pass-through,
 * which preserves the previous behavior.
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — can ignore
          }
        },
      },
    }
  );
});
