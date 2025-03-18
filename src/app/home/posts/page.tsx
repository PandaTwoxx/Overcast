import { Topic, Post, formatPost } from "@/lib/models";
import Item from "@/components/modal"
import {sortPosts} from "@/actions";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {User} from "next-auth";
import {getUserId} from "@/api/users";




export default async function Grid() {
    const posts: Post[] = [];

    const currentSession = await auth();

    if (!currentSession?.user) {
        redirect('/login'); // Or handle unauthenticated state as needed
    }
    const user: User = currentSession.user;
    const userId = await getUserId(user.name || "");

    const allPosts = (await sortPosts(userId)) as Topic[];

    allPosts.forEach(async (post) => {
        posts.push(await formatPost(post));
    });
    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl">From the post</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">Posts sourced from the community but handpicked for you.</p>
                </div>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {posts.map((post) => (
                        <Item key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    )
}
