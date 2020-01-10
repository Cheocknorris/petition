//this allow to comunicate with postgres

const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// db.query(`SELECT * FROM cities`).then(result => console.log(result));
// You can only get the rows in the Object

exports.getSignatures = function() {
    return db.query(`SELECT * FROM signatures`).then(({ rows }) => rows);
};

// whenever we add values to queries, use $number to protect from attaks

exports.addSignatures = function(first, last, signature) {
    return db.query(
        `INSERT INTO signatures (first, last, signature)
        VALUES ($1, $2, $3)
        returning id`,
        [first, last, signature]
    );
};
