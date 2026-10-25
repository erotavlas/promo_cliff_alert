import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TabNav from "@/components/TabNav";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subscription Tracker",
  description:
    "Track subscriptions, catch promos before they end, and negotiate a better price.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24">
          <TabNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
