import type { Metadata } from 'next'
import '../../globals.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
    title: 'Overcast Home',
    description: 'Overcasting',
}

const navigation = [
    { name: 'Home', href: '/home', current: true },
    { name: 'Posts', href: '/home/posts', current: false },
    { name: 'Votes', href: '/home/votes', current: false },
    { name: 'Ideas', href: '/home/ideas', current: false },
]

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Analytics />
            <SpeedInsights />
            <Navbar navigation={navigation} />
            {children}
            <Footer />
        </>
    )
}
