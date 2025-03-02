'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser, verifyUsername } from "@/api/users";
import { newPost, getAllPosts } from "@/api/posts";
import { getVotes } from "@/api/votes"
import * as API from "@/api/gemini"
import { redirect } from "next/navigation";
import * as models from "@/lib/models"

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function signUp(
    prevState: string | undefined,
    formData: FormData,
){
    try {
        if(formData.get('username') == null || formData.get('password') == null || formData.get('lastname') == null || formData.get('firstname')){return 'Invalid credentials.';}
        if(!await verifyUsername((formData.get('username') || '').toString())) return 'Username already exists.';
        await createUser((formData.get('username') || '').toString(), (formData.get('password') || '').toString(), (formData.get('first-name') || '').toString(), (formData.get('last-name') || '').toString());
        await authenticate(prevState, formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function addPost(form: FormData){
    const topic = String(form.get('topic'));
    const description = String(form.get('description'));
    const id = Number(form.get('id'));
    if (!topic || !description) {redirect('/home')}
    await newPost(id, topic, description);
    const tags = extractArray(await API.gemini(topic, description))
    redirect('/ideas');
}

function extractArray(outputString: string){
    // Trim the output:  from the string
    let trimmedString = outputString.replace(" output: ", "");
    trimmedString = trimmedString.replace("output: ", "");

    // Remove the square brackets
    const bracketlessString = trimmedString.substring(1, trimmedString.length - 1);

    // Split the string by commas
    const stringArray = bracketlessString.split(', ');

    // Remove the quotation marks from each element
    const finalArray = stringArray.map(str => str.substring(1, str.length - 1));

    // Return the final array
    return finalArray;
}

export async function sortPosts(userId: number){
    const posts = (await getAllPosts()).rows as models.Topic[];
    const votedPosts = posts;
    const unvotedPosts: models.Topic[] = [];
    for(let i = 0; i < posts.length; i++){
        if(await postVoted(userId, posts[i].id)){
            votedPosts.push(posts[i]);
        }else{
            unvotedPosts.push(posts[i]);
        }
    }
}

async function postVoted(userId: number, postId: number){
    const votes = (await getVotes(userId)).rows as models.Vote[];
    for(let i = 0; i < votes.length; i++){
        if(votes[i].topic_id == postId){
            return true;
        }
    }
    return false;
}