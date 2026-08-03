import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaRegistrar } from "@/components/pwa/pwa-registrar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://academy.solvaone.co.ke"),
  title: "Solva Academy",
  description:
    "A Kenyan-first and Africa-ready learning ecosystem for learners, tutors, academies, and organizations.",
  manifest: "/manifest.webmanifest",
  applicationName: "Solva Academy",
  appleWebApp: {
    capable: true,
    title: "Solva Academy",
  },
  openGraph: {
    title: "Solva Academy",
    description: "A Kenyan-first and Africa-ready learning ecosystem.",
    url: "https://academy.solvaone.co.ke",
    siteName: "Solva Academy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
        <PwaRegistrar />
      </body>
    </html>
  );
}
