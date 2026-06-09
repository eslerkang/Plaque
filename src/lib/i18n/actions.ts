"use server";

import { cookies } from "next/headers";
import { type Locale, LOCALE_COOKIE } from "./index";
import { createClient } from "@/lib/supabase/server";

export async function setLocale(locale: Locale) {
  // Always write the cookie so unauthenticated users and fast SSR both work
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    httpOnly: false, // must be readable client-side for SSR hand-off
    sameSite: "lax",
  });

  // If the user is logged in, persist to their profile so the setting
  // survives across devices and browsers.
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ locale })
        .eq("id", user.id);
    }
  } catch {
    // Cookie is already set — DB failure is non-fatal
  }
}
