const events = require('../modals/event').model;
const users = require('../modals/user').model;
const requests = require('../modals/request').model;
const express = require('express');
const router = express.Router()
const {ObjectId}=require("mongodb");
const Joi = require('joi')


function parseObjectId(id){ 
  id=String(id);  
  try { 
      return ObjectId.createFromHexString(id);
      
  } catch (e) {
      throw "ObjectId is invalid.";
  }
};

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

const reqSchema = Joi.object().keys({
  date: Joi.date().required(),
  start_time:Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
  end_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required()
})

// @parem: creator(id), day(num), month(num), year(num), start_time(num), end_time(num), title(string), description(string), location(string), attendees(array of id)
async function create(date, start_time, end_time, title, description, location, a_tutor, a_student, attendees){

  const tutorId=parseObjectId(a_tutor);
  const studentId=parseObjectId(a_student);
  
  attendees=[{ _id: parseObjectId(attendees[0])},
  {_id: parseObjectId(attendees[1])}];


  const result = await new events({date:date, start_time:start_time, end_time:end_time, title:title, description:description, location:location, tutor:tutorId, student:studentId, attendees: attendees});
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


function getMonth(monthStr){
  return new Date(monthStr+'-1-01').getMonth()+1
}

router.post('/form/post', (req, res, next) => {
  if(req.session.user) {
    try {
      const result = Joi.validate(req.body, reqSchema)
      if (result.error) {
        req.flash('error', 'The data entered is not valid. Please try again.')
        res.redirect('/dashboard')
        return;
         }
        else {
          let date=String(result.value.date).split(" ")
          let newEvent={
          title: result.value.title,
          month: getMonth(date[1]),
          day: date[2],
          year: date[3],
          start_time: String(result.value.start_time),
          end_time: String(result.value.end_time),
          description: result.value.description,
          location: result.value.location,
          // attendees: [ObjectId], gonna use 2 data fields to specify who's the tutor and who's the student
          tutor: req.session.tutor, 
          student: req.session.user._id,
          state: 0
          }
          const request = new requests(newEvent)
          request.save();
          res.redirect('/tutors');
          return;
        }
       } catch(error) {
         next(error)
      }
  } else {
    res.redirect('/users/login')
  }
});


router.route('/').get(async (req,res)=>{
  if (req.session.user) {
    // req.session.user
    // users.find({});
   let eventList=await parseEvent(req.session.user._id);
   if(eventList){
   res.render('partials/calendar_demo',{ layout:"dashboardLayout", pageHeader:"Calendar", username: req.session.user.username, events: JSON.stringify(eventList)});
   return;
  }
  else { 
    res.render('partials/calendar_demo',{ layout:"dashboardLayout", pageHeader:"Calendar", username: req.session.user.username, events: JSON.stringify([])});
    return;
   }
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
