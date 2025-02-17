'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {createUser, verifyUsername} from "@/api/users";

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