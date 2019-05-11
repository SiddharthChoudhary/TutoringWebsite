var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


// creator, day, month, year, start_time, end_time, title, description, location, attendees
const attendee=new Schema({_id: ObjectId})

var eventSchema = new Schema({
    // No need for "Creator" in events
    // creator: ObjectId,
    date: Date,
    start_time: Number,
    end_time: Number,
    title: String,
    description: String,
    location: String,
    // attendees: [ObjectId], gonna use 2 data fields to specify who's the tutor and who's the student
    tutor: ObjectId,
    student: ObjectId,
    attendees:[attendee]
})

// mongoose.model('event', eventSchema);
module.exports.model = mongoose.model('event',eventSchema)