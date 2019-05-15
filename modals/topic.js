var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var topicSchema = new Schema({
    id: String,
    creator: String,
    title: String,
    description: String,
    postDate: Number,
    category: String,
    comments:[String]
})

module.exports.model = mongoose.model('topic', topicSchema)