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
            //console.log(requestsArray)
            res.send({data:requestsArray})
        }else{
            res.send({data:[]})
        }
    }else{
        res.redirect('/')
    }
    })


async function validateEvent(id, request){
  const event=await Events.find({'attendees._id':id});
  console.log("false")
  // validate event to avoid having more than one event on one day
  for(let i=0;i<event.length; i++){
     if(event[i].month===request.month &&event[i].day===request.day &&
        event[i].year===request.year ){ console.log(false);
             return false}
  } return true;
}

router.route('/acceptRequest')
    .put(async (req,res)=>{
        let requestId = req.body.requestId
        let updated = await Requests.updateOne({'_id':requestId},{'state':1})
        if(updated){
            res.send({data:1})
        let request = await Requests.findById({'_id':requestId})
        if(!await validateEvent(req.session.user._id, request)){
           req.flash('error',"You have already scheduled an event on that day!")
           return;
        }else{

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
        }
       }
        else{
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
