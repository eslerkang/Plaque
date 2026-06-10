import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase session cookie — @supabase/ssr stores it as sb-<ref>-auth-token
  // (may be chunked as sb-<ref>-auth-token.0, .1, etc. for large tokens)
  const hasSession = request.cookies
    .getAll()
    .some(
      (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
    );

  // Consent cookie — set after accepting ToS + Privacy Policy
  const hasConsent = request.cookies.has("plaque_terms");

  const protectedPaths = ["/scrapbook", "/search", "/settings"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // 1. Unauthenticated → login
  if (!hasSession && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Authenticated but no consent → consent page (only for protected routes)
  if (hasSession && !hasConsent && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/consent";
    return NextResponse.redirect(url);
  }

  // 3. Authenticated + consented trying to visit /login → scrapbook
  if (hasSession && hasConsent && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/scrapbook";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // sentry-tunnel is excluded so error reports never bounce through the
    // auth/consent redirect logic (Sentry tunnelRoute, see next.config.ts).
    "/((?!sentry-tunnel|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
