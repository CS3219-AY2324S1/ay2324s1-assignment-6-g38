import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { ThemeProvider } from "@/components/theme-provider";

import SessionAlert from "@/features/match/components/SessionAlert";
import { Navbar } from "@/features/navbar";
import { Notifications } from "@/features/notifications";

import { Providers } from "./Providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PeerPrep",
  description: "Find your next tech career today",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Navbar />
            <Notifications />
            <div className="container max-w-6xl grow p-8">
              <div className="mt-4">{children}</div>
            </div>
            <SessionAlert />
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
