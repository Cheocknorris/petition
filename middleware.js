exports.requireLogedInUser = function(req, res, next) {
    if (!req.session.userId) {
        res.redirect("/login");
    } else {
        next();
    }
};

exports.requireSignature = function(req, res, next) {
    if (!req.session.signature) {
        res.redirect("/petition");
    } else {
        next();
    }
};
