'use server';

import { getVotes } from "@/api/votes";
import { getUserId } from "@/api/users";
import StackedList from '@/components/stackedList';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { User } from "next-auth";
import AddButton from '@/components/addButton';
import {FormattedVote, formatVote, Post, Vote} from "@/lib/models";
import VoteList from "@/components/voteList";

export default async function Voting() {
    const currentSession = await auth();

    if (!currentSession?.user) {
        redirect('/login'); // Or handle unauthenticated state as needed
    }
    const user: User = currentSession.user;

    const rows = ((await getVotes(user.id || await getUserId(user.name || ""))).rows) as Vote[];
    const votes: FormattedVote[] = rows != undefined && rows.length > 0
        ? await Promise.all(rows.map(async (row) => await formatVote(row)))
        : [];
    return (
        <>
            {votes.length > 0 ? (
                <div className="px-5 relative">
                    <h2 className="text-2xl py-5 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-3xl">Votes</h2>
                    <VoteList votes={votes}/>
                </div>
            ) : (
                <div className="px-5 relative">
                    <h2 className="text-2xl py-5 font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-3xl">Votes</h2>
                    <h3>Start voting to see your votes appear here</h3>
                </div>
            )}
        </>
    );
}