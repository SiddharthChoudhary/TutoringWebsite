const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const router = express.Router();

module.exports = (db) => {
    // router.use(bodyParser.json());
    // router.use(bodyParser.urlencoded({ extended: false }));

    router.get("/", (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
        db.collection('topics').find({}).sort({ _id: -1 }).limit(10).toArray((err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            }

            else {
                res.render("home", { layout:"dashboardLayout", pageHeader:"Discussion Board", topics: docs ,username:req.session.user.username});
            }
        });
     } else res.redirect('/users/login');
    });

    return router;
};
