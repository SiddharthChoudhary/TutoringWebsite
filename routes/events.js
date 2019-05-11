const events = require('../modals/event').model;
const users = require('../modals/user').model;
const express = require('express');
const router = express.Router()
const {ObjectId}=require("mongodb");
const Joi = require('joi')


function parseObjectId(id){ 
  id=String(id);  
  //console.log(id)
  // if (!id) throw "You must provide an id to search for";
  // if(typeof id !== "string") throw "The id is not a string.";
  try { 
      return ObjectId.createFromHexString(id);
      
  } catch (e) {
      throw "ObjectId is invalid.";
  }
};

const reqSchema = Joi.object().keys({
  day: Joi.number().required(),
  month: Joi.number().required(),
  year: Joi.number().required(),
  start_time:Joi.number().required(),
  end_time: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  tutor: Joi.string().required(),
  student: Joi.string().required(),
  attendees:Joi.array().items(Joi.string())
})




// @parem: creator(id), day(num), month(num), year(num), start_time(num), end_time(num), title(string), description(string), location(string), attendees(array of id)
async function create(day, month, year, start_time, end_time, title, description, location, a_tutor, a_student, attendees){

  const tutorId=parseObjectId(a_tutor);
  const studentId=parseObjectId(a_student);
  
  attendees=[{ _id: parseObjectId(attendees[0])},
  {_id: parseObjectId(attendees[1])}];


  const result = await new events({day:day, month:month, year:year, start_time:start_time, end_time:end_time, title:title, description:description, location:location, tutor:tutorId, student:studentId, attendees: attendees});
  result.save();
  // return result.ops[0];
}

async function getByTutor(id){
  const parsedId=parseObjectId(id);
  const result=await events.find({tutor: parsedId});
  return result;
}

async function getById(id){
  const parsedId=parseObjectId(id);
  const result=await events.find({"attendees._id":parsedId});
  return result;
}

router.get("/form", (req, res)=>{
  if (req.session.user && req.cookies.user_sid) {
  res.render("requestForm", {layout:"dashboardLayout"});
  return;
 } else res.redirect('/users/login');
});

router.get("/:id", (req, res)=>{
  if (req.session.user && req.cookies.user_sid) {
   const tutorId=req.params.id;
   req.session.tutor=tutorId;
   console.log(req.session.tutor)
   res.redirect("form");
   return;
  //  res.render("requestForm", {layout:"dashboardLayout"});
  }else {
    res.redirect('/users/login');
  return;}
});

router.get("/request/:id", (req, res)=>{
  const tutorId=req.params.id;

});


router.route('/')
 .post((req,res)=>{
    
    // res.render('partials/login',{layout:"loginLayout"});
  })
  .get(async (req,res)=>{
  if (req.session.user && req.cookies.user_sid) {
    // req.session.user
    // users.find({});
  const events=await getById(req.session.user._id)
  if (events !== null) {
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
  res.render('partials/calendar_demo',{layout:"dashboardLayout", pageHeader:"Calendar", username: req.session.user.username, events: JSON.stringify(eventList)});
  return;
}
  // let info={title: "test 1", tutor: "Sam", location: "NB 105", time: "5 pm" };

  //   let events=[
  //       {"Year": , "Month":5, "Day":7,  'Info': info},
  //       {"Year": 2019, "Month":5, "Day":17},
  //       {"Year": 2019, "Month":5, "Day":2},
  //     ];
  else{ res.render('partials/calendar_demo',{layout:"dashboardLayout", pageHeader:"Calendar", username: req.session.user.username, events: JSON.stringify([])});
    return;}
  } else {
    res.redirect('/users/login');
  }
  
});






// // does not support *update* yet

// const remove = async function remove(id){
//   const checkedId = checkObjectId(id);
//   const events = await eventCollection();
//   const deletedEvent = await getById(checkedId);
//   await events.deleteOne({ _id: checkedId });
//   return {
//     deleted: true,
//     data: deletedEvent
//   }
// }


module.exports = router;
