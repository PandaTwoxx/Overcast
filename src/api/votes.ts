'use server';

import queryDatabase from '@/api/query';

async function addVote(userId: number, postId: number, vote: boolean){
    console.log("yay");
    if((await queryDatabase("SELECT * FROM votes WHERE user_id=$1 and topic_id=$2", [userId, postId])).rows.length > 0){return}
    console.log("yay");
    try{
        await queryDatabase("INSERT INTO votes(topic_id, user_id, vote) VALUES ($1, $2, $3);", [postId, userId, vote]);
        const result = await queryDatabase("SELECT * FROM topics WHERE id = $1;", [postId]);
        if(vote){
            await queryDatabase("UPDATE topics SET upVotes = $1 WHERE id = $2;", [result.rows[0].upVotes+1, postId]);
        }else{
            await queryDatabase("UPDATE topics SET downVotes = $1 WHERE id = $2;", [result.rows[0].downVotes+1, postId]);
        }
    } catch(e){
        console.error(e);
    }
}

async function countVotes(postId: number, vote: boolean){
    try{
        const result = await queryDatabase("SELECT * FROM votes WHERE topic_id = $1", [postId]);
        if(vote){
            return result.rows[0].upVotes;
        }else{
            return result.rows[0].downVotes;
        }
    } catch(e){
        console.error(e);
    }
}

async function deleteVote(postId: number, userId: number){
    try{
        const result = await queryDatabase("SELECT * FROM votes WHERE topic_id = $1 AND user_id = $2;", [postId, userId]);
        await queryDatabase("DELETE FROM votes WHERE topic_id = $1 AND user_id = $2;", [postId, userId]);
        if(result.rows[0].vote){
            await queryDatabase("UPDATE topics SET upVotes = $1 WHERE id = $2;", [result.rows[0].upVotes-1, postId]);
        }else{
            await queryDatabase("UPDATE topics SET downVotes = $1 WHERE id = $2;", [result.rows[0].downVotes-1, postId]);
        }
    }catch(e){
        console.error(e);
    }
}

async function getVotes(userId: number){
    console.log(userId);
    return (await queryDatabase("SELECT * FROM votes WHERE user_id = $1", [userId]));
}

async function getPostVotes(postId: number){
    return (await queryDatabase("SELECT * FROM votes WHERE topic_id = $1", [postId])).rows[0];
}

async function getUserPostVotes(postId: number, userId: number){
    return (await queryDatabase("SELECT * FROM votes WHERE topic_id = $1 AND user_id = $2", [postId, userId])).rows[0];
}

export { addVote, countVotes, deleteVote, getVotes, getPostVotes, getUserPostVotes };