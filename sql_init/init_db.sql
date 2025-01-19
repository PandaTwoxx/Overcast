DROP DATABASE IF EXISTS overcast;


CREATE DATABASE overcast;


-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Use SERIAL for auto-incrementing integers
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT unique_username UNIQUE(username)
);

-- Create the topics table
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    upVotes INT NOT NULL DEFAULT 0,  -- Add default values for upVotes and downVotes
    downVotes INT NOT NULL DEFAULT 0
);

-- Create the votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    topic_id INT NOT NULL,
    user_id INT NOT NULL,
    vote BOOLEAN NOT NULL, -- True = UpVote, False = DownVote

    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);