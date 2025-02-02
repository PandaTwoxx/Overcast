import { getUserPost } from "@/api/posts";
import { getUsername } from "@/api/users";
import StackedList from '@/components/stackedList';
import {JSX} from "react/jsx-runtime";
import IntrinsicAttributes = JSX.IntrinsicAttributes;


interface PostData {
    topic: string;
    description: string;
    username: string;
    imageUrl: string;
    upvotes: number;
    downvotes: number;
}

export default async function Ideas() {
    const rows = (await getUserPost(1)).rows;

    const Posts: (IntrinsicAttributes & PostData)[] = await Promise.all(
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