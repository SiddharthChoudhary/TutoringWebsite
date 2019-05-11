// 1
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 2
const reqSchema = new Schema({
  
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
