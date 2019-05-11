const shortid = require("shortid");
const router = require("express").Router();

/*
    Topic strucutre in database
        id - id generated from shortid
        title - title of topic
        description - description of topic
        postDate - post date of topic
        category - category the topic belongs to
        comments - array of comment ids that belong to this topic
*/
module.exports = (db) => {
    const topicsDb = require("../database/topics")(db);
    const commentsDb = require("../database/comments")(db);

    router.get("/new", (req, res) => {
        res.render("newTopic", {layout:"main"});
    });

    router.get("/:id", (req, res) => {
        const topicId = req.params.id;

        topicsDb.getTopic(topicId)
        .then(commentsDb.getAllComments)
        .then((data) => {
            res.render("topic", { topic: data.topic, comments: data.comments });
        }).catch((err) => {
            console.log(err);
            res.status(404).render("404Page");
        });
    });

    router.post("/new", (req, res) => {
        const newTopic = {
            id: shortid.generate(),
            title: req.body.title,
            description: req.body.description,
            postDate: Date.now(),
            category: req.body.category,
            comments: []
        };

        db.collection('topics').insertOne(newTopic, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            }

            else {
                res.status(200).json({ topicId: newTopic.id });
            }
        });
    });

    return router;
};
