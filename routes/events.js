const events = require('../modals/event').model;
const users = require('../modals/user').model;
const requests = require('../modals/request').model;
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
    // const studId = req.session.user._id;
    // const tutorId = req.session.tutor;
    //console.log()

    // const request=req.body;
    try {
      const result = Joi.validate(req.body, reqSchema)
      if (result.error) {
        req.flash('error', 'The data entered is not valid. Please try again.')
        res.redirect('/dashboard')
        return;
         }
        else {
          //let date=String(result.value.date).split("-") 
          let date=String(result.value.date).split(" ")
          let newEvent={
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
          //console.log(String(result.value.start_time))
        }

       } catch(error) {
         next(error)
      }
    
    // if(!req.body.date){
    //   req.flash('error', "Please choose a date");
    //   res.redirect('/calendar/form');
    //   return;
    // }
    // if(!req.body.title){
    //   req.flash('error', "Please enter a title");
    //   res.redirect('/calendar/form');
    //   return;
    // }
    // if(!req.body.start_time){
    //   req.flash('error', "Please enter a title");
    //   res.redirect('/calendar/form');
    //   return;
    // }
    // if(!req.body.end_time){
    //   req.flash('error', "Please enter a title");
    //   res.redirect('/calendar/form');
    //   return;
    // }
    // if(req.body.description == ''){
    //   req.flash('error', "Please describe the event");
    //   res.redirect('/calendar/form');
    //   return;
    // }
    // if(req.body.location == ''){
    //   req.flash('error', "Please enter a location");
    //   res.redirect('/calendar/form');
    //   return;
    // }

    // const result = new requests({date: req.body.date, title:req.body.title, start_time:String(req.body.start_time), end_time:String(req.body.end_time), description: req.body.description, location: req.body.location, tutor:req.session.tutor, student:req.session.user._id, state: 0});
    // result.save();
    // res.redirect('/tutors');
  } else {
    res.redirect('/users/login')
  }
});

router.get("/event/:id", (req, res)=>{
  if (req.session.user) {
    req.session.tutor=req.params.id;
    res.render("requestForm", {layout:"dashboardLayout"});
    return;
   } else {
   res.redirect('/users/login');
   return;
   }
  //  res.render("requestForm", {layout:"dashboardLayout"});
});

router.get("/request/:id", (req, res)=>{
   req.session.tutor=req.params.id;

});

router.get("/event/:id", (req, res)=>{


});


router.route('/')
 .post((req,res)=>{
    
    // res.render('partials/login',{layout:"loginLayout"});
  })
  .get(async (req,res)=>{
  if (req.session.user) {
    // req.session.user
    // users.find({});
  const events=await getById(req.session.user._id)
  console.log(events)
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
  else{ 
    res.render('partials/calendar_demo',{layout:"dashboardLayout", pageHeader:"Calendar", username: req.session.user.username, events: JSON.stringify([])});
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
