'use client'

import { searchPosts } from "@/actions"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Topic, Post, formatPost } from "@/lib/models"
import StackedList from "@/components/searchList"
import { Suspense } from "react"

function SearchResults() {
    const [posts, setPosts] = useState<Post[]>([]);
    const searchParams = useSearchParams();
    const query = searchParams.get('s');

    useEffect(() => {
        const fetchPosts = async () => {
            const topics: Topic[] = await searchPosts(query || '');
            const formattedPosts = await Promise.all(
                topics.map((topic) => formatPost(topic))
            );
            setPosts(formattedPosts);
        };

        fetchPosts();
    }, [query]);

    return (
        <div className="px-5 relative">
            <h2 className="text-2xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white">
                Search Results
            </h2>
            <StackedList posts={posts || []} />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}