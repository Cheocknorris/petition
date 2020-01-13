DROP TABLE IF EXISTS signatures;

DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first != ''),
    last VARCHAR NOT NULL CHECK (last != ''),
    signature VARCHAR NOT NULL CHECK (signature != ''),
    user_id INT NOT NULL
);


-- optional REFERENCES user(id)
