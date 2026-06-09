import type { Metadata, Viewport } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/i18n/server";

/**
 * Display / heading font — 나눔명조 (Nanum Myeongjo)
 * License: SIL OFL 1.1 (commercial use permitted)
 * Designed by Naver Corp. — traditional Korean Myeongjo,
 * ideal for museum catalog / gallery label aesthetics.
 */
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false, // Korean fonts are large; avoid blocking preload
});

/**
 * Body / UI font — Noto Sans KR
 * License: SIL OFL 1.1 (commercial use permitted)
 * Designed by Google / Adobe — comprehensive Korean + Latin support,
 * optimised for screen legibility.
 */
const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Plaque — 나만의 미술관 스크랩북",
  description: "방문한 작품을 기록하고, 감상을 남기고, 나만의 미술관을 만들어보세요.",
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
    title: "Plaque — 나만의 미술관 스크랩북",
    description: "방문한 작품을 기록하고, 감상을 남기고, 나만의 미술관을 만들어보세요.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plaque — 나만의 미술관 스크랩북",
    description: "방문한 작품을 기록하고, 감상을 남기고, 나만의 미술관을 만들어보세요.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Plaque",
  },
  formatDetection: {
    telephone: false,
  },
};

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
    <html lang={locale} className={`h-full ${nanumMyeongjo.variable} ${notoSansKR.variable}`}>
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
