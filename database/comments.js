module.exports = (db) => {
    return {
        getAllComments(topic) {
            const commentIds = topic.comments;

            return new Promise((resolve, reject) => {
                db.collection('comments').find({ id: { $in: commentIds }}).toArray((err, docs) => {
                    if (err) {
                        reject(err);
                    }

                    else {
                        const comments = docs.sort((a, b) => {
                            if (a.postDate < b.postDate) {
                                return 0;
                            }

                            else if (a.postDate > b.postDate) {
                                return 1;
                            }

                            else {
                                return 0;
                            }
                        });

                        resolve({ topic, comments });
                    }
                });
            });
        }
    };
};
