var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    id: String,
    creator: String,
    content: String,
    postDate: Number,
    topicId: String
})

module.exports.model = mongoose.model('comment', commentSchema)