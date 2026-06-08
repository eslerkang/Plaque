import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
