//this allow to comunicate with postgres

const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// db.query(`SELECT * FROM cities`).then(result => console.log(result));
// You can only get the rows in the Object

exports.getSignatures = function() {
    return db.query(`SELECT * FROM signatures`).then(({ rows }) => rows);
};

// whenever we add values to queries, use $number to protect from attaks

exports.addSignatures = function(signature, user_id) {
    return db.query(
        `INSERT INTO signatures (signature, user_id)
        VALUES ($1, $2)
        returning id`,
        [signature, user_id]
    );
};

exports.getUsersEmail = function(email) {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

exports.getUsers = function() {
    return db.query(`SELECT * FROM users`).then(({ rows }) => rows);
};

// whenever we add values to queries, use $number to protect from attaks

exports.addUsers = function(first, last, email, hashedPass) {
    return db.query(
        `INSERT INTO users (first, last, email, hashedPass)
        VALUES ($1, $2, $3, $4)
        returning id`,
        [first, last, email, hashedPass]
    );
};

exports.getProfiles = function() {
    return db.query(`SELECT * FROM profiles`).then(({ rows }) => rows);
};

exports.addProfiles = function(age, city, url, user_id) {
    return db.query(
        `INSERT INTO profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        returning id`,
        [age, city, url, user_id]
    );
};

exports.getSigners = function() {
    return db
        .query(
            `SELECT signatures.user_id, users.first, users.last, profiles.age, profiles.city, profiles.url FROM signatures LEFT OUTER JOIN users ON signatures.user_id = users.id LEFT OUTER JOIN profiles ON users.id = profiles.user_id;
`
        )
        .then(({ rows }) => rows);
};
