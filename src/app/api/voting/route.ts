import { changeVote } from "@/api/votes"
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
    const vote = searchParams.get('vote');
    const post = searchParams.get('post');
    if (!vote || !post) {redirect('/home')}
    if(vote == "up"){
        await changeVote(1, Number(post), true);
    }else if(vote == "down"){
        await changeVote(1, Number(post), false);
    }
    //TODO implement dis redirect(nextTopic())
    return new Response('yay', {status: 200});
}