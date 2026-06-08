/**
 * Consent cookie name and options.
 * Kept in a plain (non-"use server") module so that both
 * Route Handlers and Client Components can import it without
 * crossing the server-action module boundary.
 */
export const CONSENT_COOKIE = "plaque_terms";
export const CONSENT_COOKIE_OPTS = {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
};
