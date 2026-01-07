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
      <body style={quicksand.style} className="bg-slate-100">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                borderRadius: 0,
                colorBorder: '#e2e8f0'
              },
              Button: {
                borderRadius: 0
              },
              Select: {
                colorBorder: '#e2e8f0'
              }
            },
            token: {
              fontFamily: "'Quicksand', sans-serif"
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
