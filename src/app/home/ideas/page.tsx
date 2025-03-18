'use server';

import { getUserPost } from "@/api/posts";
import { getUserId } from "@/api/users";
import StackedList from '@/components/stackedList';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { User } from "next-auth";
import AddButton from '@/components/addButton';
import { formatPost, Post, Topic } from "@/lib/models";

export default async function Ideas() {
    const currentSession = await auth();

    if (!currentSession?.user) {
        redirect('/login'); // Or handle unauthenticated state as needed
    }
    const user: User = currentSession.user;

    const rows = ((await getUserPost(user.id || await getUserId(user.name || ""))).rows) as Topic[];
    const posts: Post[] = await Promise.all(
        rows.map(async (row) => (formatPost(row)))
    );
    return (
        <>
            <div className="px-5 relative">
                <h2 className="text-2xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white ">My Posts</h2>
                <StackedList posts={posts}/>
            </div>

            <AddButton />
        </>
);
            }