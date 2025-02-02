import { newPost } from "@/api/posts"
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
    const topic = searchParams.get('name');
    const description = searchParams.get('description');
    if (!topic || !description) {redirect('/home')}
    await newPost(1, topic, description);
    //TODO implement dis redirect(yay_screen())
    return new Response('yay', {status: 200});
}