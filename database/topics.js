module.exports = (db) => {
    return {
        getTopic(topicId) {
            return new Promise((resolve, reject) => {
                db.collection('topics').findOne({ id: topicId }, (err, doc) => {
                    if (err || !doc) {
                        reject(err);
                    }

                    else {
                        resolve(doc);
                    }
                });
            });
        }
    };
};
