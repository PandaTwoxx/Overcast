'use server';

import { getUserPost } from "@/api/posts";
import { getUsername } from "@/api/users";
import StackedList from '@/components/stackedList';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';


interface PostData {
    topic: string;
    description: string;
    username: string;
    imageUrl: string;
    upvotes: number;
    downvotes: number;
}

export default async function Ideas() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login'); // Or handle unauthenticated state as needed
    }
    const user = session.user;
    const rows = (await getUserPost(Number(user.id))).rows;

    const Posts: (PostData)[] = await Promise.all(
        rows.map(async (row) => ({
            ...row,
            username: (await getUsername(row.userid)) as string,
            imageUrl: '/vercel.svg', // Replace with actual image URL logic
        }))
    ) ;

    return (
        <>
            <div className="px-5">
                <h1>Users</h1>
                <StackedList posts={Posts} />
            </div>
        </>
    );
}