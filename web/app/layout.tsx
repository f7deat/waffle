import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from 'next/font/google'
import Script from "next/script";
import Footer from "@/components/layout/footer";
import { ConfigProvider } from "antd";
import Header from "@/components/layout/header";

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
      <body style={quicksand.style}>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                borderRadius: 0
              },
              Button: {
                borderRadius: 0
              }
            }
          }}
        >
          <Header />
          {children}
          <Footer />
        </ConfigProvider>
      </body>
    </html>
  );
}
