import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { verifyUsername, checkPassword, getUserId } from '@/api/users'

interface User {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    const isUser = await verifyUsername(username);
                    if (!isUser) return null;
                    const passwordsMatch = await checkPassword(username, password);
                    const user: User = {
                        id: String(await getUserId(username)),
                        name: username
                    }
                    if (passwordsMatch) return user;
                }
                return null;
            },
        }),
    ],
});