const events = require('../modals/event').model;
const users = require('../modals/user').model;
const files = require('../modals/resource').model;
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
      throw "ObjectId is invalid!";
  }
};


async function isValidURL(value){
    {
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
        var regexp = new RegExp(expression);
        if(regexp.test(value)){
          let match=await files.findOne({link: value})
          if (match===null){
            return true;
          }
          else{
            return false
          }
        }
    } 
  }

  async function isValidURLUponUpdate(link, id){
     if(!await isValidURL(link)){
      let match=await files.find({link: link})
      for(let i=0;i< match.length; i++){
        if(String(match[i]._id)!== String(id)){
          return false;
        }
      }return true;
     }
  }

  async function getById(id){
    const parsedId=parseObjectId(id);
    const result=await events.find({"attendees._id":parsedId});
    return result;
  }

//for student
async function parseEvent(events, id){
    
    if (events.length!== 0) {
      let eventList=[];
      for (let i=0; i<events.length;i++){
         //console.log(tutor)
         let role;
         let name;
         if(String(id) === String(events[i].student)){
          const parsedId=parseObjectId(events[i].tutor)
          const tutor=await users.find({_id: parsedId});
          name= tutor[0].profile.firstname +" "+tutor[0].profile.lastname;
          role="Tutor"
         }else {
          const parsedId=parseObjectId(events[i].student)
          const student=await users.find({_id: parsedId});
          role="Student"
          name=student[0].profile.firstname +" "+student[0].profile.lastname;
        }
         const time=events[i].start_time+"-"+events[i].end_time
         const info={title: events[i].title, role: role, participant: name, location: events[i].location, 
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
    title: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().uri().required()
  })

  router.get(('/'),async (req, res)=>{
    if (req.session.user) {
      const ppl= await users.find({"profile.tutor_position": "Taken"})
      //query.exec(function (err, docs) {});
      

      if(ppl.length){
        for(let i=0;i< ppl.length; i++){
            if(String(ppl[i]._id) === String(req.session.user._id)){
                ppl.splice(i,1)
                console.log("removed self")
            }
        }
        let tutors=ppl;
        res.render('partials/tutors',{layout:"dashboardLayout", pageHeader:"Tutors", username: req.session.user.username, tutors:tutors});
        return;
      }else{
        req.flash("error","No tutors are available now. Check back later. ")
        res.redirect('/dashboard')
        return;
      }
    } else {
      res.redirect('users/login');
    }
   })

//route for viewing tutor's posted resources
router.get('/resource/:id', async function(req, res, next){
    if(!req.session.user){
      res.redirect('users/login')
      return;
    }else{
      //console.log(req.session.user);
      const parsedId=parseObjectId(req.params.id);
      const allFiles= await files.find({creator: parsedId})
      console.log(allFiles)
      res.render('resourceList',{layout:"dashboardLayout", pageHeader:"Uploaded Resources", username: req.session.user.username, files: allFiles})
      return;
      } 
  });
  //for viewing and editing self posted resources
  router.get('/resource', async function(req, res, next){
    if(!req.session.user){
      res.redirect('/users/login')
      return;
    }else{
      //console.log(req.session.user._id);
      const parsedId=parseObjectId(req.session.user._id);
      const allFiles= await files.find({creator: parsedId})
      if (allFiles.length===0) {
        req.flash("error", "Please upload at least one resource.");
        res.redirect("/dashboard");
        return;
       }
      console.log(allFiles)
      res.render('myResourceList',{layout:"dashboardLayout", pageHeader:"My Uploaded Resources", username: req.session.user.username, files: allFiles
       })
      return;
      } 
  });

  router.route('/delete/:id')
    .get(async (req,res)=>{
        if(!req.session.user){
            res.redirect('/users/login')
            return;
          }
          else{
        console.log("deleting")
        const parsedId=parseObjectId(req.params.id);
        let deletionInfo = await files.deleteOne({_id: parsedId})
        if (deletionInfo.deletedCount === 0) {
            req.flash("error", "Could not delete link with id of "+ '${parsedId}');
            res.redirect("/tutors/resource");
        }
        req.flash("success", "The link has been successfully removed!");
        res.redirect("/tutors/resource");
      }
    });

    router.route('/update/:id')
    .post(async (req,res)=>{
        if(!req.session.user){
            res.redirect('/users/login')
            return;
          }else{
        const parsedId=parseObjectId(req.params.id);
        const updateFile=req.body;
        const result = Joi.validate(req.body, uploadSchema)
        if (result.error || !await isValidURLUponUpdate(req.body.link, parsedId)) {
          req.flash('error', 'Data entered is not valid. Or the URL is invalid.');
          res.redirect("/tutors/resource");
          return;
        }
        let updateInfo = await files.updateOne({'_id': parsedId}, {$set: updateFile})
        if (updateInfo.updatedCount === 0) {
            req.flash("error", "Could not update link with id of "+ '${parsedId}');
            res.redirect("/tutors/resource");
        }
        req.flash("success", "The link has been successfully updated!")
        res.redirect("/tutors/resource");
        return;
      }
    }) //missing authentication
    .get(async (req,res)=>{
        if(!req.session.user){
            res.redirect('/users/login')
            return;
          }
          else{
        const parsedId=parseObjectId(req.params.id);
        const aFile= await files.findOne({_id: parsedId})
        if (aFile===null) throw "Could not add animal.";
        console.log(aFile)
        res.render('partials/resource_update',{layout:"dashboardLayout", pageHeader:"Edit Resource", username: req.session.user.username, 
        id: parsedId, title: aFile.title, description: aFile.description, link:aFile.link})
        return;
          }
    });



  //route for viewing tutor events
router.get("/event/:id", async (req, res)=>{
    if (req.session.user) {
    //  req.session.tutor=req.params.id;
     const events=await getById(req.params.id);
     let eventList=await parseEvent(events, req.params.id);
     //console.log(eventList)
     if(eventList.length){
     res.render('partials/calendar_demo', {layout:"dashboardLayout", pageHeader:"Calendar", 
     username: req.session.user.username, events: JSON.stringify(eventList)});
     return;
    } else { 
      console.log("no event");
      res.render('partials/calendar_demo',{layout:"dashboardLayout", pageHeader:"Calendar", 
      username: req.session.user.username, events:false});
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
  router.post("/upload", async (req, res)=>{
    if (req.session.user) {
      const result = Joi.validate(req.body, uploadSchema)
      if (result.error || !await isValidURL(req.body.link)) {
        req.flash('error', 'Data entered is not valid. Or the URL is invalid.');
        res.redirect("/dashboard");
        return;
      }else {
        result.value.creator=req.session.user._id;
        //console.log(result.value.creator)

        const newFile = await new files(result.value)
        await newFile.save()
        req.flash('success', 'The resource has been successfully uploaded!');
        res.redirect("/dashboard");
        return;
      }
     
     } else {
       res.redirect('/users/login');
       return;
     }
  });

module.exports=router;