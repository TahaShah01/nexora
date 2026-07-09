import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/components/shared/providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexora — Discover. Connect. Thrive.",
  description:
    "The all-in-one marketplace for products and professional services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
