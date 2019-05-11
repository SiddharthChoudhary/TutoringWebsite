// 1
const mongoose = require('mongoose')
const Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId;
// 2
const resSchema = new Schema({
  state: Number, // initialize to 0. If approved, set to 1. If rejected, set to 2
  response: String // upon approving/rejecting the request, the tutor should leave a COMMENT
  
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
module.exports.model = mongoose.model('response',resSchema)
