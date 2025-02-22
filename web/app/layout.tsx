import type { Metadata } from "next";
import "./globals.css";
import Footer from "./layout/footer";

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
      <body className="h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
