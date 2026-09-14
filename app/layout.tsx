import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com";

export const viewport: Viewport = {
  themeColor: "#060911",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KNYK Labs — Digital Solutions That Move You Forward",
    template: "%s | KNYK Labs",
  },
  description:
    "High-impact software engineering, visual branding, photo & video production, and custom AI automation studio engineered for ambitious businesses and creators.",
  keywords: [
    "KNYK Labs",
    "digital studio",
    "software development",
    "graphic design",
    "video production",
    "AI automation",
    "Next.js web development",
    "brand identity",
    "workflow automation",
  ],
  authors: [{ name: "KNYK Labs", url: siteUrl }],
  creator: "KNYK Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "KNYK Labs — Digital Solutions That Move You Forward",
    description:
      "High-impact software development, graphic design, photo & video, AI automation, and digital services studio.",
    siteName: "KNYK Labs",
  },
  twitter: {
    card: "summary_large_image",
    title: "KNYK Labs — Digital Solutions That Move You Forward",
    description:
      "High-impact software development, graphic design, photo & video, AI automation, and digital services studio.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-[#060911] text-slate-100 antialiased min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
