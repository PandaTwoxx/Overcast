import queryDatabase from '@/api/query';

async function newPost(userId: number, topic: string, description: string){
    try{
        await queryDatabase("INSERT INTO topics(userid, topic, description) VALUES ($1,$2,$3);", [userId, topic, description]);
    } catch(error){
        console.error(error);
    }
}

async function getPostsVotes(postId: number, vote: boolean){
    const result = await queryDatabase("SELECT * FROM topics WHERE id = $1", [postId]);
    if(vote){
        return result.rows[0].upVotes;
    }else{
        return result.rows[0].downVotes;
    }
}

async function deletePost(userId: number, postId: number){
    try {
        await queryDatabase("DELETE FROM topics WHERE id = $1 AND userid", [postId, userId]);
        await queryDatabase("DELETE FROM votes WHERE topic_id = $1", [postId]);
    } catch(error){
        console.error(error);
    }
}

async function getUserPost(userId: number){
    return (await queryDatabase("SELECT * FROM topics WHERE id = $1", [userId]));
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { newPost, getPostsVotes, deletePost, getUserPost };