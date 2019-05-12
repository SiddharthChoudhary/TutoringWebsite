const shortid = require("shortid");
const router = require("express").Router();

/*
    Comment strucutre in database
        id - id generated from shortid
        content - content of the comment
        postDate - post date of comment
        topicId - topic this comment belongs to
*/
module.exports = (db) => {
    router.post("/new", (req, res) => {
        if (req.session.user) {
        const newComment = {
            id: shortid.generate(),
            creator:req.session.user._id,
            content: req.body.content,
            postDate: Date.now(),
            topicId: req.body.topicId
        };

        const databasePromises = [];

        databasePromises.push(new Promise((resolve, reject) => {
            db.collection('comments').insertOne(newComment, (err, doc) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                else {
                    resolve();
                }
            });
        }));

        databasePromises.push(new Promise((resolve, reject) => {
            db.collection('topics').update(
                { id: req.body.topicId }, 
                { $push: { comments: newComment.id } },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }

                    else {
                        resolve();
                    }
                }
            );
        }));

        Promise.all(databasePromises).then(() => {
            res.status(200).send();
        }, (err) => {
            console.log(err);
            res.status(500).send();
        });
    } else res.redirect('/users/login');
    });

    return router;
 
};
