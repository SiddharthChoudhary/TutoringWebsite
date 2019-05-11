var express = require('express');
var router = express.Router();
var session = require('express-session');
const User = require('../modals/user').model
const Joi = require('joi')

const profileSchema = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  bio: Joi.string().min(1).max(300).required(),
  gender:Joi.string().valid("Male", "Female").required(),
  tutor_position: Joi.string(),
  subject: Joi.string().required()
})

/* GET home page. */
router.get('/' , function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    res.render('partials/default',{layout:"dashboardLayout", username:req.session.user.username});
  } else {
    res.redirect('users/login');
  }
  
});

router.get('/dashboard', async function(req,res,next){
  if(!req.session.user && !req.cookies.user_sid){
    res.redirect('users/login')
    console.log("dash")
  }else{
    //console.log(req.session.user);
    res.render('partials/default',{layout:"dashboardLayout", pageHeader:"Dashboard", username: req.session.user.username})
     
    }
    
});
/* GET calendar. */
// router.get('/calendar' , function(req, res, next) {
//   if (req.session.user && req.cookies.user_sid) {
//     let events=[
//         {"Year": 2019, "Month":5, "Day":7, 'Title': 'Doctor appointment at 3:25pm.', 'Info': 'See you at 10 am.'},
//         {"Year": 2019, "Month":5, "Day":17,'Title': 'New Garfield movie comes out!', 'Info': 'See you'},
//         {"Year": 2019, "Month":5, "Day":2, 'Title': '25 year anniversary'},
//       ];
//     res.render('partials/calendar_demo',{layout:"dashboardLayout", pageHeader:"Calendar", username: req.session.user.username, events: JSON.stringify(events)});
  
//   } else {
//     res.redirect('users/login');
//   }
  
// });

/* GET forum */
// router.get('/forum' , function(req, res, next) {
//   if (req.session.user && req.cookies.user_sid) {
//     res.render('partials/forum',{layout:"main"});
//   } else {
//     res.redirect('users/login');
//   }
  
// });

/* GET profile */
router.get("/profile_page",(req, res)=>{
  if (req.session.user && req.cookies.user_sid) {
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
  if (req.session.user && req.cookies.user_sid) {
    
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
    console.log(result.value );
    await User.updateOne({_id: req.session.user._id},{ $set:{profile: result.value}});
    //console.log(doc);

   req.session.user.profile=result.value;

    res.redirect("/profile_page");
  })


  router.get(('/tutors'),async (req, res)=>{
  if (req.session.user && req.cookies.user_sid) {
    const ppl= await User.find({"profile.tutor_position": "Taken"})
    //query.exec(function (err, docs) {});
    if(ppl.length){
      tutors=ppl;
      res.render('partials/tutors',{layout:"dashboardLayout", pageHeader:"Tutors", username: req.session.user.username, tutors:tutors});
      return
    }else{
      req.flash("error","No tutors available")
      res.redirect('/dashboard')
      return
    }
  } else {
    res.redirect('users/login');
  }
 })

module.exports = router;
