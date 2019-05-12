const events = require('../modals/event').model;
const users = require('../modals/user').model;
const express = require('express');
const router = express.Router()
const {ObjectId}=require("mongodb");
const Joi = require('joi')


// Author Jack Zhou
function parseObjectId(id){ 
  id=String(id);  
  try { 
      return ObjectId.createFromHexString(id);
      
  } catch (e) {
      throw "ObjectId is invalid.";
  }
};

async function getById(id){
    const parsedId=parseObjectId(id);
    const result=await events.find({"attendees._id":parsedId});
    return result;
  }


async function parseEvent(id){
    const events=await getById(id)
    console.log("event length "+events.length)
    // if(events.length===0) return false;
    //console.log(events)
    if (events.length!== 0) {
    let eventList=[];
    for (let i=0; i<events.length;i++){
       const parsedId=parseObjectId(events[i].tutor)
       const tutor=await users.find({_id: parsedId});
       console.log(tutor)
       const tutorName=tutor[0].profile.firstname +" "+tutor[0].profile.lastname;
       const time=events[i].start_time+"-"+events[i].end_time
       const info={title: events[i].title, tutor: tutorName, location: events[i].location, 
    time: time}
       const event={"Year": events[i].year, "Month": events[i].month, "Day": events[i].day,
      "Info": info}
       eventList.push(event);
    }
     return eventList;
   } else {
     console.log("false")
     return false;
    };
  };


  const uploadSchema = Joi.object().keys({
    title: Joi.string().email().required(),
    description: Joi.string().required(),
    link: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
  })

  router.get(('/'),async (req, res)=>{
    if (req.session.user) {
      const ppl= await users.find({"profile.tutor_position": "Taken"})
      //query.exec(function (err, docs) {});
      if(ppl.length){
        let tutors=ppl;
        res.render('partials/tutors',{layout:"dashboardLayout", pageHeader:"Tutors", username: req.session.user.username, tutors:tutors});
        return;
      }else{
        req.flash("error","No tutors available")
        res.redirect('/dashboard')
        return;
      }
    } else {
      res.redirect('users/login');
    }
   })

//route for viewing tutor's posted resources
router.get('/resource/:id', async function(req,res,next){
    if(!req.session.user){
      res.redirect('users/login')
      //console.log("dash")
    }else{
      //console.log(req.session.user);
      res.render('partials/default',{layout:"dashboardLayout", pageHeader:"Dashboard", username: req.session.user.username})
       
      } 
  });

  //route for viewing tutor events
router.get("/event/:id", async (req, res)=>{
    if (req.session.user) {
     req.session.tutor=req.params.id;
     let eventList=await parseEvent(req.params.id);
     console.log(eventList)
     if(eventList){
     res.render('partials/calendar_demo', {layout:"dashboardLayout", pageHeader:"Calendar", 
     username: req.session.user.username, events: JSON.stringify(eventList), returnBtn: true});
     return;
    } else { 
      console.log("no event");
      res.render('partials/calendar_demo',{layout:"dashboardLayout", pageHeader:"Calendar", 
      username: req.session.user.username, events:false, returnBtn: true});
      return;
      }
    }else {
      res.redirect('/users/login');
    }
  });

  //route for making request
router.get("/request/:id", (req, res)=>{
    if (req.session.user) {
      req.session.tutor=req.params.id;
      res.render("requestForm", {layout:"dashboardLayout", pageHeader:"Request Form", username: req.session.user.username});
      return;
     } else {
       res.redirect('/users/login');
       return;
     }
  });

  //for uploading study material links to show on a page
  router.post("/upload", (req, res)=>{
    if (req.session.user) {
      const tutorId=req.session.user._id;
      //res.render("requestForm", {layout:"dashboardLayout", pageHeader:"Request Form", username: req.session.user.username});
      return;
     } else {
       res.redirect('/users/login');
       return;
     }
  });

module.exports=router;