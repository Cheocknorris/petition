//this allow to comunicate with postgres

const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

exports.getSignatures = function() {
    return db.query(`SELECT * FROM signatures`).then(({ rows }) => rows);
};

exports.getSignerId = function(userId) {
    return db
        .query(`SELECT id FROM signatures WHERE user_id=$1`, [userId])
        .then(({ rows }) => rows);
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
            `SELECT signatures.user_id, first, last, age, city, url FROM signatures LEFT OUTER JOIN users ON signatures.user_id = users.id LEFT OUTER JOIN profiles ON users.id = profiles.user_id;
`
        )
        .then(({ rows }) => rows);
};

exports.getSignersByCity = function(city) {
    return db
        .query(
            `SELECT first, last, age, url
            FROM users
            JOIN signatures
            ON users.id = signatures.user_id
            JOIN profiles
            ON users.id = profiles.user_id
            WHERE LOWER(city) = LOWER($1)`,
            [city]
        )
        .then(({ rows }) => rows);
};

exports.getUsersData = function(id) {
    return db
        .query(
            `SELECT first, last, email, age, city, url
            FROM users
            LEFT OUTER JOIN profiles
            ON users.id = profiles.user_id
            WHERE users.id = $1`,
            [id]
        )
        .then(({ rows }) => rows);
};

exports.updateUsers = function(userId, first, last, email) {
    return db.query(
        `UPDATE users
        SET first = $2, last = $3, email = $4
        WHERE id = $1`,
        [userId, first, last, email]
    );
};

exports.updateUsersPass = function(userId, first, last, email, hashedPass) {
    return db.query(
        `UPDATE users
        SET first = $2, last = $3, email = $4, hashedPass = $5
        WHERE id = $1`,
        [userId, first, last, email, hashedPass]
    );
};

exports.updateProfiles = function(age, city, url, userId) {
    return db.query(
        `INSERT INTO profiles (age, city, url, user_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id)
         DO UPDATE SET age=$1, city=$2, url=$3`,
        [age, city, url, userId]
    );
};
//
exports.deleteSignatures = function(id) {
    return db.query(`DELETE FROM signatures WHERE id=$1`, [id]);
};

//
