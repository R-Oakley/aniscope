import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { Providers } from "@/lib/query/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AniScope",
  description: "Discover trending, popular, and upcoming anime.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <nav className="flex gap-4 border-b border-zinc-200 px-8 py-4 dark:border-zinc-800">
            <Link href="/" className="font-medium">
              AniScope
            </Link>
            <Link href="/search" className="text-zinc-500">
              Search
            </Link>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
