const express = require("express");
const app = express();
exports.app = app;
const hb = require("express-handlebars");
const signatures = require("./signatures");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const bcrypt = require("./bcrypt");
// helmet = require("helmet"); Need to do this later
let errorMessage;
let cookie;

//this configures express to use express-handlebars
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(
    cookieSession({
        secret: "I'm always angry",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
// secret encrips and maxAge determines the time length that the session will be open
// to put id into cookie, when we insert we can  use the sql return syntax

app.use(csurf());
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// don't forget this middleware, to prevent CSRF attacks,
// and add <input type="hidden" name="_csrf" value="{{csrfToken}}"> in each form we add

app.get("/", (req, res) => {
    console.log("cookie at /:", req.session);
    if (req.session.signature) {
        res.redirect("/thanks");
    } else if (req.session.userId) {
        res.redirect("/petition");
    } else {
        res.redirect("/register");
    }
});

app.get("/register", (req, res) => {
    if (req.session.signature) {
        res.redirect("/thanks");
    } else if (req.session.userId) {
        res.redirect("/petition");
    } else {
        res.render("register", {
            title: "Register",
            layout: "main"
        });
    }
});

// app.get("/", (req, res) => {
//     if (req.session.signature) {
//         res.redirect("/thanks");
//     } else {
//         res.redirect("/petition");
//     }
// });

app.post("/register", (req, res) => {
    // console.log("post req happening");
    // console.log("req body: ", req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    let hashedPass;
    cookie = req.session;

    // console.log("first: ", first);
    // console.log("last: ", last);
    // console.log("email: ", email);
    // console.log("password: ", password);

    bcrypt
        .hash(password)
        .then(hashPass => {
            // console.log("hashPass: ", hashPass);
            hashedPass = hashPass;
            return hashedPass;
        })
        .then(hash => {
            console.log(hash);
            return signatures.addUsers(first, last, email, hashedPass);
        })
        .then(results => {
            // console.log("result: ", result);
            cookie.userId = results.rows[0].id;
            console.log("cookie.userId: ", cookie.userId);
            res.redirect("/profile");
        })
        .catch(err => {
            console.log("err: ", err);
            res.render("register", {
                err
            });
        });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        title: "Profile",
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    let age = req.body.age;
    let city = req.body.city;
    let url = req.body.url;
    console.log("age: ", age);
    console.log("city: ", city);
    console.log("url: ", url);
    cookie = req.session;
    console.log("post req in profile happening");
    // console.log("req body: ", req.body);

    signatures
        .addProfiles(age, city, url, cookie.userId)
        .then(results => {
            console.log("results: ", results);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("err: ", err);
        });
});

app.get("/login", (req, res) => {
    if (req.session.signature) {
        res.redirect("/thanks");
    } else if (req.session.userId) {
        res.redirect("/petition");
    } else {
        res.render("login", {
            title: "Log in",
            layout: "main",
            errorMessage
        });
    }
});

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    cookie = req.session;

    signatures
        .getUsersEmail(email)
        .then(results => {
            console.log("results: ", results);
            if (results.rows.length > 0) {
                bcrypt
                    .compare(password, results.rows[0].hashedpass)
                    .then(comparison => {
                        console.log("comparison:", comparison);
                        if (comparison) {
                            errorMessage = false;
                            cookie.userId = results.rows[0].id;
                            res.redirect("/petition");
                        } else {
                            errorMessage = true;
                            res.redirect("/login");
                        }
                    });
            }
        })
        .catch(err => {
            console.log("err: ", err);
            res.render("login", {
                err
            });
        });
});

app.get("/petition", (req, res) => {
    if (req.session.signature) {
        res.redirect("/thanks");
    } else {
        res.render("petition", {
            title: "Petition",
            layout: "main"
        });
    }
});

app.post("/petition", (req, res) => {
    // console.log("post req happening");
    // console.log("req body: ", req.body);
    cookie = req.session;
    let signature = req.body.signature;
    console.log("signature: ", signature);
    // if you don't have req.session."keyname" (which I have to set) and signature is not empty, set cookie (cookie.signId = result.rows[0].id)

    signatures
        .addSignatures(signature, cookie.userId)
        .then(function(results) {
            console.log("results: ", results);
            console.log("results id: ", results.rows[0].id);
            cookie.signature = results.rows[0].id;
            console.log("cookie: ", cookie.signature);
            res.render("thanks", {
                signature
            });
        })
        .catch(err => {
            console.log("err: ", err);
            res.render("petition", {
                err
            });
        });
});

// to get id add another then to addSignatures return => console.log(result)

app.get("/thanks", (req, res) => {
    res.render("thanks", {
        title: "Thanks",
        layout: "main"
    });
});

app.get("/signers", (req, res) => {
    signatures
        .getSigners()
        .then(rows => {
            console.log(rows);
            res.render("signers", {
                layout: "main",
                rows
            });
        })
        .catch(err => {
            console.log("err: ", err);
        });
});

app.get("/signers/:city", (req, res) => {
    // let city = req.params.city;
    console.log("city: ", req.params.city);
    signatures
        .getSignersByCity(req.params.city)
        .then(rows => {
            console.log("rows: ", rows);
            res.render("city", {
                layout: "main",
                rows
            });
        })
        .catch(err => {
            console.log("err: ", err);
        });
});

app.get("/profile/edit", (req, res) => {
    console.log("edit req happening");
    console.log("session at edit: ", req.session);
    signatures
        .getUsersData(req.session.userId)
        .then(rows => {
            console.log("rows", rows);
            res.render("edit", {
                layout: "main",
                rows,
                errorMessage
            });
        })
        .catch(err => {
            console.log("err: ", err);
        });
});

app.post("/profile/edit", (req, res) => {
    console.log("post req in edit happenig");
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    let hashedPass;
    let userId = req.session.userId;
    console.log("first: ", first);
    console.log("last: ", last);
    console.log("email: ", email);
    console.log("password: ", password);
    console.log("userId: ", userId);
    let age = req.body.age;
    let city = req.body.city;
    let url = req.body.url;
    console.log("age: ", age);
    console.log("city: ", city);
    console.log("url: ", url);
    console.log("req.session.userId: ", req.session.userId);

    if (password) {
        if (!first || !last || !email) {
            errorMessage = true;
            res.redirect("/profile/edit");
        } else {
            errorMessage = false;
            bcrypt
                .hash(password)
                .then(hashPass => {
                    // console.log("hashPass: ", hashPass);
                    hashedPass = hashPass;
                    console.log("hashedPass: ", hashedPass);
                    return hashedPass;
                })
                .then(hash => {
                    console.log(hash);
                    return signatures.updateUsersPass(
                        userId,
                        first,
                        last,
                        email,
                        hashedPass
                    );
                })
                .then(() => {
                    signatures.updateProfiles(age, city, url, userId);
                })
                .then(() => {
                    res.redirect("/signers");
                })
                .catch(err => {
                    console.log("err: ", err);
                });
        }
    } else if (!password) {
        if (!first || !last || !email) {
            errorMessage = true;
            res.redirect("/profile/edit");
        } else {
            return signatures
                .updateUsers(userId, first, last, email)
                .then(() => {
                    signatures.updateProfiles(age, city, url, userId);
                })
                .then(() => {
                    res.redirect("/signers");
                })
                .catch(err => {
                    console.log("err: ", err);
                });
        }
    }
});

app.post("/signature/delete", (req, res) => {
    console.log("delete signature request");
    console.log("signature id: ", req.session.signature);
    signatures
        .deleteSignatures(req.session.signature)
        .then(() => {
            req.session.signature = null;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("err: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session.signature = null;
    req.session.userId = null;
    res.redirect("/login");
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => console.log("listening"));
}

// console.log("req.session before: ", req.session);
// req.session.peppermint = "hello";
// console.log("req.session after: ", req.session);
