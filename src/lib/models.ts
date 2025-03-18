'use server';

import { getUser } from "@/api/users";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
  }
  
  export interface Topic {
    id: number;
    topic: string;
    description: string;
    userid: number;
    upvotes: number;
    downvotes: number;
    tags: string;
  }
  
  export interface Vote {
    id: number;
    topic_id: number;
    user_id: number;
    vote: boolean;
  }

export interface Post {
    id: number
    title: string
    description: string
    date: string
    datetime: string
    author: {
        userid: number;
        name: string
        upvotes: string
        downvotes: string
        imageUrl: string
    }
}

export async function formatPost(post: Topic) {
    const user = (await getUser(String(post.userid))) as User;
    return ({
        id: post.id,
        title: post.topic,
        description: post.description,
        date: '',
        datetime: '',
        author: {
            userid: user.id,
            name: user.username,
            upvotes: String(post.upvotes),
            downvotes: String(post.downvotes),
            imageUrl: '/vercel.svg'
        }
    })
}
