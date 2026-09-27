import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Disney Kidz Admin",
  description: "Internal Sales Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full flex flex-col font-sans antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-[260px] flex flex-col">
            <header className="h-[72px] border-b border-border-subtle flex items-center justify-end px-8 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <ThemeToggle />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e2e8f0] text-zinc-600 flex items-center justify-center text-sm font-semibold">
                    D
                  </div>
                  <span className="text-sm font-medium text-foreground">Dev User</span>
                </div>
              </div>
            </header>
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
