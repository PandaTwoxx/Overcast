import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import React from 'react';
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overcast Home",
  description: "Overcasting",
};

const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Posts', href: '#', current: false },
  { name: 'Votes', href: '#', current: false },
  { name: 'Ideas', href: '#', current: false },
]


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Analytics />
        <Navbar navigation={navigation}/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
