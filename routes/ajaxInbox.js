const express = require('express');
const router = express.Router()
const User = require('../modals/user').model
const Requests = require('../modals/request').model


router.route('/')
.get(async (req,res)=>{
    if(req.session.user){
        let user = await User.findOne({'username':req.session.user.username})
        if(user){
            let userId = user._id
            let requestsArray = await Requests.find({'tutor':userId})
            console.log(requestsArray)
            res.send({data:requestsArray})
        }else{
            res.send({data:[]})
        }
    }else{
        res.send({data:[]})
    }
    })

  module.exports = router