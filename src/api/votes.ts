'use server'

import queryDatabase from '@/api/query'

async function addVote(userId: number, postId: number, vote: boolean) {
    //console.log('yay')
    if (
        (
            await queryDatabase(
                'SELECT * FROM votes WHERE user_id=$1 and topic_id=$2',
                [userId, postId]
            )
        ).rows.length > 0
    ) {
        return
    }
    //console.log('yay')
    try {
        await queryDatabase(
            'INSERT INTO votes(topic_id, user_id, vote) VALUES ($1, $2, $3);',
            [postId, userId, vote]
        )
        const result = await queryDatabase(
            'SELECT * FROM topics WHERE id = $1;',
            [postId]
        )
        if (vote) {
            await queryDatabase(
                'UPDATE topics SET upvotes = $1 WHERE id = $2;',
                [result.rows[0].upvotes + 1, postId]
            )
        } else {
            await queryDatabase(
                'UPDATE topics SET downvotes = $1 WHERE id = $2;',
                [result.rows[0].downvotes + 1, postId]
            )
        }
    } catch (e) {
        console.error(e)
    }
}

async function countVotes(postId: number, vote: boolean) {
    try {
        const result = await queryDatabase(
            'SELECT * FROM votes WHERE topic_id = $1',
            [postId]
        )
        if (vote) {
            return result.rows[0].upvotes
        } else {
            return result.rows[0].downvotes
        }
    } catch (e) {
        console.error(e)
    }
}

async function deleteVote(voteId: number) {
    // Delete the vote by ID and return its details
    const deletedVote = await queryDatabase(
        'DELETE FROM votes WHERE id = $1 RETURNING vote, topic_id;',
        [voteId]
    );

    if (deletedVote.rows.length === 0) {
        // No vote to delete
        throw new Error('Vote not found.');
    }

    const { vote: isUpvote, topic_id: topicId } = deletedVote.rows[0];

    // Update upvotes or downvotes based on the deleted vote
    if (isUpvote) {
        await queryDatabase(
            'UPDATE topics SET upvotes = upvotes - 1 WHERE id = $1;',
            [topicId]
        );
    } else {
        await queryDatabase(
            'UPDATE topics SET downvotes = downvotes - 1 WHERE id = $1;',
            [topicId]
        );
    }
}


async function getVotes(userId: number) {
    //console.log(userId)
    return await queryDatabase('SELECT * FROM votes WHERE user_id = $1', [
        userId,
    ])
}

async function getPostVotes(postId: number) {
    return (
        await queryDatabase('SELECT * FROM votes WHERE topic_id = $1', [postId])
    ).rows[0]
}

async function getUserPostVotes(postId: number, userId: number) {
    return (
        await queryDatabase(
            'SELECT * FROM votes WHERE topic_id = $1 AND user_id = $2',
            [postId, userId]
        )
    ).rows[0]
}

export {
    addVote,
    countVotes,
    deleteVote,
    getVotes,
    getPostVotes,
    getUserPostVotes,
}
