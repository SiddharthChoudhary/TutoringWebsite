var express = require('express');
var router = express.Router();
const requests=require("../modals/request").model
const User = require('../modals/user').model
const Joi = require('joi')
const {ObjectId}=require("mongodb");

const profileSchema = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  bio: Joi.string().min(1).max(300).required(),
  gender:Joi.string().valid("Male", "Female").required(),
  tutor_position: Joi.string(),
  subject: Joi.string().required()
})

const searchSchema=Joi.object().keys({
  search: Joi.string().required()
})

function parseObjectId(id){ 
  id=String(id);  
  try { 
      return ObjectId.createFromHexString(id);
      
  } catch (e) {
      throw "ObjectId is invalid!";
  }
};

async function parseRequest(requests){
let requestList=[]
for (let i=0;i< requests.length;i++){
    let title=requests[i].title
    let date=(requests[i].month+1) +"/" + requests[i].day +"/"+requests[i].year
    let time=requests[i].start_time +"-" +requests[i].end_time
    let description=requests[i].description
    let location=requests[i].location
    let state;
    if(requests[i].state===0){
      state="Pending"
    } else if (requests[i].state===1){
      state="Approved"
    } else if(requests[i].state===2){
      state="Rejected"
    }
    const studentID=parseObjectId(requests[i].student)
    const student=await User.findOne({_id: studentID})
    if(student===null) {
      return false;
    }
    let studentReq;
    if(student.profile.firstname){
      studentReq= student.profile.firstname+" "+student.profile.lastname;
    }else {
      studentReq= "Username-"+student.username;
    }

    let request= {
        title: title,
        student: studentReq,
        date: date,
        time: time,
        description: description,
        location: location,
        state: state
    }
    requestList.push(request)
}
 return requestList;
}


/* GET home page. */
router.get('/' , function(req, res, next) {
  if (req.session.user){
    let ifTutor=false
    if(!req.session.user.profile || req.session.user.tutor_position !=="Taken"){
        res.render('partials/default',{layout:"dashboardLayout", pageHeader:"Dashboard", 
        username:req.session.user.username, ifTutor:ifTutor});
      }else{ifTutor=true;
    res.render('partials/default',{layout:"dashboardLayout", pageHeader:"Dashboard", 
    username:req.session.user.username, ifTutor:ifTutor});}
  } else {
    res.redirect('users/login');
  }
});

/* GET read more message page. */
router.get('/request' , async function(req, res, next) {
  if (req.session.user) {
      const allRequests=await requests.find({tutor: req.session.user._id});
      if(allRequests.length){
      const messages= await parseRequest(allRequests);
      if(!messages){
        req.flash("error", "The student with cannot be found.")
        res.redirect("/")
      }
      res.render('allRequests',{layout:"dashboardLayout", pageHeader: "My Received Request Messages", 
      username:req.session.user.username, requests: messages});
      } else{
        req.flash("error", "You do have any request message as a tutor.")
        res.redirect("/")
      }
    } else {
    res.redirect('users/login');
  }
});



router.get('/dashboard', async function(req,res,next){
  if(!req.session.user){
    res.redirect('users/login')
  }else{
    let ifTutor=false
    if(!req.session.user.profile || req.session.user.profile.tutor_position !=='Taken'){
       res.render('partials/default',{layout:"dashboardLayout", pageHeader:"Dashboard", 
       username: req.session.user.username,ifTutor:ifTutor})
    } else {
      ifTutor=true
      res.render('partials/default',{layout:"dashboardLayout", pageHeader:"Dashboard", 
      username: req.session.user.username, ifTutor:ifTutor})
    }}
  });


/* GET profile */
router.get("/profile_page",(req, res)=>{
  if (req.session.user) {
    if(req.session.user.profile){
      let profile=req.session.user.profile;
      
      res.render('partials/profile_page',{ layout:"dashboardLayout", pageHeader:"Profile", username: req.session.user.username, profile: profile});
    }else{
      res.render('partials/profile_update',{layout:"dashboardLayout", pageHeader:"Profile", username: req.session.user.username});
    }
}else res.redirect('users/login');
})

