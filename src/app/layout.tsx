import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { OrganizationSchema } from "@/components/SchemaMarkup";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: "Capped Out Labs — AI Revenue Infrastructure for Operators",
    template: "%s | Capped Out Labs",
  },
  description:
    "AI transformation firm that builds production systems, not strategy decks. Revenue-first. Exit-prep framing. From the team behind Capped Out Media.",
  metadataBase: new URL("https://cappedoutlabs.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cappedoutlabs.com",
    siteName: "Capped Out Labs",
    title: "Capped Out Labs — AI Revenue Infrastructure for Operators",
    description:
      "AI transformation firm that builds production systems, not strategy decks. Revenue-first. Exit-prep framing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capped Out Labs — AI Revenue Infrastructure for Operators",
    description:
      "AI transformation firm that builds production systems, not strategy decks.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
