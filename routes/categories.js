const router = require("express").Router();
const validCategories = ["study", "social", "health"];

module.exports = (db) => {
    router.get("/:category", (req, res) => {
        if (req.session.user) {
        const category = req.params.category;

        if (validCategories.indexOf(category) > -1) {            
            db.collection('topics').find({ category }).sort({ _id: -1 }).limit(10).toArray((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                }

                else {
                    res.render("category", { layout:"dashboardLayout", pageHeader:"Discussion Board", topics: docs,username:req.session.user.username });
                }
            });
        }

        else {
            res.status(404).render("404Page");
        }

      } else res.redirect('/users/login');

    });

    return router;
};
