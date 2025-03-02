'use server';

import { getUserPost } from "@/api/posts";
import { getUsername, getUserId } from "@/api/users";
import StackedList from '@/components/stackedList';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {User} from "next-auth";


interface PostData {
    topic: string;
    description: string;
    username: string;
    imageUrl: string;
    upvotes: number;
    downvotes: number;
}

export default async function Ideas() {
    const currentSession = await auth();

    if (!currentSession?.user) {
        redirect('/login'); // Or handle unauthenticated state as needed
    }
    const user: User = currentSession.user;

    const rows = (await getUserPost(user.id || await getUserId(user.name || ""))).rows;
    const posts: PostData[] = await Promise.all(
        rows.map(async (row) => ({
            ...row,
            username: (await getUsername(row.userid)) as string,
            imageUrl: '/vercel.svg', // Replace with actual image URL logic
        }))
    );
    return (
        <>
            <div className="px-5 relative">
                <h1>Users</h1>
                <StackedList posts={posts}/>
            </div>

            <div className="fixed end-6 bottom-6 group">
                <button type="button" data-dial-toggle="speed-dial-menu-default" aria-controls="speed-dial-menu-default"
                        aria-expanded="false"
                        className="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-45" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 1v16M1 9h16"/>
                    </svg>
                    <span className="sr-only">Open actions menu</span>
                </button>
            </div>
        </>
);
            }