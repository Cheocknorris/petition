const express = require("express");
const app = express();
const hb = require("express-handlebars");
const signatures = require("./signatures");
const cookieSession = require("cookie-session");
// const csurf = require("csurf");

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

// app.use(csurf());

// don't forget this middleware, to prevent CSRF attacks,
// and add <input type="hidden" name="_csrf" value="{{csrfToken}}"> in each form we add

// app.use(function(req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

app.get("/", (req, res) => {
    if (req.session.signature) {
        res.redirect("/thanks");
    } else {
        res.redirect("/petition");
    }
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
    let first = req.body.first;
    let last = req.body.last;
    let signature = req.body.signature;
    let cookie = req.session;
    console.log("first: ", first);
    console.log("last: ", last);
    console.log("signature: ", signature);
    // if you don't have req.session."keyname" (which I have to set) and signature is not empty, set cookie (cookie.signId = result.rows[0].id)

    signatures
        .addSignatures(first, last, signature)
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
        .getSignatures()
        .then(rows => {
            console.log(rows);
            res.render("signers", {
                layout: "main",
                rows
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(8080, () => console.log("listening"));

// console.log("req.session before: ", req.session);
// req.session.peppermint = "hello";
// console.log("req.session after: ", req.session);
