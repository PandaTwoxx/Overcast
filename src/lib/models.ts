'use server'

import { getUser, getUsername } from '@/api/users'
import { getPost } from '@/api/posts'

export interface User {
    id: number
    firstname: string
    lastname: string
    username: string
    password: string
}

export interface Topic {
    id: number
    topic: string
    description: string
    userid: number
    upvotes: number
    downvotes: number
    tags: string
}

export interface Vote {
    id: number
    topic_id: number
    user_id: number
    vote: boolean
}

export interface Post {
    id: number
    title: string
    description: string
    date: string
    datetime: string
    author: {
        userid: number
        name: string
        upvotes: string
        downvotes: string
        imageUrl: string
    }
}

export interface FormattedVote {
    id: number
    topic_id: number
    user_id: number
    vote: boolean
    name: string
    description: string
    author: {
        username: string
        imageUrl: string
    }
}

export async function formatVote(vote: Vote) {
    const post = (await getPost(vote.topic_id)).rows[0] as Topic
    return {
        id: vote.id,
        topic_id: vote.topic_id,
        user_id: vote.user_id,
        vote: vote.vote,
        name: post.topic,
        description: post.description,
        author: {
            username: await getUsername(String(post.userid)),
        },
    } as FormattedVote
}

export async function formatPost(post: Topic) {
    const user = (await getUser(String(post.userid))) as User
    return {
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
            imageUrl: '/vercel.svg',
        },
    } as Post
}
