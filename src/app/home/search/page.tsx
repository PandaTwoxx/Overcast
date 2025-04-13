'use client'

import { searchPosts } from "@/actions"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Topic, Post, formatPost } from "@/lib/models"
import StackedList from "@/components/searchList"
import { Suspense } from "react"

export default function Page() {
    const [posts, setPosts] = useState<Post[]>();
    const searchParams = useSearchParams()
    const query = searchParams.get('s');

    useEffect(() => {
        const posts: Post[] = [];
        const find = async () => {
            const topics: Topic[] = await searchPosts(query || '');
            for (let i = 0; i < topics.length; i++) {
                const post: Post = await formatPost(topics[i]);
                posts.push(post);
            }
        }
        find().then(() => {
            setPosts(posts);
        });
    }, [query]);
    return (
        <div className="px-5 relative">
                <h2 className="text-2xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white ">
                    Search Results
                </h2>
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <StackedList posts={posts || []} />
                </Suspense>
            </div>
    )
  }