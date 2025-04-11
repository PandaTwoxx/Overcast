'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { createUser, verifyUsername } from '@/api/users'
import { getAllPosts, newPost } from '@/api/posts'
import { getVotes } from '@/api/votes'
import * as API from '@/api/gemini'
import { redirect } from 'next/navigation'
import * as models from '@/lib/models'
import { revalidatePath } from 'next/cache'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

export async function signUp(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        if (
            formData.get('username') == null ||
            formData.get('password') == null ||
            formData.get('lastname') == null ||
            formData.get('firstname') == null
        ) {
            return 'Please fill in all fields smart guy.'
        }
        if (await verifyUsername(formData.get('username') as string))
            return 'Username already exists.'
        await createUser(
            (formData.get('username') || '').toString(),
            (formData.get('password') || '').toString(),
            (formData.get('firstname') || '').toString(),
            (formData.get('lastname') || '').toString()
        )
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

export async function addPost(form: FormData) {
    const topic = String(form.get('topic'))
    const description = String(form.get('description'))
    const id = Number(form.get('id'))
    if (!topic || !description) {
        redirect('/home')
    }
    const tags = extractArray(await API.gemini(topic, description))
    await newPost(id, topic, description, tags.toString())
    redirect('/home/ideas')
}

function extractArray(outputString: string) {
    // Trim the output:  from the string
    let trimmedString = outputString.replace(' output: ', '')
    trimmedString = trimmedString.replace('output: ', '')

    // Remove the square brackets
    const bracketlessString = trimmedString.substring(
        1,
        trimmedString.length - 2
    )

    // Split the string by commas
    const stringArray = bracketlessString.split(', ')

    // Remove the quotation marks from each element
    // Return the final array
    return stringArray.map((str) => str.substring(1, str.length - 1))
}

export async function sortPosts(userId: number) {
    const posts = (await getAllPosts()) as models.Topic[]
    //console.log(posts)
    const votedPosts: models.Topic[] = []
    const unvotedPosts: models.Topic[] = []
    //console.log(posts.length)
    for (let i = 0; i < posts.length; i++) {
        //console.log(i)
        if (await postVoted(userId, posts[i].id)) {
            votedPosts.push(posts[i])
        } else {
            unvotedPosts.push(posts[i])
        }
    }
    //console.log('Voted posts:', votedPosts)
    //console.log('Unvoted posts:', unvotedPosts)
    unvotedPosts.sort((a, b) => {return (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes)})
    return unvotedPosts
}

async function postVoted(userId: number, postId: number) {
    const votes = (await getVotes(userId)).rows as models.Vote[]
    for (let i = 0; i < votes.length; i++) {
        if (votes[i].topic_id == postId) {
            return true
        }
    }
    return false
}

export async function refreshCache() {
    revalidatePath('/home/posts')
}
