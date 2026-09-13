import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Sunghoon LEE | Portfolio",
  description: "Video & Motion Graphics Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-10 bg-background/85 backdrop-blur-xl border-b border-white/[0.06]">
          <Link
            href="/"
            className="text-[17px] font-semibold tracking-wide hover:text-accent transition-colors"
          >
            Sunghoon LEE
          </Link>
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className="text-[13px] text-muted hover:text-foreground transition-colors"
            >
              Work
            </Link>
            <Link
              href="/resume"
              className="text-[13px] text-muted hover:text-foreground transition-colors"
            >
              Resume
            </Link>
            <Link
              href="/contact"
              className="text-[13px] text-muted hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/admin"
              className="text-[12px] text-[#333] hover:text-muted transition-colors"
            >
              Admin
            </Link>
          </div>
        </header>

        <main className="flex-1 pt-[60px]">{children}</main>

        <footer className="border-t border-white/[0.06] py-10">
          <div className="max-w-[1400px] mx-auto px-10 text-center text-xs text-[#444]">
            &copy; {new Date().getFullYear()} Sunghoon LEE. All rights
            reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
