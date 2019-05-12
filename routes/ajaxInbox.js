const express = require('express');
const router = express.Router()
const User = require('../modals/user').model
const Requests = require('../modals/request').model
const Events   = require('../modals/event').model

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
router.route('/acceptRequest')
    .put(async (req,res)=>{
        let requestId = req.body.requestId
        let updated = await Requests.updateOne({'_id':requestId},{'state':1})
        if(updated){
            res.send({data:1})
        let request = await Requests.findById({'_id':requestId})
        let event = {
            month: request.month,
            day: request.day,
            year:request.year,
            start_time:request.start_time,
            end_time:request.end_time,
            title:request.title,
            description:request.description,
            location:request.location,
            tutor:request.tutor,
            student:request.student,
            attendees:[{_id:request.student},{_id:request.tutor}]
        }

        let eventModel = new Events(event)
        eventModel.save(function(err,event){
            if(err) return console.error(err)
        })
        }else{
            res.send({data:0})
        }
    })
router.route('/rejectRequest')
    .put(async (req,res)=>{
        let requestId = req.body.requestId
        let updated = await Requests.updateOne({'_id':requestId},{'state':2})
        if(updated){
            res.send({data:1})
        }else{
            res.send({data:0})
        }
    })
  module.exports = router
