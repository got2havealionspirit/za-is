import "./globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BiteBeat",
  description: "Swipe tasty bites, master the beat of cooking, and top the SwipeChef leaderboard.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground")}> 
        <div className="flex min-h-screen flex-col md:flex-row">
          <Nav />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
