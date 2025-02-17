'use client';

import { getUserPost } from "@/api/posts";
import { getUsername, getUserId } from "@/api/users";
import StackedList from '@/components/stackedList';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import React, {useEffect, useState} from 'react'
import {User} from "next-auth";


interface PostData {
    topic: string;
    description: string;
    username: string;
    imageUrl: string;
    upvotes: number;
    downvotes: number;
}

export default function Ideas() {
    const [user, setUser] = useState<User>({});//await auth();
    useEffect(() => {
        const getSessionData = async () => {
            try {
                const currentSession = await auth();

                if (!currentSession?.user) {
                    redirect('/login'); // Or handle unauthenticated state as needed
                }
                setUser(currentSession.user);
            }catch (e){
                throw e;
            }
        }
        getSessionData().then(r => {console.log(r)});
    }, [])
    const [posts, setPosts] = useState<(PostData)[]>([]);
    useEffect(() => {
        const getPosts = async () => {
            try {
                const rows = (await getUserPost(user.id || await getUserId(user.name || ""))).rows;
                setPosts(await Promise.all(
                    rows.map(async (row) => ({
                        ...row,
                        username: (await getUsername(row.userid)) as string,
                        imageUrl: '/vercel.svg', // Replace with actual image URL logic
                    }))
                ));
            } catch (e) {
                throw e;
            }
        }

        getPosts().then(r => {console.log(r)});
    }, [user.id, user.name]);

    return (
        <>
            <div className="px-5 relative">
            <h1>Users</h1>
            <StackedList posts={posts}/>
            <button
                className="absolute bottom-0 right-10 inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span
                    className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Add Idea
                </span>
            </button>
        </div>
        </>
);
}