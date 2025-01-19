import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import React from 'react';

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
  { name: 'Home', href: '#', current: false },
  { name: 'Posts', href: '#', current: false },
  { name: 'Votes', href: '#', current: false },
  { name: 'Ideas', href: '#', current: true },
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
        <Navbar navigation={navigation}/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
