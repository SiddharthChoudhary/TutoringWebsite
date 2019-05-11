
module.exports = (io, db) => {
    const topicsDb = require("../database/topics")(db);
    const commentsDb = require("../database/comments")(db);
    const sockets = {};

    io.on("connection", (socket) => {
        const referer = socket.request.headers.referer;

        if (!sockets[referer]) {
            sockets[referer] = {};
        }

        sockets[referer][socket.id] = socket;

        socket.on("disconnect", () => {
            delete sockets[referer];
        });

        socket.on("updatedComment", (data) => {
            topicsDb.getTopic(data.topicId)
            .then(commentsDb.getAllComments)
            .then((data) => {
                Object.keys(sockets[referer]).forEach((key) => {
                    sockets[referer][key].emit("updateComments", { topic: data.topic, comments: data.comments });
                });
            });
        });
    });
};
