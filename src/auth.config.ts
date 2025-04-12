import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/home')
            const isOnHome = nextUrl.pathname.valueOf() === '/'
            if (isOnDashboard) {
                return isLoggedIn
            } else if (isLoggedIn && isOnHome) {
                return Response.redirect(new URL('/home', nextUrl))
            }
            return true
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
