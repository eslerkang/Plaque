import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Supabase Storage public objects
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Supabase Storage signed URLs (private bucket)
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
      {
        // Local Supabase dev — public
        protocol: "http",
        hostname: "localhost",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Local Supabase dev — signed
        protocol: "http",
        hostname: "localhost",
        port: "54321",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Org/project/token come from env (Vercel). Without them the build still
  // succeeds — source-map upload is simply skipped. Runtime is a no-op
  // unless NEXT_PUBLIC_SENTRY_DSN is set (see sentry.*.config.ts).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Route events through the app to dodge ad blockers; proxy.ts matcher
  // excludes this path.
  tunnelRoute: "/sentry-tunnel",
  disableLogger: true,
});
