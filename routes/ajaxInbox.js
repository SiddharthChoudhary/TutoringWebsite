const express = require('express');
const router = express.Router()
const Joi = require('joi')
const passport = require('passport')
const mongoose = require('mongoose')
const User = require('../modals/user').model
const Requests = require('../modals/request').model
const hashPassword = require('../modals/user').hashPassword
const compareHash  = require('../modals/user').compareHash
var session = require('express-session');
var path = require('path');

router.route('/')
.get(async (req,res)=>{
    if(req.session.user){
        let user = await User.findOne({'username':req.session.user.username})
        if(user){
            let userId = user._id
            let requestsArray = await Requests.find({'tutor':userId,'state':0})
            res.send({data:requestsArray})
        }else{
            res.send({data:[]})
        }
    }else{
        res.send({data:[]})
    }
    })
  module.exports = router