router.route('/profile_form')
 .get((req, res)=>{
  if (req.session.user) {
    
      if(req.session.user.profile){
      let user=req.session.user.profile;
      let firstname=user.firstname;
      let lastname=user.lastname;
      let bio=user.bio;
      res.render('partials/profile_update',{layout:"dashboardLayout", pageHeader:"Profile", username: req.session.user.username,
             firstname: firstname, lastname:lastname, bio: bio});
      }
      else res.render('partials/profile_update',{layout:"dashboardLayout", pageHeader:"Profile", username: req.session.user.username});
  
    }else res.redirect('users/login');
  
 })
  .post(async (req,res,next)=>{
    
    console.log(req.body)
    const result = Joi.validate(req.body, profileSchema)
    if (result.error) {
      req.flash('error', 'Please enter the fields required.')
      res.redirect('/profile_form')
      return
    }else {
     if(result.value.tutor_position){
      result.value.tutor_position="Taken";
      if (result.value.subject==="Choose..."){
      req.flash('error', 'Please pick your subject of teaching.')
      res.redirect('/profile_form')
       }
     }else {
       result.value.tutor_position="None";
       result.value.subject="None";
      }
    }
    //console.log(result.value );
    const updateInfo=await User.updateOne({_id: req.session.user._id},{ $set:{profile: result.value}});
    if (updateInfo.updatedCount === 0) {
      req.flash("error", "Could not update link with id of "+ '${id}');
      res.redirect("/profile_form");
  }

    req.session.user.profile=result.value;
    req.flash("success", "The file is successfully updated!")
    res.redirect("/profile_page");
  })



  //Zejie Yao section as below Edited and debugged by Jack
  
  async function findProfileByName (name){
    let n = name.toLowerCase()
    let matchedProfile = []
    let data = await User.find({});
    
    for(let i=0;i< data.length;i++){
        if(data[i].profile.firstname){
        console.log(data[i].profile)
        let firstname = data[i].profile.firstname.toLowerCase()
        let lastname= data[i].profile.lastname.toLowerCase()
        let username= data[i].username
        console.log(firstname)
        if( firstname.includes(n) || lastname.includes(n)
         || username.includes(n) ){
            matchedProfile.push(data[i]);
        }
    }
  }
    return matchedProfile
}

router.route('/search')
    .post( async (req,res)=>{
        //console.log("in search route")
        if(req.session.user){
        let result=Joi.validate(req.body, searchSchema)
        if (result.error) {
          req.flash('error', 'Data entered is not valid')
          res.redirect('/dashboard')
          return
        }
        // console.log(User.profile.firstname)
        console.log(req.body.search)
        let matchedProfile = await findProfileByName(req.body.search)
        
        if(!matchedProfile.length){
            req.flash("error", "There is no user found.")
            res.redirect("/dashboard")
            return
        }else{
        res.render('partials/profilefound',{
            profileName: req.body.search,
            found: matchedProfile,
            pageHeader:'Profile found', username: req.session.user.username
        })
        }}else {
          res.redirect("/users/login")
          return;}
    })

router.route('/details/:id')
    .get(async (req, res) => {
      if(req.session.user){
        try {
            let parsedId = parseObjectId(req.params.id)
            let profile = await User.findOne({_id: parsedId});
            if(profile===null){
              req.flash("error", "There is not any user with id "+"${parsedId}")
              res.redirect("/dashboard")
            }
            res.render('partials/profiledetail', {layout:"dashboardLayout", pageHeader:"Profile", 
            username: req.session.user.username, profile: profile.profile})
        } catch (e) {
            res.sendStatus(500);
        }
      } else {
        res.redirect("/users/login")
        return;}
    })



module.exports = router;
