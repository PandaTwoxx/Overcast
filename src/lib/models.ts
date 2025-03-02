export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
  }
  
  export interface Topic {
    id: number;
    topic: string;
    description: string | null;
    userid: number;
    upVotes: number;
    downVotes: number;
    tags: string;
  }
  
  export interface Vote {
    id: number;
    topic_id: number;
    user_id: number;
    vote: boolean;
  }