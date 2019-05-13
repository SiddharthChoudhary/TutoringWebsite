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
        if (req.session.user) {
        res.render("newTopic", {layout:"dashboardLayout", pageHeader:"Discussion Board", username:req.session.user.username });
        } else res.redirect('/users/login');
    });

    router.get("/:id", (req, res) => {
        if (req.session.user) {
        const topicId = req.params.id;
        topicsDb.getTopic(topicId)
        .then(commentsDb.getAllComments)
        .then((data) => {
            //compare id here
            const topic=data.topic;
            if(topic.creator=== req.session.user._id)
            {console.log("true")}
            res.render("topic", { layout:"dashboardLayout",pageHeader:"Discussion Board", topic: data.topic, comments: data.comments, username:req.session.user.username });
        }).catch((err) => {
            console.log(err);
            res.status(404).render("404Page");
        });
       } else res.redirect('/users/login');
    });

    router.post("/new", (req, res) => {
    if (req.session.user) {
        //db.collection('users').findOne({_id: req.session.user.});



        const newTopic = {
            id: shortid.generate(),
            creator: req.session.user.username,
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
    }else res.redirect('/users/login');
    });

    return router;
};
