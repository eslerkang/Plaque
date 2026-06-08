import { cookies } from "next/headers";
import { type Locale, DEFAULT_LOCALE, LOCALE_COOKIE } from "./index";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "en" || value === "ko" ? value : DEFAULT_LOCALE;
}
