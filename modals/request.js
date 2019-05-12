// 1
const mongoose = require('mongoose')
const Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId;
// 2
const reqSchema = new Schema({
  month: Number,
  day: Number,
  year: Number,
  start_time: String,
  end_time: String,
  title: String,
  description: String,
  location: String,
  // attendees: [ObjectId], gonna use 2 data fields to specify who's the tutor and who's the student
  tutor: ObjectId,
  student: ObjectId,
  state: Number // initialize to 0. If approved, set to 1. If rejected, set to 2
}, {
 
  // 3
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
}
)
 
// 4
//const User = mongoose.model('user', userSchema)
module.exports.model = mongoose.model('request',reqSchema)
