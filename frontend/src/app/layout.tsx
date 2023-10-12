import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { Navbar } from "@/features/navbar";
import { Notifications } from "@/features/notifications";

import { Providers } from "./Providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          <div className="min-h-screen px-12 py-10">
            <Notifications />
            <Navbar />
            <div className="mt-8">{children}</div>
          </div>
        </body>
      </html>
    </Providers>
  );
}
