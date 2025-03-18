import queryDatabase from '@/api/query';

async function newPost(userId: number, topic: string, description: string, tags: string){
    try{
        await queryDatabase("INSERT INTO topics(userid, topic, description, tags) VALUES ($1,$2,$3,$4);", [userId, topic, description, tags]);
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

async function getAllPosts(){
    return (await queryDatabase("SELECT * FROM topics")).rows;
}

async function getPost(postId: number){
    return (await queryDatabase("SELECT * FROM topics WHERE id = $1", [postId]));
}

export { newPost, getPostsVotes, deletePost, getUserPost, getPostId, getAllPosts, getPost };