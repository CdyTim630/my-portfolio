import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageViewTracker from "@/components/PageViewTracker";
import { siteUrl } from "@/lib/seo";
const geistSans = localFont({ src: "../public/fonts/geist-sans-variable.woff2", variable: "--font-geist-sans", weight: "100 900", display: "swap", preload: false });
const geistMono = localFont({ src: "../public/fonts/geist-mono-variable.woff2", variable: "--font-geist-mono", weight: "100 900", display: "swap", preload: false });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "/icon.svg" },
  title: {
    default: "Ding-Yuan Chen — Data, Backend & Applied AI",
    template: "%s | Ding-Yuan Chen",
  },
  description:
    "Ding-Yuan Chen, Information Management undergraduate at National Taiwan University. Building data systems, backend APIs and intelligent applications. Explore engineering case studies and source code.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ding-Yuan Chen — Engineering Portfolio",
    title: "Ding-Yuan Chen — Data, Backend & Applied AI",
    description:
      "Building reliable data systems and intelligent applications. Engineering work by an NTU Information Management undergraduate.",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
