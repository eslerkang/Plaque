"use server";

import { cookies } from "next/headers";
import { type Locale, LOCALE_COOKIE } from "./index";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    httpOnly: false, // must be readable client-side for SSR hand-off
    sameSite: "lax",
  });
}
