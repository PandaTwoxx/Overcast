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

async function deletePost(postId: number){
    try {
        await queryDatabase("DELETE FROM topics WHERE id = $1", [postId]);
        await queryDatabase("DELETE FROM votes WHERE topic_id = $1", [postId]);
    } catch(error){
        console.error(error);
    }
}

async function getUserPost(userId: number | string){
    return (await queryDatabase("SELECT * FROM topics WHERE userid = $1", [userId]));
}

async function getPostId(userId: number, topic: string, description: string){
    return (await queryDatabase("SELECT * FROM topics WHERE userid = $1 AND topic = $2 AND description = $3", [userId, topic, description]));
}

export { newPost, getPostsVotes, deletePost, getUserPost, getPostId };