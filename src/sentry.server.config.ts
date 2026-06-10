/**
 * Sentry server-runtime init. Loaded by src/instrumentation.ts.
 *
 * No-op when NEXT_PUBLIC_SENTRY_DSN is unset (local dev, forks, CI without
 * secrets) — the app must run identically without a Sentry account.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Privacy-first: Plaque stores personal data; don't attach IPs/headers.
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  });
}
