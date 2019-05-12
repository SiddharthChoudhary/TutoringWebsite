var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


// creator, day, month, year, start_time, end_time, title, description, location, attendees


var resourceSchema = new Schema({
    // No need for "Creator" in events
    // creator: ObjectId,
    creator: ObjectId,
    title: String,
    description: String,
    link: String
    
})
// mongoose.model('event', eventSchema);
module.exports.model = mongoose.model('resource', resourceSchema)