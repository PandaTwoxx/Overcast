'use server';

import { getUserPost } from "@/api/posts";
import { getUsername, getUserId } from "@/api/users";
import StackedList from '@/components/stackedList';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {User} from "next-auth";
import AddButton from '@/components/addButton';

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

            <AddButton />
        </>
);
            }