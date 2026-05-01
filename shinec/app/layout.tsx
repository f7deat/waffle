import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { ScrollAnimator } from "@/app/components/site/ScrollAnimator";
import "./globals.css";

config.autoAddCss = false;

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cụm công nghiệp số 2 Đak Đoa | Shinec Gia Lai",
  description:
    "Website chính thức Cụm công nghiệp số 2 Đak Đoa thuộc Công ty Cổ phần Shinec Gia Lai, phát triển theo định hướng ESG, sinh thái và kinh tế tuần hoàn.",
  keywords: [
    "Cụm công nghiệp số 2 Đak Đoa",
    "Shinec Gia Lai",
    "cụm công nghiệp sinh thái",
    "ESG",
    "đầu tư Gia Lai",
  ],
  openGraph: {
    title: "Cụm công nghiệp số 2 Đak Đoa | Shinec Gia Lai",
    description:
      "Mô hình cụm công nghiệp phát triển theo định hướng ESG, hạ tầng đồng bộ và thân thiện môi trường.",
    locale: "vi_VN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollAnimator />
        {children}
      </body>
    </html>
  );
}
