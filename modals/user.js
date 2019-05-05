// 1
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
// 2
const userSchema = new Schema({
  email: String,
  username: String,
  hashedPassword: String
}, {
 
  // 3
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
},{
      collection:'userInfo' 
  }
)
 
// 4
const User = mongoose.model('user', userSchema)
module.exports.model = mongoose.model('User',userSchema)
module.exports.hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(10)
      return await bcrypt.hash(password, salt)
    } catch(error) {
      throw new Error('Hashing failed', error)
    }
}
module.exports.compareHash = async (password,hash) =>{
  try{
    if(password && hash){
      return await bcrypt.compare(password,hash)
    }
  }catch(error){
    throw new Error('comparing hash passwords failed')
  }
}