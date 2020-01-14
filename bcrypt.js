const bcrypt = require("bcryptjs");
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.compare = compare;
module.exports.hash = plainTextPass =>
    genSalt().then(salt => hash(plainTextPass, salt));

genSalt()
    .then(salt => {
        // console.log("salt: ", salt);
        return hash("monkey", salt);
    })
    .then(hashedPass => {
        // console.log("hashedPass: ", hashedPass);
        return compare("monkeys", hashedPass);
    })
    .then(val => console.log("val: ", val));
