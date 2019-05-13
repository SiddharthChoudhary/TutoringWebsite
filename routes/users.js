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
  if (req.session.user) {
    res.render('partials/default',{layout:"dashboardLayout", username:req.session.user.username});
  } else {
    res.redirect('users/login');
  }
  
});

router.get('/dashboard', async function(req,res,next){
  if(!req.session.user){
    res.redirect('users/login')
  }else{
    //console.log(req.session.user);
    let user =  await User.find({'username':req.session.user.username})
    let ifTutor = false
    if(user){
      if(user[0].profile.tutor_position=='Taken'){
        ifTutor = true
      }
    }
    res.render('partials/default',{layout:"dashboardLayout", pageHeader:"Dashboard", username: req.session.user.username,'ifTutor':ifTutor})
    }
    
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
    console.log(result.value );
    const updateInfo=await User.updateOne({_id: req.session.user._id},{ $set:{profile: result.value}});
    if (updateInfo.updatedCount === 0) {
      req.flash("error", "Could not update link with id of "+ '${id}');
      res.redirect("/profile_form");
  }

    req.session.user.profile=result.value;
    req.flash("success", "The file is successfully updated!")
    res.redirect("/profile_page");
  })

module.exports = router;
