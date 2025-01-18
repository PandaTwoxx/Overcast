DROP DATABASE IF EXISTS overcast;


CREATE DATABASE overcast;


USE overcast;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname varchar(255) NOT NULL,
    lastname varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    CONSTRAINT unique_username UNIQUE(username)
);

CREATE TABLE topics(
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic varchar(255) NOT NULL,
    description varchar(255),
    upVotes INT NOT NULL,
    downVotes INT NOT NULL
);

CREATE TABLE votes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    user_id INT NOT NULL,
    vote BOOLEAN NOT NULL, -- True = UpVote, False = DownVote

    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
