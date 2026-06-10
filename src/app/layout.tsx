import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const ogImage = locale === "en" ? "/og-image-en.png" : "/og-image.png";
  const title = `Plaque — ${t("landing.subline", locale)}`;
  const description = t("landing.body1", locale).replace(/\n/g, " ");

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://art-plaque.kro.kr"
    ),
    title,
    description,
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Plaque",
    },
    formatDetection: {
      telephone: false,
    },
    verification: {
      google: "33Pzuk1zCu6XzizFN_WJb8a3aVv_FG5cuOfj9oacUOQ",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf9f7",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="h-full">
      <body className="h-full bg-background text-foreground antialiased font-sans">
        <ServiceWorkerRegistration />
        <LocaleProvider locale={locale}>
          {children}
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
