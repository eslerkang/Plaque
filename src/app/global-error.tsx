"use client";

/**
 * Root-level error boundary — catches render errors that escape
 * src/app/error.tsx (including errors in the root layout itself) and
 * reports them to Sentry.
 *
 * NOTE: global-error replaces the entire root layout, so LocaleProvider /
 * i18n context is unavailable here by construction. Plain-English copy is
 * an accepted i18n exception for this catastrophic-failure page.
 */
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf9f7",
          color: "#1a1917",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🖼</p>
          <h1 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#7a746b", margin: "0 0 1.5rem" }}>
            A temporary error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #e3ddd5",
              backgroundColor: "#1a1917",
              color: "#faf9f7",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
