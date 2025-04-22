DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS topics;


-- Create the users table
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,  -- Use SERIAL for auto-incrementing integers
                       firstname VARCHAR(255) NOT NULL CHECK (LENGTH(firstname) >= 1),
                       lastname VARCHAR(255) NOT NULL CHECK (LENGTH(lastname) >= 1),
                       username VARCHAR(255) NOT NULL CHECK (LENGTH(username) >= 1),
                       password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
                       CONSTRAINT unique_username UNIQUE(username)
);

-- Create the topics table
CREATE TABLE topics (
                        id SERIAL PRIMARY KEY,
                        topic VARCHAR(255) NOT NULL,
                        description VARCHAR(255),
                        userid INT NOT NULL,
                        upvotes INT NOT NULL DEFAULT 0,  -- Add default values for upvotes and downvotes
                        downvotes INT NOT NULL DEFAULT 0,
                        tags VARCHAR(255) NOT NULL,
                        time DATETIMEZ NOT NULL
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