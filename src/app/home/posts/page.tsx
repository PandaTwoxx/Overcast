import { getAllPosts } from "@/api/posts";
import { Topic, Post, formatPost } from "@/lib/models";
import Item from "@/components/modal"


const posts: Post[] = [];

const allPosts = (await getAllPosts()) as Topic[];

for (const post of allPosts) {
    posts.push(await formatPost(post));
}

export default function Grid() {
    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl">From the post</h2>
                    <p className="mt-2 text-lg/8 text-gray-600">Posts sourced from the community but handpicked just for you.</p>
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
