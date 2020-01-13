//this allow to comunicate with postgres

const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// db.query(`SELECT * FROM cities`).then(result => console.log(result));
// You can only get the rows in the Object

exports.getSignatures = function() {
    return db.query(`SELECT * FROM signatures`).then(({ rows }) => rows);
};

// whenever we add values to queries, use $number to protect from attaks

exports.addSignatures = function(first, last, signature, userId) {
    return db.query(
        `INSERT INTO signatures (first, last, signature, user_id)
        VALUES ($1, $2, $3, $4)
        returning id`,
        [first, last, signature, userId]
    );
};

exports.getUsers = function(email) {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
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
