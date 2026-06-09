import { cookies, headers } from "next/headers";
import { type Locale, LOCALE_COOKIE } from "./index";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  if (saved === "ko" || saved === "en") return saved;

  // No saved preference — detect from browser/OS language
  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") ?? "";
  return acceptLang.toLowerCase().includes("ko") ? "ko" : "en";
}
