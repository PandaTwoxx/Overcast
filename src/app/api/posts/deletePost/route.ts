import { deletePost } from "@/api/posts"
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
    const postid = Number(searchParams.get('postid'));
    if (!postid) {redirect('/home')}
    await deletePost(postid);
    //TODO implement dis redirect(yay_screen())
    return new Response('yay', {status: 200});
}