import type { Metadata } from "next";
import { Quicksand } from 'next/font/google'
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "@/contexts/app-context";
import AppShell from "@/components/layout/app-shell";
import { apiGetSiteSetting } from "@/services/setting";
import { getThemeKey, getThemeStylesheetHref } from "@/config/theme";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "DefZone.Net - Home",
  description: "DefZone.Net - Home",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSettings = await apiGetSiteSetting();

  const initialThemeKey = getThemeKey(initialSettings?.theme);
  const initialThemeStylesheetHref = getThemeStylesheetHref(initialThemeKey);

  return (
    <html lang="en" data-scroll-behavior="smooth" data-theme={initialThemeKey.toLowerCase()}>
      <head>
        <link id="app-theme-css" rel="stylesheet" href={initialThemeStylesheetHref} data-theme-link="true" />
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1430352774694606"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body style={quicksand.style}>
        <AppProvider initialSettings={initialSettings}>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
