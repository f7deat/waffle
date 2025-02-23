import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'
import Script from "next/script";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "DefZone.Net - Home",
  description: "DefZone.Net - Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1430352774694606"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className="h-screen flex flex-col" style={inter.style}>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
