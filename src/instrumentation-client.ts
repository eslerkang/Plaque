/**
 * Sentry client-side init. No-op without NEXT_PUBLIC_SENTRY_DSN.
 *
 * Deliberately minimal for launch: error monitoring + light tracing only.
 * No Session Replay (privacy: personal archive product, image-heavy pages)
 * and no PII (sendDefaultPii: false).
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  });
}

// Instruments App Router navigations (safe to export unconditionally).
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
